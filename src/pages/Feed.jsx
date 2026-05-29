export default function Feed() {
  return (
    <main className="pt-[62px] min-h-screen bg-[#F8F4EA]">
      <div className="bg-[#FDFAF4] border-b border-black/[0.09] px-20 py-10">
        <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-[#C8864B] mb-2">Community</p>
        <h1 className="text-[38px] font-black tracking-[-1.5px] text-[#1A1410] leading-[1.05]">
          What members <span className="text-[#252840]">share</span>
        </h1>
      </div>

      <div className="px-20 py-16">
        <div className="bg-[#FDFAF4] border border-black/[0.09] rounded-2xl p-10 text-center">
          <h2 className="text-[20px] font-black text-[#1A1410] mb-2">Feed backend missing</h2>
          <p className="text-[14px] text-[#7A6E5C] max-w-[520px] mx-auto leading-[1.6]">
            Static demo posts were removed. This page needs real post/feed backend routes before it can display persisted content.
          </p>
        </div>
      </div>
    </main>
  )
}
