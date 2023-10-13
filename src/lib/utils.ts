import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


// This code defines a helper function cn that combines the functionality 
// of clsx and twMerge to create an optimized string of class names 
// intended for use with Tailwind CSS.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
