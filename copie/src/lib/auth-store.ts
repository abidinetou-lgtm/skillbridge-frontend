// Mock auth — purely client-side. Used to switch navbar variant.
const KEY = "skillbridge:auth";

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}
export function setAuthed(v: boolean) {
  if (typeof window === "undefined") return;
  if (v) window.localStorage.setItem(KEY, "1");
  else window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("sb-auth-changed"));
}
