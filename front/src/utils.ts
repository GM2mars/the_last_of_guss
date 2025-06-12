import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const q = {
  post: (url: string, data?: any) =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data || {}),
    }).then(res => res.json()),

  get: (url: string) =>
    fetch(url, {
      method: 'GET',
      credentials: 'include',
    }).then(res => res.json()),

  delete: (url: string) =>
    fetch(url, {
      method: 'DELETE',
      credentials: 'include',
    }).then(res => res.json()),
};