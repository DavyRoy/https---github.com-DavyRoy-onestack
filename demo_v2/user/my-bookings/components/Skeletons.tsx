export default function MyBookingsSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="h-28 animate-pulse rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/60" />
      ))}
    </div>
  );
}
