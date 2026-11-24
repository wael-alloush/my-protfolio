import { readMedia } from "@/lib/media";

type Context = { params: Promise<{ id: string; name: string }> };

/** صور المشاريع المرفوعة من لوحة التحكم. كل رفع جديد يأخذ رقماً جديداً، فالرابط لا يتغير محتواه. */
export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  if (!/^\d{1,10}$/.test(id)) return new Response(null, { status: 404 });

  const media = await readMedia(Number(id));
  if (!media) return new Response(null, { status: 404 });

  return new Response(new Uint8Array(media.data), {
    headers: {
      "Content-Type": media.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
