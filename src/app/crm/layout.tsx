import type { Metadata } from "next";
export const metadata: Metadata = { title: "OneStack CRM", robots: "noindex" };
export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return <div className="crm-root min-h-screen bg-background text-foreground">{children}</div>;
}
