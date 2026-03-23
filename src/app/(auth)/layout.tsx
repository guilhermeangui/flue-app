export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[402px] flex-col bg-white">
      {children}
    </div>
  );
}
