import "./css/index.css";
import { OLFeature } from "../base";

import ExpandoProvider from "./expandoProvider";
import RedditGallery from "./redditGallery";
import iReddIt from "./ireddit";
import YoutubeExpando from "./youtube";

import "video.js";
import "lightgallery/css/lightgallery.css";
import lightGallery from "lightgallery";
import { LightGallery } from "lightgallery/lightgallery";
import lgZoom from "lightgallery/plugins/zoom";
import lgVideo from "lightgallery/plugins/video";
import "lightgallery/css/lg-video.css";
import "lightgallery/css/lg-zoom.css";
import { allowBodyScroll, preventBodyScroll } from "../../utility/bodyScroll";

const expandoProviders: Array<ExpandoProvider> = [
    new RedditGallery(),
    new iReddIt(),
    new YoutubeExpando(),
];

enum ClosingState {
    open,
    closed,
    backPressedOnOpenGallery,
    closedByUser,
}

type Gallery = {
    id: string;
    lightGallery: LightGallery;
};

export default class Expandos extends OLFeature {
    moduleName = "Expandos";
    moduleId = "expandos";
    async init() {
        window.addEventListener("popstate", this.onPopState.bind(this));
    }
    async onPost(post: HTMLDivElement) {
        const postId = post.dataset.fullname;
        if (typeof postId !== "string") {
            throw new Error("Post does not have an id!");
        }
        const thumbnailLink = post.querySelector(".thumbnail");
        if (!thumbnailLink) return;
        const expando_btn =
            post.querySelector<HTMLButtonElement>(".expando-button");
        if (!expando_btn) return;

        const thumbnailDiv = document.createElement("div");
        thumbnailDiv.classList.add("thumbnail");
        thumbnailLink.replaceWith(thumbnailDiv);
        thumbnailDiv.appendChild(thumbnailLink);

        thumbnailDiv.addEventListener("click", async (e) => {
            e.preventDefault();
            const lightGallery = await this.getLightGallery(post);
            if (lightGallery) {
                this.openGallery({ id: postId, lightGallery: lightGallery });
                return;
            }

            const expando_btn_R =
                post.querySelector<HTMLButtonElement>(".expando-button");
            if (expando_btn_R) {
                console.log("Clicking on expando btn", expando_btn);
                expando_btn_R.click();
            } else {
                console.error("Couldnt find expando button!");
            }
        });
    }

    private galleries: { [id: string]: LightGallery | null } = {};
    private activeGallery: Gallery | null = null;
    private closingState: ClosingState = ClosingState.closed;

    private openGallery(gallery: Gallery) {
        if (this.activeGallery !== null) {
            throw new Error("There is already an active gallery!");
        }
        preventBodyScroll();
        history.pushState({ galleryId: gallery.id }, "", "#gallery");
        this.closingState = ClosingState.open;
        console.debug("Set closeState to open!");
        gallery.lightGallery.openGallery();
        this.activeGallery = gallery;
    }

    private async getLightGallery(post: HTMLDivElement) {
        const postId = post.dataset.fullname;
        const url = post.dataset.url;
        if (!postId) {
            throw "data-fullname attribute is missing from post!";
        }
        if (postId in this.galleries) {
            return this.galleries[postId];
        }

        for (const expandoProvider of expandoProviders) {
            if (url && expandoProvider.urlregex.test(url)) {
                const gallery = await this.createLightGallery(
                    expandoProvider,
                    post
                );
                this.galleries[postId] = gallery;
                return gallery;
            }
        }

        console.warn(
            `Couldn't find expando provider for URL ${url}, falling back to RES/reddit`
        );
        this.galleries[postId] = null;
        return null;
    }

    private async createLightGallery(
        expandoProvider: ExpandoProvider,
        post: HTMLDivElement
    ) {
        const imgLinks = await expandoProvider.createGalleryData(post);
        const gallery = document.createElement("div");
        for (const { imageSrc, imageDescHtml } of imgLinks) {
            const imageAnchorEl = document.createElement("a");
            if (expandoProvider.usesDataSet) {
                imageAnchorEl.dataset.src = imageSrc;
                imageAnchorEl.dataset.lgSize = "1280-720";
            } else {
                imageAnchorEl.href = imageSrc;
            }
            imageAnchorEl.dataset.subHtml = imageDescHtml;
            const imageEl = document.createElement("img");
            imageEl.referrerPolicy = "no-referrer";
            imageEl.src = imageSrc;
            imageAnchorEl.append(imageEl);
            gallery.appendChild(imageAnchorEl);
        }
        gallery.addEventListener(
            "lgAfterClose",
            this.onGalleryClose.bind(this)
        );
        const lg = lightGallery(gallery, {
            plugins: [lgVideo, lgZoom],
            speed: 250,
            mobileSettings: {},
            videojs: true,
        });
        return lg;
    }

    private onPopState(ev: PopStateEvent) {
        console.debug("popstate called", ev.state);
        if (this.activeGallery === null) {
            return;
        }
        if (this.closingState === ClosingState.open) {
            this.closingState = ClosingState.backPressedOnOpenGallery;
            console.debug("Set closeState to backPressed!");
            this.activeGallery.lightGallery.closeGallery(true);
        }
        if (this.closingState === ClosingState.closedByUser) {
            this.closingState = ClosingState.closed;
            console.debug("Set closeState to closed!");
        }
    }

    private onGalleryClose() {
        console.debug("Closed gallery!");
        this.activeGallery = null;
        allowBodyScroll();
        if (this.closingState === ClosingState.open) {
            this.closingState = ClosingState.closedByUser;
            console.debug("Set closeState to closedByUser!");
            history.back();
            console.debug("Called history.back()!");
        }
        if (this.closingState === ClosingState.backPressedOnOpenGallery) {
            this.closingState = ClosingState.closed;
            console.debug("Set closeState to closed!");
        }
    }
}
