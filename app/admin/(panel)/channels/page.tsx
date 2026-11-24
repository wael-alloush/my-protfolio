import { saveChannels } from "@/app/admin/actions";
import { ChannelsForm } from "@/components/admin/ChannelsForm";
import { Notice, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { getChannelSettings } from "@/lib/settings";

export const metadata = { title: "التواصل والإعلانات" };

type Props = { searchParams: Promise<{ saved?: string }> };

export default async function ChannelsPage({ searchParams }: Props) {
  await requireAdmin();
  const [{ saved }, channels] = await Promise.all([searchParams, getChannelSettings()]);

  return (
    <>
      <PageHeader
        title="التواصل والإعلانات"
        description="عدّل رقم الجوال، حسابات التواصل، ومعرّفات منصات الإعلانات. التغيير يظهر في الموقع فوراً."
      />
      {saved === "1" ? (
        <div className="mb-5">
          <Notice tone="success">تم الحفظ. الروابط والسكربتات المحدّثة تظهر في الموقع الآن.</Notice>
        </div>
      ) : null}
      <ChannelsForm initial={channels} action={saveChannels} />
    </>
  );
}
