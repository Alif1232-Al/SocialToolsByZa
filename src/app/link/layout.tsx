export default function LinkLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 overflow-y-auto z-50 bg-gray-50">
      {children}
    </div>
  );
}
