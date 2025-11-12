"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ServicesHeader, { type DurationPreset } from "./ServicesHeader";
import CategoryRail from "./CategoryRail";
import FiltersPanel, { type ServicesFilters } from "./FiltersPanel";
import ServicesGrid from "./ServicesGrid";
import ServiceQuickView from "./ServiceQuickView";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";
import { services } from "../data/mockUserServices";
import type { ServiceTag } from "../data/mockUserServices";
import { serviceCategories } from "../data/mockUserServicesCategories";

const PAGE_SIZE = 6;

const initialFilters = (): ServicesFilters => ({
  categories: [],
  duration: { min: null, max: null },
  price: { min: null, max: null },
  staff: [],
  location: null,
  tags: [],
});

const staffOptions = Array.from(
  new Map(
    services.flatMap((service) => service.staff.map((staff) => [staff.id, { id: staff.id, name: staff.name }]))
  ).values()
);

const locationOptions = Array.from(
  new Map(
    services.flatMap((service) => service.locations.map((loc) => [loc.id, { id: loc.id, label: loc.label }]))
  ).values()
);

const suggestions = services
  .map((service) => service.title)
  .slice(0, 6);

const categoryIndex = serviceCategories.reduce<Record<string, string[]>>((acc, category) => {
  const ids = [category.id, ...(category.children?.map((child) => child.id) ?? [])];
  acc[category.id] = ids;
  category.children?.forEach((child) => {
    acc[child.id] = [child.id];
  });
  return acc;
}, {});

function applyFilters(list: typeof services, search: string, category: string | null, quickFilters: { durationPreset: DurationPreset; priceRange: { min: number | null; max: number | null }; location: string | null; staffId: string | null }, filters: ServicesFilters) {
  const needle = search.trim().toLowerCase();
  return list.filter((service) => {
    if (category) {
      const allowed = categoryIndex[category];
      if (allowed && !allowed.includes(service.categoryId)) return false;
      if (!allowed && service.categoryId !== category) return false;
    }
    if (needle) {
      const haystack = [service.title, service.summary, service.description, ...service.highlights, ...service.tags];
      if (!haystack.some((value) => value.toLowerCase().includes(needle))) return false;
    }

    const durationMin = filters.duration.min ?? (quickFilters.durationPreset === "30" ? 0 : quickFilters.durationPreset === "60" ? 0 : quickFilters.durationPreset === "90" ? 90 : null);
    const durationMax = filters.duration.max ?? (quickFilters.durationPreset === "30" ? 30 : quickFilters.durationPreset === "60" ? 60 : null);
    if (durationMin !== null && service.duration < durationMin) return false;
    if (durationMax !== null && service.duration > durationMax) return false;

    const priceMin = filters.price.min ?? quickFilters.priceRange.min;
    const priceMax = filters.price.max ?? quickFilters.priceRange.max;
    if (priceMin !== null && service.price < priceMin) return false;
    if (priceMax !== null && service.price > priceMax) return false;

    const locationFilter = filters.location ?? quickFilters.location;
    if (locationFilter && !service.locations.some((loc) => loc.id === locationFilter)) return false;

    const staffFilter = filters.staff.length ? filters.staff : quickFilters.staffId ? [quickFilters.staffId] : [];
    if (staffFilter.length && !service.staff.some((staff) => staffFilter.includes(staff.id))) return false;

    if (filters.tags.length && !filters.tags.every((tag) => service.tags.includes(tag as ServiceTag))) return false;

    return true;
  });
}

