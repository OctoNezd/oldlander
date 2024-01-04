import "./css/index.css"
import { OLFeature } from "../base";

import ExpandoProvider from "./expandoProvider";
import RedditGallery from "./redditGallery";
import iReddIt from "./ireddit";
import YoutubeExpando from "./youtube";

import "video.js"
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
    new YoutubeExpando()
];

export default class Expandos extends OLFeature {
    moduleName = "Expandos";
    moduleId = "expandos";
    async init() {
        window.addEventListener("popstate", (event) => {
            if (this.activeGallery !== null) {
                this.activeGallery.closeGallery(true);
                this.activeGallery = null;
            }
        });
    }
    async onPost(post: HTMLDivElement) {
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
            preventBodyScroll();
            const expando_btn_R =
                post.querySelector<HTMLButtonElement>(".expando-button");
            const gallery = await this.getGallery(post);
            this.activeGallery = gallery;
            if (gallery) {
                history.pushState({"galleryId": post.dataset.fullname}, '', "#gallery");
                gallery.openGallery();
            } else if (expando_btn_R) {
                console.log("Clicking on expando btn", expando_btn)
                expando_btn_R.click();
            } else {
                console.error("Couldnt find expando button!")
            }
        });
    }

    private galleries: { [id: string]: LightGallery | null } = {};
    private activeGallery: LightGallery | null = null;

    private async getGallery(post: HTMLDivElement) {
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
                const gallery = await this.createGallery(expandoProvider, post);
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

    private async createGallery(
        expandoProvider: ExpandoProvider,
        post: HTMLDivElement
    ) {
        const imgLinks = await expandoProvider.createGalleryData(post);
        const gallery = document.createElement("div");
        for (const [imgLink, imgDesc] of imgLinks) {
            const imageAnchorEl = document.createElement("a");
            if (expandoProvider.usesDataSet) {
                imageAnchorEl.dataset.src = imgLink
                imageAnchorEl.dataset.lgSize = "1280-720"
            } else {
                imageAnchorEl.href = imgLink;
            }
            imageAnchorEl.dataset.subHtml = imgDesc;
            const imageEl = document.createElement("img");
            imageEl.referrerPolicy = "no-referrer";
            imageEl.src = imgLink;
            imageAnchorEl.append(imageEl);
            console.log("Anchor:", imageAnchorEl)
            gallery.appendChild(imageAnchorEl);
        }
        gallery.addEventListener("lgAfterClose", function () {
            allowBodyScroll();
        });
        const lg = lightGallery(gallery, {
            plugins: [lgVideo, lgZoom],
            speed: 250,
            mobileSettings: {},
            videojs: true
        });
        return lg;
    }
}
