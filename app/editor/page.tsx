"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Stage, Layer, Group, Image as KonvaImage, Rect } from "react-konva";

type FlowerItem = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  timeIndex: number;
};

export default function EditorPage() {
  const router = useRouter();
  const stageRef = useRef<any>(null);

  const [flowerImages, setFlowerImages] = useState<HTMLImageElement[]>([]);
  const [gateImage, setGateImage] = useState<HTMLImageElement | null>(null);

  const [flowers, setFlowers] = useState<FlowerItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [applyToAll, setApplyToAll] = useState(false);
  const [gateOpacity, setGateOpacity] = useState(0.6);

  const changeTime = (direction: 1 | -1) => {
    setFlowers((prev) =>
      prev.map((f) => {
        if (!applyToAll && f.id !== selectedId) return f;

        return {
          ...f,
          timeIndex: (f.timeIndex + direction + 8) % 8,
        };
      })
    );
  };

  const handleGoResult = () => {
    setSelectedId(null);

    setTimeout(() => {
      const image = stageRef.current?.toDataURL();

      if (image) {
        sessionStorage.setItem("currentWorkImage", image);
      }

      router.push("/result");
    }, 50);
  };

  const handleBringForward = () => {
    if (selectedId === null) return;

    setFlowers((prev) => {
      const index = prev.findIndex((f) => f.id === selectedId);
      if (index === -1 || index === prev.length - 1) return prev;

      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const handleSendBackward = () => {
    if (selectedId === null) return;

    setFlowers((prev) => {
      const index = prev.findIndex((f) => f.id === selectedId);
      if (index <= 0) return prev;

      const next = [...prev];
      [next[index], next[index - 1]] = [next[index - 1], next[index]];
      return next;
    });
  };

  useEffect(() => {
    const loadImages = async () => {
      const paths = [
        "/TULIP_0.png",
        "/TULIP_1.png",
        "/TULIP_2.png",
        "/TULIP_3.png",
        "/TULIP_4.png",
        "/TULIP_5.png",
        "/TULIP_6.png",
        "/TULIP_7.png",
      ];

      const loadedImages = await Promise.all(
        paths.map(
          (src) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new window.Image();
              img.src = src;
              img.onload = () => resolve(img);
              img.onerror = () => reject(new Error(`画像読み込み失敗: ${src}`));
            })
        )
      );

      setFlowerImages(loadedImages);
    };

    loadImages();
  }, []);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/gate.png";
    img.onload = () => {
      setGateImage(img);
    };
  }, []);

  return (
    <main className="min-h-screen bg-neutral-100 flex justify-center p-3">
      <div className="w-[390px] border border-black bg-white">
        {/* Header */}
        <div className="h-[56px] border-b border-black flex items-center justify-between px-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-2xl leading-none"
            aria-label="Back to top"
          >
            ←
          </button>

          <div className="text-sm">「花と遊ぶ」MVP02</div>

          <button
            type="button"
            onClick={handleGoResult}
            className="px-3 py-1 border border-black rounded-full text-xs"
          >
            Save
          </button>
        </div>

        {/* Canvas */}
        <div className="border-b border-black bg-neutral-100 flex justify-center items-center h-[500px]">
          <Stage width={390} height={500} ref={stageRef}>
            <Layer>
              {gateImage && (
                <KonvaImage
                  image={gateImage}
                  x={75}
                  y={40}
                  width={240}
                  height={380}
                  opacity={gateOpacity}
                />
              )}

              {flowerImages.length > 0 &&
                flowers.map((flower) => (
                  <Group key={flower.id}>
                    {flower.id === selectedId && (
                      <Rect
                        x={flower.x - 6}
                        y={flower.y - 6}
                        width={132}
                        height={132}
                        rotation={flower.rotation}
                        scaleX={flower.scale}
                        scaleY={flower.scale}
                        stroke="#9CA3AF"
                        strokeWidth={1}
                        dash={[4, 4]}
                        listening={false}
                      />
                    )}

                    <KonvaImage
                      image={flowerImages[flower.timeIndex]}
                      x={flower.x}
                      y={flower.y}
                      width={120}
                      height={120}
                      draggable
                      rotation={flower.rotation}
                      scaleX={flower.scale}
                      scaleY={flower.scale}
                      opacity={flower.id === selectedId ? 1 : 0.8}
                      onClick={() => setSelectedId(flower.id)}
                      onTap={() => setSelectedId(flower.id)}
                      onDragEnd={(e) => {
                        setFlowers((prev) =>
                          prev.map((f) =>
                            f.id === flower.id
                              ? { ...f, x: e.target.x(), y: e.target.y() }
                              : f
                          )
                        );
                      }}
                    />
                  </Group>
                ))}
            </Layer>
          </Stage>
        </div>

        {/* Controls */}
        <div className="border-b border-black p-4 flex flex-col gap-4">
          {/* Top row */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const newId = Date.now();
                const randomX = 80 + Math.random() * 160;
                const randomY = 220 + Math.random() * 160;
                const randomTime = Math.floor(Math.random() * 8);

                setFlowers((prev) => [
                  ...prev,
                  {
                    id: newId,
                    x: randomX,
                    y: randomY,
                    rotation: 0,
                    scale: 1,
                    timeIndex: randomTime,
                  },
                ]);

                setSelectedId(newId);
              }}
              className="px-4 py-2 border border-black rounded-full text-sm"
            >
              Add
            </button>

            <div className="flex items-center gap-2 text-sm">
              <span>Background</span>

              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gateTone"
                  checked={gateOpacity === 0.8}
                  onChange={() => setGateOpacity(0.8)}
                />
                Dark
              </label>

              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gateTone"
                  checked={gateOpacity === 0.6}
                  onChange={() => setGateOpacity(0.6)}
                />
                Normal
              </label>

              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gateTone"
                  checked={gateOpacity === 0.3}
                  onChange={() => setGateOpacity(0.3)}
                />
                Light
              </label>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-end justify-between gap-4">
            {/* Move */}
            <div className="w-[120px] h-[140px] border border-black rounded-2xl px-3 pt-3 pb-5 flex flex-col items-center">
              <div className="text-base leading-none mb-3">Move</div>

              <div className="grid grid-cols-3 grid-rows-3 gap-1.5 place-items-center">
                <div></div>

                <button
                  type="button"
                  onClick={() =>
                    setFlowers((prev) =>
                      prev.map((f) =>
                        f.id === selectedId ? { ...f, y: f.y - 10 } : f
                      )
                    )
                  }
                  className="w-7 h-7 border border-black rounded-full text-base leading-none"
                >
                  ↑
                </button>

                <div></div>

                <button
                  type="button"
                  onClick={() =>
                    setFlowers((prev) =>
                      prev.map((f) =>
                        f.id === selectedId ? { ...f, x: f.x - 10 } : f
                      )
                    )
                  }
                  className="w-7 h-7 border border-black rounded-full text-base leading-none"
                >
                  ←
                </button>

                <div className="w-2.5 h-2.5 rounded-full bg-black"></div>

                <button
                  type="button"
                  onClick={() =>
                    setFlowers((prev) =>
                      prev.map((f) =>
                        f.id === selectedId ? { ...f, x: f.x + 10 } : f
                      )
                    )
                  }
                  className="w-7 h-7 border border-black rounded-full text-base leading-none"
                >
                  →

                </button>

                <div></div>

                <button
                  type="button"
                  onClick={() =>
                    setFlowers((prev) =>
                      prev.map((f) =>
                        f.id === selectedId ? { ...f, y: f.y + 10 } : f
                      )
                    )
                  }
                  className="w-7 h-7 border border-black rounded-full text-base leading-none"
                >
                  ↓
                </button>

                <div></div>
              </div>
            </div>

            {/* Scale */}
            <div className="w-[110px] h-[120px] border border-black rounded-2xl p-2 flex flex-col items-center justify-between">
              <div className="text-base leading-none mt-1">Scale</div>

              <div className="flex gap-3 mb-2">
                <button
                  type="button"
                  onClick={() =>
                    setFlowers((prev) =>
                      prev.map((f) =>
                        f.id === selectedId
                          ? { ...f, scale: f.scale + 0.1 }
                          : f
                      )
                    )
                  }
                  className="w-8 h-8 border border-black rounded-full text-lg leading-none"
                >
                  ＋
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFlowers((prev) =>
                      prev.map((f) =>
                        f.id === selectedId
                          ? { ...f, scale: Math.max(0.2, f.scale - 0.1) }
                          : f
                      )
                    )
                  }
                  className="w-8 h-8 border border-black rounded-full text-lg leading-none"
                >
                  －
                </button>
              </div>
            </div>



            {/* Rotate + Layer */}
            <div className="w-[128px] h-[190px] border border-black rounded-2xl p-2 flex flex-col justify-between">
              <div>
                <div className="text-base leading-none">Rotate</div>
                <div className="text-sm mt-2">
                  Value:{" "}
                  {selectedId === null
                    ? "-"
                    : `${flowers.find((f) => f.id === selectedId)?.rotation ?? 0}°`}
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFlowers((prev) =>
                      prev.map((f) =>
                        f.id === selectedId
                          ? { ...f, rotation: f.rotation - 15 }
                          : f
                      )
                    )
                  }
                  className="w-8 h-8 border border-black rounded-full text-lg leading-none"
                  disabled={selectedId === null}
                >
                  －
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFlowers((prev) =>
                      prev.map((f) =>
                        f.id === selectedId
                          ? { ...f, rotation: f.rotation + 15 }
                          : f
                      )
                    )
                  }
                  className="w-8 h-8 border border-black rounded-full text-lg leading-none"
                  disabled={selectedId === null}
                >
                  ＋
                </button>
              </div>

              <div className="border-t border-black pt-1">
                <div className="text-sm leading-none mb-2 text-center">Layer</div>

                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={handleBringForward}
                    disabled={selectedId === null}
                    className="w-full px-2 py-[3px] border border-black rounded-full text-[10px] leading-none disabled:opacity-40"
                  >
                    Bring Forward
                  </button>

                  <button
                    type="button"
                    onClick={handleSendBackward}
                    disabled={selectedId === null}
                    className="w-full px-2 py-[3px] border border-black rounded-full text-[10px] leading-none disabled:opacity-40"
                  >
                    Send Backward
                  </button>
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Time */}
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => changeTime(-1)} className="text-xl">
              ◀◀
            </button>

            <div className="text-2xl">🕒</div>

            <button type="button" onClick={() => changeTime(1)} className="text-xl">
              ▶▶
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={applyToAll}
              onChange={(e) => setApplyToAll(e.target.checked)}
            />
            All Flowers
          </label>
        </div>
      </div>
    </main>
  );
}