import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-100 flex justify-center p-3">
      <div className="w-[390px] border border-black bg-white">
        <div className="h-[56px] border-b border-black flex items-center justify-center">
          <div className="text-sm">「花と遊ぶ」MVP02</div>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 h-[720px]">
          <Link
            href="/editor"
            className="w-[220px] h-[56px] border border-black rounded-full text-base flex items-center justify-center"
          >
            花をいける
          </Link>

          <Link
            href="/gallery"
            className="w-[220px] h-[56px] border border-black rounded-full text-base flex items-center justify-center"
          >
            作品を見る
          </Link>
        </div>
      </div>
    </main>
  );
}