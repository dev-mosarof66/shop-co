import { useState, useEffect } from 'react';

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

const STORAGE_KEY = 'shopco_reviews';

function load(): Review[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Review[]) : [];
  } catch {
    return [];
  }
}

function save(reviews: Review[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

export function useReviews(productId: string) {
  const [all, setAll] = useState<Review[]>(load);

  useEffect(() => {
    setAll(load());
  }, [productId]);

  const reviews = all.filter(r => r.productId === productId);

  const addReview = (data: { authorName: string; rating: number; comment: string }) => {
    const review: Review = {
      id: Math.random().toString(36).slice(2),
      productId,
      date: new Date().toISOString(),
      ...data,
    };
    const updated = [review, ...all];
    save(updated);
    setAll(updated);
  };

  return { reviews, addReview };
}
