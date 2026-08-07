'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type WishlistContextValue = {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
};

const STORAGE_KEY = 'jevtic.wishlist';

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSlugs(JSON.parse(raw) as string[]);
    } catch {
      /* start empty */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {
      /* ignore */
    }
  }, [slugs]);

  const toggle = useCallback((slug: string) => {
    setSlugs((current) =>
      current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setSlugs((current) => current.filter((s) => s !== slug));
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({ slugs, has: (slug) => slugs.includes(slug), toggle, remove }),
    [slugs, toggle, remove]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider');
  return context;
}
