import localforage from "localforage";

type subredditData = {
    url: string;
    display_name: string;
    icon_img: string;
};
type subredditDataWrapped = Record<"data", subredditData>;

interface SubredditsApiData {
    after: string
    children: subredditDataWrapped
}

interface SubredditsApi {
    kind: string
    data: SubredditsApiData
}

export async function getSubreddits(force?: boolean) {
    let subs: subredditDataWrapped[] = [];
    const age = parseInt(await localforage.getItem("subredditcache_age") || "NaN");
    const now = Math.floor(Date.now() / 1000);
    const cached = JSON.parse(await localforage.getItem("subredditcache_act") || "null");
    if (age + 60 * 60 < now || isNaN(age) || cached === null || force) {
        console.log("Updating subreddit cache");
        let after: string | null = "";
        let nodata = false;
        do {
            const response = await fetch(
                `/subreddits/mine.json?limit=100&after=${after}`,
                {
                    credentials: "include",
                    mode: "cors",
                    cache: "no-store"
                }
            );
            const responseJson: SubredditsApi = await response.json();
            console.log(responseJson)
            const data = responseJson.data;
            after = data.after;
            const dataChildren = data.children;
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
