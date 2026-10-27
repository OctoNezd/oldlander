import { api, hasRedditAccess, redditOrigins } from "./access";

const button = document.getElementById("grant") as HTMLButtonElement;

async function showState() {
    document.body.classList.toggle("granted", await hasRedditAccess());
}

button.addEventListener("click", () => {
    // request() must run directly in the click handler, so nothing is awaited first.
    api.permissions
        .request({ origins: redditOrigins() })
        .then(showState)
        .catch((e) => console.error("OldLander: permission request failed", e));
});

// Access can also be granted from the add-on's settings while this page is open.
api.permissions.onAdded.addListener(showState);
showState();
