import { OLFeature, SettingToggle } from "../base";
import "./css/votes.scss";
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
        if (direction === "1") {
            const button = post.querySelector(
                ".arrow[data-event-action='upvote']"
            ) as HTMLAnchorElement;
            button.click();
        } else if (direction === "-1") {
            const button = post.querySelector(
                ".arrow[data-event-action='downvote']"
            ) as HTMLAnchorElement;
            button.click();
        } else {
            alert("unknown direction: " + direction);
        }
        console.log(post);
        const score_el = post.querySelector(
            ".ol-votecount"
        ) as HTMLAnchorElement;
        const score_res = post.querySelector(".midcol") as HTMLDivElement;
        const buttons = [
            post.querySelector(".ol-upvote") as HTMLAnchorElement,
            post.querySelector(".ol-downvote") as HTMLAnchorElement,
        ];
        if (score_res.classList.contains("unvoted")) {
            buttons[0].classList.toggle("act", false);
            buttons[1].classList.toggle("act", false);
            score_el.innerText = (
                score_res.querySelector(".score.unvoted") as HTMLDivElement
            ).innerText;
        }
        if (score_res.classList.contains("likes")) {
            buttons[0].classList.toggle("act", true);
            buttons[1].classList.toggle("act", false);
            score_el.innerText = (
                score_res.querySelector(".score.likes") as HTMLDivElement
            ).innerText;
        }
        if (score_res.classList.contains("dislikes")) {
            buttons[0].classList.toggle("act", false);
            buttons[1].classList.toggle("act", true);
            score_el.innerText = (
                score_res.querySelector(".score.dislikes") as HTMLDivElement
            ).innerText;
        }
    }
}
