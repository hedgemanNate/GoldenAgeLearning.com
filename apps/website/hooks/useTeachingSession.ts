"use client";

import { useEffect, useState, useCallback } from "react";
import {
  subscribeToTeachingSession,
  startTeachingSession,
  endTeachingSession,
  setTeachingSessionSlide,
  setTeachingSessionMode,
  bindTeachingSessionDisplay,
  getTeachingSession,
} from "../lib/firebase/db";
import { useAuthContext } from "../context/AuthContext";
import type {
  TeachingSession,
  TeachingSessionMode,
} from "../types/teachingSession";

// Live subscription for the current logged-in staff user's session.
// One session per staff user; the session id is the staff uid.
export function useTeachingSession() {
  const { user } = useAuthContext();
  const ownerId = user?.uid ?? null;
  const [session, setSession] = useState<TeachingSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!ownerId) {
      setSession(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeToTeachingSession(ownerId, (s) => {
      setSession(s);
      setLoading(false);
    });
    return () => unsub();
  }, [ownerId]);

  const start = useCallback(
    async (params: { classSlug: string; totalSlides: number }) => {
      if (!user) throw new Error("Not signed in");
      await startTeachingSession({
        ownerId: user.uid,
        ownerName: user.name,
        classSlug: params.classSlug,
        totalSlides: params.totalSlides,
      });
    },
    [user]
  );

  const end = useCallback(async () => {
    if (!ownerId) return;
    await endTeachingSession(ownerId);
  }, [ownerId]);

  const goToSlide = useCallback(
    async (slide: number) => {
      if (!ownerId || !session) return;
      const clamped = Math.max(0, Math.min(session.totalSlides - 1, slide));
      await setTeachingSessionSlide(ownerId, clamped);
    },
    [ownerId, session]
  );

  const next = useCallback(async () => {
    if (!session) return;
    await goToSlide(session.currentSlide + 1);
  }, [session, goToSlide]);

  const previous = useCallback(async () => {
    if (!session) return;
    await goToSlide(session.currentSlide - 1);
  }, [session, goToSlide]);

  const setMode = useCallback(
    async (mode: TeachingSessionMode) => {
      if (!ownerId) return;
      await setTeachingSessionMode(ownerId, mode);
    },
    [ownerId]
  );

  return {
    ownerId,
    session,
    loading,
    isActive: !!session && session.status === "active",
    start,
    end,
    next,
    previous,
    goToSlide,
    setMode,
  };
}

// Hook used by the display device. It looks up the session for a known owner
// (the staff user who started it) and writes a one-time displayBindId so the
// system can detect a second display attempting to take over.
export function useTeachingSessionDisplay(ownerId: string | null) {
  const [session, setSession] = useState<TeachingSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [bindId] = useState<string>(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  );

  useEffect(() => {
    if (!ownerId) {
      setSession(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeToTeachingSession(ownerId, (s) => {
      setSession(s);
      setLoading(false);
    });
    return () => unsub();
  }, [ownerId]);

  // Bind on mount once we have an active session
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!ownerId) return;
      const current = await getTeachingSession(ownerId);
      if (!current || current.status !== "active") return;
      if (cancelled) return;
      await bindTeachingSessionDisplay(ownerId, bindId);
    })();
    return () => {
      cancelled = true;
    };
  }, [ownerId, bindId]);

  const isReplaced =
    !!session && !!session.displayBindId && session.displayBindId !== bindId;

  return { session, loading, bindId, isReplaced };
}