export default function ServicesPageClient() {
  const router = useRouter();
  const params = useSearchParams();

  const [search, setSearch] = useState(() => params.get("q") ?? "");
  const [recent, setRecent] = useState<string[]>(() => (params.get("q") ? [params.get("q") ?? ""] : []));
  const [category, setCategory] = useState<string | null>(() => params.get("category"));
  const [filters, setFilters] = useState<ServicesFilters>(() => initialFilters());
  const [durationPreset, setDurationPreset] = useState<DurationPreset>("any");
  const [priceRange, setPriceRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [location, setLocation] = useState<string | null>(null);
  const [staffId, setStaffId] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickView, setQuickView] = useState<typeof services[number] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(
    () =>
      applyFilters(
        services,
        search,
        category,
        { durationPreset, priceRange, location, staffId },
        filters
      ),
    [search, category, durationPreset, priceRange, location, staffId, filters]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const items = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const updateParams = (next: { q?: string; category?: string | null }) => {
    const existing = new URLSearchParams(params.toString());
    if (next.q !== undefined) {
      if (!next.q) existing.delete("q");
      else existing.set("q", next.q);
    }
    if (next.category !== undefined) {
      if (!next.category) existing.delete("category");
      else existing.set("category", next.category);
    }
    router.replace(existing.toString() ? `/demo/user/services?${existing.toString()}` : `/demo/user/services`);
  };

  const handleSuggestion = (value: string) => {
    setSearch(value);
    setRecent((prev) => [value, ...prev.filter((item) => item !== value)].slice(0, 6));
    updateParams({ q: value });
    setCurrentPage(1);
  };

  const resetQuickFilters = () => {
    setDurationPreset("any");
    setPriceRange({ min: null, max: null });
    setLocation(null);
    setStaffId(null);
    setFilters(initialFilters());
    setCurrentPage(1);
  };

  const shown = Math.min(currentPage * PAGE_SIZE, filtered.length);

  return (
    <div className="flex flex-col gap-6 pb-24 lg:pb-0">
      <ServicesHeader
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        onSearchSubmit={() => {
          updateParams({ q: search });
          setRecent((prev) => (search ? [search, ...prev.filter((item) => item !== search)].slice(0, 6) : prev));
        }}
        durationPreset={durationPreset}
        onDurationPresetChange={(value) => {
          setDurationPreset(value);
          setCurrentPage(1);
        }}
        priceRange={priceRange}
        onPriceRangeChange={(partial) => {
          setPriceRange((prev) => ({ ...prev, ...partial }));
          setCurrentPage(1);
        }}
        location={location}
        onLocationChange={(value) => {
          setLocation(value);
          setCurrentPage(1);
        }}
        staffId={staffId}
        onStaffChange={(value) => {
          setStaffId(value);
          setCurrentPage(1);
        }}
        locations={locationOptions}
        staff={staffOptions}
        suggestions={suggestions}
        recent={recent}
        onSelectSuggestion={handleSuggestion}
        onResetQuickFilters={resetQuickFilters}
      />

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <CategoryRail
          active={category}
          onSelect={(value) => {
            setCategory(value);
            updateParams({ category: value });
            setCurrentPage(1);
          }}
          onOpenFilters={() => setMobileFiltersOpen(true)}
        />

        <div className="flex flex-col gap-6">
          <FiltersPanel
            mode="inline"
            value={filters}
            onChange={(next) => {
              setFilters(next);
              setCurrentPage(1);
            }}
            onReset={() => {
              setFilters(initialFilters());
              setCurrentPage(1);
            }}
            staffOptions={staffOptions}
            locationOptions={locationOptions}
          />

          <FiltersPanel
            mode="sheet"
            value={filters}
            visible={mobileFiltersOpen}
            onChange={(next) => {
              setFilters(next);
              setCurrentPage(1);
            }}
            onApply={() => setMobileFiltersOpen(false)}
            onClose={() => setMobileFiltersOpen(false)}
            onReset={() => {
              setFilters(initialFilters());
              setCurrentPage(1);
            }}
            staffOptions={staffOptions}
            locationOptions={locationOptions}
          />

          {items.length ? (
            <ServicesGrid services={items} onQuickView={(service) => setQuickView(service)} />
          ) : (
            <EmptyState />
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          <p className="text-xs text-[hsl(var(--muted))]">Показано {shown} из {filtered.length || services.length}</p>
        </div>
      </div>

      <ServiceQuickView service={quickView} open={Boolean(quickView)} onClose={() => setQuickView(null)} />
    </div>
  );
}
