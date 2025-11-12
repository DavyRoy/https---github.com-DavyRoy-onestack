export function BookingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="h-32 animate-pulse rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/60" />
      ))}
    </div>
  );
}
