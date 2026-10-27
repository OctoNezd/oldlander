import type browserType from "webextension-polyfill";

// Use the browser's own promise API instead of the polyfill, so these small
// scripts don't pull in the vendor bundle.
export const api = ((globalThis as any).browser ??
    (globalThis as any).chrome) as typeof browserType;

export const redditOrigins = () => api.runtime.getManifest().host_permissions ?? [];

// Firefox treats Manifest V3 host permissions as optional and doesn't grant
// them when an update adds them (bug 1893232), so OldLander can end up
// installed but unable to run on reddit.
export const hasRedditAccess = () =>
    api.permissions.contains({ origins: redditOrigins() });
