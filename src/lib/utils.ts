import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


// This code defines a helper function cn that combines the functionality 
// of clsx and twMerge to create an optimized string of class names 
// intended for use with Tailwind CSS.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}${path}`
  return `http://localhost:${process.env.PORT ?? 3000
    }${path}`
}