"use client";

import { useState, useEffect } from "react";
import {
  subscribeToClassTemplates,
  subscribeToTaxonomyCategories,
  subscribeToTaxonomyLocations,
} from "../lib/firebase/db";
import type { ClassTemplateWithId, TaxonomyTag } from "../types/classTemplate";

export function useClassTemplates() {
  const [templates, setTemplates] = useState<ClassTemplateWithId[]>([]);
  const [categories, setCategories] = useState<TaxonomyTag[]>([]);
  const [locations, setLocations] = useState<TaxonomyTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let resolved = 0;
    const check = () => {
      resolved++;
      if (resolved >= 3) setLoading(false);
    };
    const onErr = () => check(); // treat permission errors as empty results

    const unsubT = subscribeToClassTemplates((t) => { setTemplates(t); check(); }, onErr);
    const unsubC = subscribeToTaxonomyCategories((c) => { setCategories(c); check(); }, onErr);
    const unsubL = subscribeToTaxonomyLocations((l) => { setLocations(l); check(); }, onErr);

    return () => { unsubT(); unsubC(); unsubL(); };
  }, []);

  return { templates, categories, locations, loading };
}
