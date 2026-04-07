"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Work = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  image: string;
};

export default function DetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [work, setWork] = useState<Work | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("works");
    if (!saved) return;

    const works: Work[] = JSON.parse(saved);
    const found = works.find((w) => w.id === id) || null;
    setWork(found);
  }, [id]);

  return (
    <main className="min-h-screen bg-neutral-100 flex justify-center p-3">
      <div className="w-[390px] border border-black bg-white">
        {/* Header */}
        <div className="h-[56px] border-b border-black flex items-center justify-between px-3">
          <button
            onClick={() => router.push("/gallery")}
            className="text-2xl leading-none"
            aria-label="Back to gallery"
          >
            ←
          </button>

          <div className="text-sm">「花と遊ぶ」MVP02</div>

          <div className="w-[56px]" />
        </div>

        {!work ? (
          <div className="p-6 text-center text-sm">作品が見つかりません</div>
        ) : (
          <>
            {/* Preview */}
            <div className="border-b border-black bg-neutral-100 flex justify-center items-center min-h-[460px] p-6">
              <img
                src={work.image}
                alt="作品"
                className="max-w-[300px] max-h-[380px] object-contain"
              />
            </div>

            {/* Detail */}
            <div className="p-4 flex flex-col items-center min-h-[190px]">
              <div className="w-[260px]">
                <p className="text-sm mb-8">{work.title || "タイトル"}</p>

                <p className="text-sm mb-14">
                  {work.message || "メッセージ"}
                </p>

                <p className="text-2xl text-center">{work.createdAt}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}