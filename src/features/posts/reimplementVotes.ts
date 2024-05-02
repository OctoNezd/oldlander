import { OLFeature, SettingToggle } from "../base";
import "./css/votes.scss";

const getRedditConfig = `
setTimeout(function() {
    document.dispatchEvent(new CustomEvent('oldLanderConfigRequest', {
        detail: window.r.config
    }));
}, 0);
`;

export default class ReimplementVotes extends OLFeature {
    moduleId: string = "ReimplementVotes";
    moduleName: string = "ReimplementVotes";
    // @ts-ignore
    voteHash: string;
    // @ts-ignore
    modHash: string;
    // @ts-ignore
    voteEventData: string;
    // @ts-ignore
    votesNearButtons: SettingToggle;

    async init() {
        this.votesNearButtons = new SettingToggle(
            "Display votes between upvote and downvote buttons",
            "Reload required",
            "votesNearButtons",
            (value) => {
                document.documentElement.classList.toggle(
                    "votesNearButtons",
                    value
                );
            }
        );
        this.settingOptions.push(this.votesNearButtons);

        this.voteHash = "";
        this.modHash = "";
        document.addEventListener("oldLanderConfigRequest", (e) => {
            // @ts-ignore
            this.modHash = e.detail.modhash;
            // @ts-ignore
            this.voteHash = e.detail.vote_hash;
            console.log("Grabbed votehash and modhash!", this);
            this.voteEventData = JSON.stringify({
                // @ts-ignore
                page_type: e.detail.event_target.target_type,
                // @ts-ignore
                sort: e.detail.event_target.target_sort,
                // @ts-ignore
                sort_filter_time: e.detail.event_target.target_filter_time,
            });
        });
        var s = document.createElement("script");
        s.innerText = getRedditConfig;
        (document.head || document.documentElement).appendChild(s);
        s.onload = function () {
            s.remove();
        };
    }
    async onPost(post: HTMLDivElement): Promise<void> {
        const postState =
            Number(Boolean(post.querySelector(".upmod"))) +
            Number(Number(Boolean(post.querySelector(".downmod"))) * -1);
        post.dataset.olVote = postState.toString();

        let unvotedScoreElContainer = post;
        if (post.dataset.type === "comment") {
            unvotedScoreElContainer = post.querySelector(
                ".entry"
            ) as HTMLDivElement;
        }
        const unvotedScoreEl =
            unvotedScoreElContainer.querySelector(".score.unvoted");
        if (unvotedScoreEl !== null) {
            post.dataset.neutralScore = (
                unvotedScoreEl as HTMLSpanElement
            ).title;
            if (post.dataset.type === "comment") {
                post.dataset.neutralScore = (
                    Number(post.dataset.neutralScore) - postState
                ).toString();
            }
        }

        const buttons = post.querySelector(".buttons");
        const voteContainer = document.createElement("li");
        voteContainer.className = "ol-vote-container";

        const upVote = document.createElement("a");
        upVote.classList.add("ol-upvote", "ol-icon");
        upVote.innerText = "arrow_circle_up";
        upVote.href = "javascript:void(0)";
        upVote.addEventListener("click", (e) => {
            this.vote("1", e);
        });
        if (postState === 1) {
            upVote.classList.add("act");
        }

        const voteCount = document.createElement("p");
        if (post.dataset.score !== undefined) {
            voteCount.innerText = post.dataset.score as string;
            if (Number(post.dataset.score) === 1) {
                voteCount.classList.add("ol-votecount-one");
            }
        }
        voteCount.classList.add("ol-votecount");

        const downVote = document.createElement("a");
        downVote.classList.add("ol-downvote", "ol-icon");
        downVote.innerText = "arrow_circle_down";
        downVote.href = "javascript:void(0)";
        downVote.addEventListener("click", (e) => {
            this.vote("-1", e);
        });
        if (postState === -1) {
            downVote.classList.add("act");
        }
        if (
            (await this.votesNearButtons.getValue()) ||
            post.dataset.type === "comment"
        ) {
            voteContainer.append(upVote, voteCount, downVote);
        } else {
            voteContainer.append(upVote, downVote);
            post.querySelector(".tagline")?.prepend(voteCount);
        }
        if (post.dataset.type === "comment") {
            voteContainer.append(upVote, voteCount, downVote);
            for (const button of [downVote, upVote]) {
                const listItem = document.createElement("li");
                listItem.appendChild(button);
                button.classList.add("voteButton");
                buttons?.prepend(listItem);
            }
            const entry = post.querySelector(".entry") as HTMLDivElement;
            const oldLanderScore = document.createElement("span");
            oldLanderScore.classList.add("score", "ol-score");
            if (unvotedScoreEl === null) {
                oldLanderScore.innerText = "[score unavailable]";
            } else {
                oldLanderScore.innerText = `${
                    Number(post.dataset.neutralScore) + postState
                } point(s)`;
            }
            const dislikes = entry.querySelector(".score.dislikes");
            if (dislikes !== null) {
                (dislikes?.parentNode as Node).insertBefore(
                    oldLanderScore,
                    dislikes
                );
            }
        } else {
            buttons?.prepend(voteContainer);
        }
    }
    async vote(direction: string, event: MouseEvent): Promise<void> {
        event.preventDefault();
        event.stopPropagation();
        const post = (event.target as HTMLAnchorElement).closest(
            ".thing"
        ) as HTMLDivElement;
        if (direction === post.dataset.olVote) {
            direction = "0";
        }
        const params = new URLSearchParams();
        params.set("dir", direction);
        params.set("id", post.dataset.fullname as string);
        params.set("sr", post.dataset.subreddit as string);
        const bodyParams = new URLSearchParams();
        bodyParams.set("id", post.dataset.fullname as string);
        bodyParams.set("direction", direction);
        bodyParams.set("vh", this.voteHash);
        bodyParams.set("isTrusted", "true");
        bodyParams.set("vote_event_data", this.voteEventData);
        if (post.dataset.rank) {
            bodyParams.set("rank", post.dataset.rank);
        }
        bodyParams.set("r", post.dataset.subreddit as string);
        bodyParams.set("uh", this.modHash);
        bodyParams.set("renderstyle", "html");
        if (post.dataset.neutralScore) {
            const new_score = (
                Number(post.dataset.neutralScore) + Number(direction)
            ).toString();
            if (post.dataset.type !== "comment") {
                const votecount = post.querySelector(
                    ".ol-votecount"
                ) as HTMLParagraphElement;
                votecount.innerText = new_score;
            } else {
                const votecount = post
                    .querySelector(".entry")
                    ?.querySelector(".score.ol-score") as HTMLSpanElement;
                votecount.innerText = `${new_score} point(s)`;
            }
        }
        const clickedButton = event.target as HTMLAnchorElement;
        clickedButton.classList.toggle("act");
        let forceOff = ".ol-upvote";
        if (clickedButton.classList.contains("ol-upvote")) {
            forceOff = ".ol-downvote";
        }
        (
            (
                clickedButton.closest(".flat-list") as HTMLDivElement
            ).querySelector(forceOff) as HTMLUListElement
        ).classList.remove("act");

        await fetch("https://old.reddit.com/api/vote?" + params, {
            credentials: "include",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded; charset=UTF-8",
            },
            referrer: "https://old.reddit.com/",
            body: bodyParams.toString(),
            method: "POST",
            mode: "cors",
        }).then(console.log);

        post.dataset.olVote = direction;
    }
}
