"use client";
import { useState, useEffect } from "react";
import { subscribeToClasses } from "../lib/firebase/db";
import type { ClassWithId, ClassStatus } from "../types";

export function useClasses(statusFilter?: ClassStatus) {
  const [classes, setClasses] = useState<ClassWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToClasses((all) => {
      setClasses(statusFilter ? all.filter((c) => c.status === statusFilter) : all);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [statusFilter]);

  return { classes, loading };
}
