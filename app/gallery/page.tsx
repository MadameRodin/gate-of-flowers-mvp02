"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Work = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  image: string;
};

export default function GalleryPage() {
  const router = useRouter();
  const [works, setWorks] = useState<Work[]>([]);

  const handleDelete = (id: string) => {
    const ok = window.confirm("この作品を削除しますか？");
    if (!ok) return;

    const updatedWorks = works.filter((work) => work.id !== id);
    setWorks(updatedWorks);
    localStorage.setItem("works", JSON.stringify(updatedWorks));
  };

  useEffect(() => {
    const saved = localStorage.getItem("works");
    if (saved) {
      setWorks(JSON.parse(saved));
    }
  }, []);

  return (
    <main className="min-h-screen bg-neutral-100 flex justify-center p-3">
      <div className="w-[390px] border border-black bg-white">
        {/* Header */}
        <div className="h-[56px] border-b border-black flex items-center justify-between px-3">
          <button
            onClick={() => router.push("/")}
            className="text-2xl leading-none"
            aria-label="Back to top"
          >
            ←
          </button>

          <div className="text-sm">「花と遊ぶ」MVP02</div>

          <div className="w-[56px]" />
        </div>

        {/* List */}
        <div className="p-3 flex flex-col gap-4 min-h-[720px]">
          {works.length === 0 ? (
            <div className="text-center text-sm pt-10 text-gray-500">
              まだ作品はありません
            </div>
          ) : (
            works.map((work) => (
              <div
                key={work.id}
                className="border border-black rounded-2xl p-3 flex gap-3 items-start"
              >
                <Link
                  href={`/detail/${work.id}`}
                  className="block shrink-0"
                >
                  <img
                    src={work.image}
                    alt="作品"
                    className="w-[110px] h-[140px] object-contain"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <p className="text-2xl leading-none mb-2">{work.createdAt}</p>
                  <p className="text-sm mb-1">{work.title || "タイトル"}</p>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {work.message || "メッセージ"}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(work.id)}
                  className="border border-black rounded-md px-2 py-1 text-xs shrink-0"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}