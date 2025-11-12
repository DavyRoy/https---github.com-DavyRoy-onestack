"use client";

import * as React from "react";
import {
  ADMIN_FEES_MATRIX as DEFAULT_MATRIX,
  ADMIN_FEES_PLANS as DEFAULT_PLANS,
  type FeeCell,
  type FeesPlan,
} from "../data/mockAdminPayments";

const KEY_MATRIX = "demo.admin.payments.matrix";
const KEY_PLANS  = "demo.admin.payments.plans";

function load<T>(key: string, def: T): T {
  if (typeof window === "undefined") return def;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return def;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T) : def;
  } catch { return def; }
}
function save<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function usePaymentsData() {
  const [matrix, setMatrix] = React.useState<FeeCell[]>(DEFAULT_MATRIX);
  const [plans, setPlans]   = React.useState<FeesPlan[]>(DEFAULT_PLANS);

  React.useEffect(() => {
    setMatrix(load(KEY_MATRIX, DEFAULT_MATRIX));
    setPlans(load(KEY_PLANS, DEFAULT_PLANS));
  }, []);

  const updateMatrix = (next: FeeCell[]) => { setMatrix(next); save(KEY_MATRIX, next); };
  const updatePlans  = (next: FeesPlan[]) => { setPlans(next);  save(KEY_PLANS, next); };

  return { matrix, plans, updateMatrix, updatePlans };
}