import { api, hasRedditAccess } from "./hostAccess/access";

// Covers fresh installs and updates, including the MV2 -> MV3 update, which
// left existing Firefox users without access to reddit.
api.runtime.onInstalled.addListener(async () => {
    if (!(await hasRedditAccess())) {
        await api.tabs.create({ url: api.runtime.getURL("permissions.html") });
    }
});
