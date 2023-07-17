import localforage from "localforage";

type subredditData = {
    url: string;
    display_name: string;
    icon_img: string;
};
type subredditDataWrapped = Record<"data", subredditData>;

function isSubredditData(item: any): item is subredditData {
    return (
        item instanceof Object &&
        "url" in item &&
        typeof item.url === "string" &&
        "display_name" in item &&
        typeof item.display_name === "string" &&
        "icon_img" in item &&
        typeof item.icon_img === "string"
    );
}
function isSubredditDataWrapped(item: any): item is subredditDataWrapped {
    return (
        item instanceof Object && "data" in item && isSubredditData(item.data)
    );
}
function isSubsListData(data: unknown): data is {
    after: string | null;
    children: unknown[];
} {
    return (
        data instanceof Object &&
        "after" in data &&
        (typeof data.after === "string" || data.after === null) &&
        "children" in data &&
        Array.isArray(data.children)
    );
}

export async function getSubreddits() {
    let subs: subredditDataWrapped[] = [];
    const age = parseInt(await localforage.getItem("subredditcache_age") || "NaN");
    const now = Math.floor(Date.now() / 1000);
    const cached = JSON.parse(await localforage.getItem("subredditcache_act") || "null");
    if (age + 60 * 60 < now || isNaN(age) || cached === null) {
        console.log("Updating subreddit cache");
        let after: string | null = "";
        let nodata = false;
        do {
            const response = await fetch(
                `https://old.reddit.com/subreddits/mine.json?limit=100&after=${after}`,
                {
                    credentials: "include",
                }
            );
            const responseJson: unknown = await response.json();
            if (
                !(
                    responseJson instanceof Object &&
                    "data" in responseJson &&
                    responseJson.data
                )
            ) {
                nodata = true;
                break;
            }
            const data = responseJson.data;
            if (!isSubsListData(data)) {
                console.log("Error parsing response");
                break;
            }
            after = data.after;
            const dataChildren = data.children.filter((item) =>
                isSubredditDataWrapped(item)
            ) as subredditDataWrapped[];
            subs = subs.concat(dataChildren);
            console.log("after:", after);
        } while (after);
        if (!nodata) {
            await localforage.setItem(
                "subredditcache_act",
                JSON.stringify(subs)
            );
            await localforage.setItem("subredditcache_age", now);
            console.log("Updated,", subs);
        }
    } else {
        subs = cached;
        console.log("Subreddit cache is up to date, created at", new Date(age * 1000), subs);
    }
    return subs;
}
