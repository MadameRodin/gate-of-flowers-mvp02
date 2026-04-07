import Link from "next/link";



export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-[390px] min-h-screen flex flex-col items-center px-4 py-6 gap-6">
        
        {/* HeaderArea */}
        <section className="w-full flex justify-center">
<h1 className="text-2xl font-semibold tracking-wide">
  地獄の門で、花と遊ぶ
</h1>
        </section>

        {/* VisualArea */}
        <section className="w-full h-[440px] border border-gray-300 rounded-2xl bg-gray-50 relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            VisualArea
          </div>

          {/* 仮の花 */}
          <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full border bg-white" />
          <div className="absolute bottom-10 left-28 w-20 h-20 rounded-full border bg-white" />
        </section>

        {/* ActionArea */}
        <section className="w-full flex flex-col items-center gap-4 py-2">
       
         <Link href="/works" className="text-sm">
  前の花に会う
</Link>
<Link
  href="/editor/new"
  className="px-6 py-3 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 transition"
>
  花をいける
</Link>        
        </section>

      </div>
    </main>
  );
}