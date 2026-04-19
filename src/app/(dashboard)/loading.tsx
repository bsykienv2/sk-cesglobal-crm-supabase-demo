export default function DashboardLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-pale-cyan border-t-terracotta animate-spin"></div>
        <div className="absolute w-6 h-6 rounded-full bg-white opacity-20"></div>
      </div>
      <p className="mt-6 text-sm font-semibold text-stone-gray animate-pulse tracking-widest uppercase">
        Đang tải dữ liệu...
      </p>
    </div>
  );
}
