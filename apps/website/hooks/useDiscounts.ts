"use client";
import { useState, useEffect } from "react";
import { subscribeToDiscounts } from "../lib/firebase/db";
import type { DiscountWithId, DiscountStatus } from "../types";

export function useDiscounts(statusFilter?: DiscountStatus) {
  const [discounts, setDiscounts] = useState<DiscountWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToDiscounts((all) => {
      setDiscounts(statusFilter ? all.filter((d) => d.status === statusFilter) : all);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [statusFilter]);

  return { discounts, loading };
}
