import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isAvailable(lastDate: string): boolean {
  if (!lastDate) return true; // Assume available if never donated
  const last = new Date(lastDate);
  const now = new Date();
  const diffInMs = now.getTime() - last.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  return diffInDays >= 90;
}
