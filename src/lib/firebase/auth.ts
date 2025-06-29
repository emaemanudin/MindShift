
// src/lib/firebase/auth.ts
import type { UserCredential, User } from "firebase/auth";

// NOTE: All Firebase authentication functions have been disabled for development.
// They will return dummy promises and perform no actions.

export async function signUpWithEmailAndPassword(
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> {
  console.log("Auth Disabled: signUpWithEmailAndPassword called but not executed.");
  return Promise.resolve({} as UserCredential);
}

export async function signInUserWithEmailAndPassword(
  email: string,
  password: string
): Promise<UserCredential> {
  console.log("Auth Disabled: signInUserWithEmailAndPassword called but not executed.");
  return Promise.resolve({} as UserCredential);
}

export async function signOutUser(): Promise<void> {
  console.log("Auth Disabled: signOutUser called but not executed.");
  return Promise.resolve();
}

export function getCurrentUser(): User | null {
  // Since we are using a mock provider, this function is less relevant,
  // but we will make it return null to align with a "logged out" state
  // if it were ever called directly.
  return null;
}
