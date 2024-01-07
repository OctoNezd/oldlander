import "./css/index.css";
import { OLFeature } from "../base";

import ExpandoProvider, { GalleryEntryData } from "./expandoProvider";
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
    closeByHistoryNavigation,
}

type Gallery = {
    data: GalleryData;
    lightGallery: LightGallery;
};

type GalleryData = {
    id: string;
    entries: GalleryEntryData[];
};

export default class Expandos extends OLFeature {
    moduleName = "Expandos";
    moduleId = "expandos";
    async init() {
        window.addEventListener("popstate", this.onPopState.bind(this));
        addEventListener("DOMContentLoaded", () =>
            this.closeAndOpenGallery(history.state)
        );
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
            const gallery = await this.getGallery(post);
            if (gallery) {
                history.pushState(
                    gallery.data,
                    "",
                    `#gallery_${gallery.data.id}`
                );
                this.openGallery(gallery);
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

    private galleries: { [id: string]: Gallery | null } = {};
    private activeGallery: Gallery | null = null;
    private closingState: ClosingState = ClosingState.closed;

    private openGallery(gallery: Gallery) {
        if (this.activeGallery !== null) {
            throw new Error("There is already an active gallery!");
        }
        preventBodyScroll();
        this.closingState = ClosingState.open;
        gallery.lightGallery.openGallery();
        this.activeGallery = gallery;
    }

    private async getGallery(post: HTMLDivElement) {
        const postId = post.dataset.fullname;
        if (!postId) {
            throw "data-fullname attribute is missing from post!";
        }
        if (postId in this.galleries) {
            return this.galleries[postId];
        }

        for (const expandoProvider of expandoProviders) {
            if (expandoProvider.canHandlePost(post)) {
                const galleryEntries = await expandoProvider.createGalleryData(
                    post
                );
                return this.createGallery(galleryEntries, postId);
            }
        }

        console.warn(
            `Couldn't find expando provider for URL ${post.dataset.url}, falling back to RES/reddit`
        );
        this.galleries[postId] = null;
        return null;
    }

    private createGallery(galleryEntries: GalleryEntryData[], postId: string) {
        const lg = this.createLightGallery(galleryEntries);
        const gallery = {
            data: { id: postId, entries: galleryEntries },
            lightGallery: lg,
        };
        this.galleries[postId] = gallery;
        return gallery;
    }

    private createLightGallery(galleryEntries: GalleryEntryData[]) {
        const galleryDiv = document.createElement("div");
        for (const { imageSrc, caption, outbound_url } of galleryEntries) {
            const imageAnchorEl = document.createElement("a");
            // if (useDataSet) {
            //     imageAnchorEl.dataset.src = imageSrc;
            //     imageAnchorEl.dataset.lgSize = "1280-720";
            // } else {
            //     imageAnchorEl.href = imageSrc;
            // }
            imageAnchorEl.href = imageSrc;

            let captionHtml = "";
            if (caption) {
                const captionDiv = document.createElement("div");
                captionDiv.innerText = caption;
                captionHtml += captionDiv.outerHTML;
            }
            if (outbound_url) {
                const outboundAnchor = document.createElement("a");
                outboundAnchor.href = outbound_url;
                outboundAnchor.innerText = outbound_url;
                outboundAnchor.classList.add("caption-link");
                captionHtml += outboundAnchor.outerHTML;
            }
            imageAnchorEl.dataset.subHtml = captionHtml;

            const imageEl = document.createElement("img");
            imageEl.referrerPolicy = "no-referrer";
            imageEl.src = imageSrc;
            imageAnchorEl.append(imageEl);
            galleryDiv.appendChild(imageAnchorEl);
        }
        galleryDiv.addEventListener(
            "lgAfterClose",
            this.onGalleryClose.bind(this)
        );
        const lg = lightGallery(galleryDiv, {
            plugins: [lgVideo, lgZoom],
            speed: 250,
            mobileSettings: {},
            videojs: true,
        });
        return lg;
    }

    private onPopState(ev: PopStateEvent) {
        this.closeAndOpenGallery(ev.state);
    }

    private closeAndOpenGallery(state: GalleryData | null) {
        const galleryId = state?.id;

        if (this.activeGallery) {
            this.closingState = ClosingState.closeByHistoryNavigation;
            this.activeGallery?.lightGallery.closeGallery(true);
        }

        if (galleryId) {
            const gallery =
                this.galleries[galleryId] ??
                this.createGallery(state.entries, state.id);
            this.openGallery(gallery);
        }
    }

    private onGalleryClose() {
        this.activeGallery = null;
        allowBodyScroll();
        const wasClosedByHistoryNav =
            this.closingState !== ClosingState.closeByHistoryNavigation;

        this.closingState = ClosingState.closed;
        if (wasClosedByHistoryNav) {
            history.back();
        }
    }
}
