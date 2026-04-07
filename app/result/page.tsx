"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Work = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  image: string;
};

export default function ResultPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    const savedImage = sessionStorage.getItem("currentWorkImage");
    if (savedImage) {
      setImage(savedImage);
    }

    setCreatedAt(new Date().toLocaleString("ja-JP"));
  }, []);

  const handleSave = () => {
    if (!image) {
      alert("作品画像がありません");
      return;
    }

    const newWork: Work = {
      id: Date.now().toString(),
      title: title || "無題",
      message,
      createdAt: createdAt || new Date().toLocaleString("ja-JP"),
      image,
    };

    const existing = localStorage.getItem("works");
    const works: Work[] = existing ? JSON.parse(existing) : [];

    const updatedWorks = [newWork, ...works];
    localStorage.setItem("works", JSON.stringify(updatedWorks));

    router.push("/gallery");
  };

  return (
    <main className="min-h-screen bg-neutral-100 flex justify-center p-3">
      <div className="w-[390px] border border-black bg-white">
        {/* Header */}
        <div className="h-[56px] border-b border-black flex items-center justify-between px-3">
          <button
            type="button"
            onClick={() => router.push("/editor")}
            className="text-2xl leading-none"
            aria-label="Back to editor"
          >
            ←
          </button>

          <div className="text-sm">「花と遊ぶ」MVP02</div>

          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1 border border-black rounded-full text-xs"
          >
            Save
          </button>
        </div>

        {/* Preview */}
        <div className="border-b border-black bg-neutral-100 flex justify-center items-center min-h-[460px] p-6">
          {image ? (
            <img
              src={image}
              alt="作品プレビュー"
              className="max-w-[300px] max-h-[380px] object-contain"
            />
          ) : (
            <div className="text-sm text-gray-500">No preview</div>
          )}
        </div>

        {/* Form */}
        <div className="border-b border-black p-4 flex flex-col items-center">
          <p className="text-lg mb-3">あなたの作品が　生まれました</p>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[260px] border border-black px-2 py-2 text-sm mb-4"
            placeholder="タイトル"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-[260px] h-[72px] border border-black px-2 py-2 text-sm resize-none"
            placeholder="メッセージ"
          />

          <p className="mt-3 text-xl">{createdAt}</p>
        </div>

        {/* Bottom button */}
        <div className="p-3 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/gallery")}
            className="flex-1 border border-black rounded-xl py-3 text-base shadow-sm max-w-[140px]"
          >
            Gallery
          </button>
        </div>
      </div>
    </main>
  );
}