import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge";
import { serverBaseUrl, clientBaseUrl } from "@/lib/data";
import { toast } from "sonner";

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

export function SessionExpired() {
  return toast("Your session has expired.", {
    description: "Please Login again.",
    action: {
      label: "Login",
      onClick: () => loginNavigation()
    },
    cancel: {
      label: 'Cancel',
      onClick: () => { }
    }
  })
}

export function YouAreLoggedOut() {
  return toast(
    "You are logged out.", {

    action: {
      label: "Login Again",
      onClick: () => loginNavigation()
    },
    cancel: {
      label: 'Cancel',
      onClick: () => { }
    }
  }
  )
}