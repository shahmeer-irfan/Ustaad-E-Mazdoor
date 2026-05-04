export function JobCardSkeleton() {
  return (
    <div className="bg-white border border-[#E9D5FF] rounded-2xl p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-5 bg-[#F3F4F6] rounded-lg w-3/4" />
        <div className="h-6 bg-[#EDE9FE] rounded-full w-20" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-4 bg-[#F3F4F6] rounded w-full" />
        <div className="h-4 bg-[#F3F4F6] rounded w-5/6" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-[#F3F4F6] rounded-full w-20" />
        <div className="h-6 bg-[#F3F4F6] rounded-full w-24" />
      </div>
      <div className="border-t border-[#F3F4F6]" />
      <div className="flex items-center justify-between">
        <div className="h-5 bg-[#EDE9FE] rounded w-28" />
        <div className="h-9 bg-[#EDE9FE] rounded-xl w-20" />
      </div>
    </div>
  );
}

export function FreelancerCardSkeleton() {
  return (
    <div className="bg-white border border-[#E9D5FF] rounded-2xl p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#EDE9FE]" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 bg-[#F3F4F6] rounded w-1/2" />
          <div className="h-3 bg-[#F3F4F6] rounded w-1/3" />
        </div>
      </div>
      <div className="h-6 bg-[#EDE9FE] rounded-full w-24" />
      <div className="flex flex-col gap-2">
        <div className="h-4 bg-[#F3F4F6] rounded w-full" />
        <div className="h-4 bg-[#F3F4F6] rounded w-4/5" />
      </div>
      <div className="border-t border-[#F3F4F6]" />
      <div className="flex items-center justify-between">
        <div className="h-5 bg-[#EDE9FE] rounded w-24" />
        <div className="h-9 bg-[#EDE9FE] rounded-xl w-20" />
      </div>
    </div>
  );
}
