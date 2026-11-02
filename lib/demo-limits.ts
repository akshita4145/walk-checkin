// Demo-only limits, shared by the form (browser) and the API (server). Keep this
// file free of server imports so the form can use it.
export const ALLOWED_MINUTES = [1, 5, 15] as const;
export const MAX_LIVE_WALKS = 25;
