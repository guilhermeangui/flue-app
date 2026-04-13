export function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-start justify-center md:items-center md:p-6">
      <div className="flex min-h-dvh w-full max-w-[402px] flex-col bg-white md:min-h-0 md:h-[874px] md:rounded-[40px] md:shadow-2xl md:ring-1 md:ring-black/5 md:overflow-hidden">
        {children}
      </div>
    </div>
  );
}
