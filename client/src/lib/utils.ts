import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge";
import { serverBaseUrl, clientBaseUrl } from "@/lib/data";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function externalNavigation(url: string) {
  window.location.href = url;
}

export function loginNavigation() {
  externalNavigation(
    `${serverBaseUrl}/auth/login?successUrl=${clientBaseUrl}`
  )
}