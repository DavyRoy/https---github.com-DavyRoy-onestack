import DemoDockMenu from '@/components/demo/DemoDockMenu';

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen bg-black text-white"
      style={{ paddingBottom: 'calc(140px + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="relative z-10">
        {children}
      </div>
      <DemoDockMenu />
    </div>
  );
}
