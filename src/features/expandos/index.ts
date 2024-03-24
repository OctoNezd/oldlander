import "./css/index.css";
import { OLFeature, SettingToggle } from "../base";

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
import vReddIt from "./vreddit";
import { CustomEventSlideItemLoad } from "lightgallery/types";
// @ts-ignore
import dashjsSource from "dashjs/dist/dash.all.debug?raw";

const expandoProviders: Array<ExpandoProvider> = [
    new RedditGallery(),
    new iReddIt(),
    new YoutubeExpando(),
    new vReddIt(),
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
    showArrows = false;
    async init() {
        window.addEventListener("popstate", this.onPopState.bind(this));
        this.settingOptions.push(
            new SettingToggle(
                "Show arrows",
                "Show arrows inside galleries",
                "expandoArrows",
                (arrows) => {
                    this.showArrows = arrows;
                }
            )
        );
        addEventListener("DOMContentLoaded", () => {
            const djsScript = document.createElement("script");
            djsScript.innerHTML = dashjsSource;
            document.body.appendChild(djsScript);
            this.closeAndOpenGallery(history.state);
        });
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

        for (const [
            slideIdx,
            { imageSrc, videoSrc, caption, outbound_url },
        ] of Object.entries(galleryEntries)) {
            const imageAnchorEl = document.createElement("a");
            let imageEl;
            if (imageSrc) {
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

                imageEl = document.createElement("img");
                imageEl.referrerPolicy = "no-referrer";
                imageEl.src = imageSrc;
            } else if (videoSrc) {
                imageAnchorEl.dataset.video = videoSrc;
                imageAnchorEl.dataset.size = "100%-100%";
                // @ts-ignore
                galleryDiv.addEventListener(
                    "lgSlideItemLoad",
                    (e: CustomEventSlideItemLoad) => {
                        const data = e.detail;
                        if (Number(data.index) === Number(slideIdx)) {
                            console.log("video slide load", e, data);
                            const el = document.querySelector(
                                ".lg-container.lg-show [data-oldlander-player]"
                            ) as HTMLVideoElement;
                            el.parentElement!.style.height = "100%";
                            el.parentElement!.style.width = "100%";
                            if (el) {
                                const source = el.querySelector(
                                    "source"
                                ) as HTMLSourceElement;
                                if (
                                    source &&
                                    source.type === "application/dash+xml"
                                ) {
                                    // this sucks
                                    el.classList.add("oldlander-dash");
                                    var s = document.createElement("script");
                                    s.innerText = `dashjs.MediaPlayerFactory.createAll(".oldlander-dash")`;
                                    (
                                        document.head ||
                                        document.documentElement
                                    ).appendChild(s);
                                    s.onload = function () {
                                        s.remove();
                                    };
                                }
                            } else {
                                console.error("Couldnt find video element");
                            }
                        }
                    }
                );
            } else {
                throw new TypeError(
                    `Invalid GalleryEntry inside ${galleryEntries}`
                );
            }
            if (imageEl) {
                imageAnchorEl.append(imageEl);
            }
            console.log(imageAnchorEl);
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
            videojs: false,
            controls:
                galleryDiv.childElementCount > 1 ? this.showArrows : false,
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
