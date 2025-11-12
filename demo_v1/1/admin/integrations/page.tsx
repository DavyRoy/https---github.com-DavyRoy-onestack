"use client";
import IntegrationsHero from "./components/IntegrationsHero";
import IntegrationsStats from "./components/IntegrationsStats";
import QuickActions from "./components/QuickActions";

export default function AdminIntegrationsHub() {
  return (
    <div className="grid gap-6">
      <IntegrationsHero />
      <IntegrationsStats />
      <QuickActions />
    </div>
  );
}