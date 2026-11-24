import { db, isDbConfigured, nowUtc } from "@/lib/db";
import {
  defaultAds,
  defaultSocial,
  siteDefaults,
  whatsappUrl,
  type AdsConfig,
  type SiteConfig,
  type SocialKey,
  type SocialLinks,
} from "@/lib/site";
import type { RowDataPacket } from "mysql2/promise";
import { cache } from "react";

const SETTINGS_KEY = "channels";

export type ChannelSettings = {
  phone: string;
  email: string;
  social: SocialLinks;
  ads: AdsConfig;
};

function cleanText(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanPhone(value: unknown) {
  return cleanText(value, 32).replace(/\D/g, "").slice(0, 20);
}

function cleanSocial(raw: unknown): SocialLinks {
  const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const next = { ...defaultSocial };
  for (const key of Object.keys(defaultSocial) as SocialKey[]) {
    next[key] = cleanText(source[key], 500);
  }
  return next;
}

function cleanAds(raw: unknown): AdsConfig {
  const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    gtmId: cleanText(source.gtmId, 40),
    googleAdsId: cleanText(source.googleAdsId, 40),
    metaPixelId: cleanText(source.metaPixelId, 40),
    tiktokPixelId: cleanText(source.tiktokPixelId, 40),
    snapchatPixelId: cleanText(source.snapchatPixelId, 40),
    linkedinPartnerId: cleanText(source.linkedinPartnerId, 40),
    clarityId: cleanText(source.clarityId, 40),
  };
}

export function defaultChannels(): ChannelSettings {
  return {
    phone: siteDefaults.phone,
    email: siteDefaults.email,
    social: { ...defaultSocial, ...pickSocial(siteDefaults.social) },
    ads: { ...defaultAds },
  };
}

function pickSocial(social: SiteConfig["social"]): SocialLinks {
  return {
    instagram: social.instagram,
    linkedin: social.linkedin,
    github: social.github,
    x: social.x,
    facebook: social.facebook,
    youtube: social.youtube,
    tiktok: social.tiktok,
    snapchat: social.snapchat,
  };
}

function toSiteConfig(channels: ChannelSettings): SiteConfig {
  const phone = channels.phone || siteDefaults.phone;
  return {
    ...siteDefaults,
    phone,
    email: channels.email || siteDefaults.email,
    social: {
      ...channels.social,
      whatsapp: whatsappUrl(phone),
    },
    ads: channels.ads,
  };
}

async function readStored(): Promise<ChannelSettings | null> {
  if (!isDbConfigured()) return null;
  try {
    const pool = await db();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT value FROM wa_settings WHERE name = ? LIMIT 1",
      [SETTINGS_KEY],
    );
    const raw = rows[0]?.value;
    if (typeof raw !== "string" || !raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const data = parsed as Record<string, unknown>;
    return {
      phone: cleanPhone(data.phone) || defaultChannels().phone,
      email: cleanText(data.email, 200) || defaultChannels().email,
      social: cleanSocial(data.social),
      ads: cleanAds(data.ads),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

/** إعدادات التواصل والإعلانات كما تُعرض في اللوحة. */
export const getChannelSettings = cache(async (): Promise<ChannelSettings> => {
  return (await readStored()) ?? defaultChannels();
});

/** إعدادات الموقع الحيّة: قاعدة البيانات إن وُجدت، وإلا القيم الافتراضية. */
export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  return toSiteConfig(await getChannelSettings());
});

export async function saveChannelSettings(input: ChannelSettings) {
  const channels: ChannelSettings = {
    phone: cleanPhone(input.phone),
    email: cleanText(input.email, 200),
    social: cleanSocial(input.social),
    ads: cleanAds(input.ads),
  };
  if (!channels.phone) throw new Error("phone_required");

  const pool = await db();
  await pool.query(
    `INSERT INTO wa_settings (name, value) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE value = VALUES(value)`,
    [SETTINGS_KEY, JSON.stringify(channels)],
  );
  // يخزّن وقت آخر حفظ لأغراض التشخيص فقط.
  await pool.query(
    `INSERT INTO wa_settings (name, value) VALUES ('channels_updated_at', ?)
     ON DUPLICATE KEY UPDATE value = VALUES(value)`,
    [nowUtc()],
  );
  return channels;
}
