import { OLFeature } from "../base";

import ExpandoProvider from "./expandoProvider";
import RedditGallery from "./redditGallery";
import iReddIt from "./ireddit";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import lightGallery from "lightgallery";
import lgZoom from "lightgallery/plugins/zoom";
import { LightGallery } from "lightgallery/lightgallery";
import { allowBodyScroll, preventBodyScroll } from "../../utility/bodyScroll";

const expandoProviders: Array<ExpandoProvider> = [
    new RedditGallery(),
    new iReddIt(),
];

export default class Expandos extends OLFeature {
    moduleName = "Expandos";
    moduleId = "expandos";
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
            const gallery = await this.getGallery(post);
            if (gallery) {
                gallery.openGallery();
            } else {
                expando_btn.click();
            }
        });
    }

    private galleries: { [id: string]: LightGallery | null } = {};

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
        this.createDefaultGallery(post);
        this.galleries[postId] = null;
        return null;
    }

    private createDefaultGallery(post: HTMLDivElement) {
        const expando_btn =
            post.querySelector<HTMLButtonElement>(".expando-button");
        if (expando_btn) {
            expando_btn.onclick = function () {
                if (expando_btn?.classList.contains("expanded")) {
                    allowBodyScroll();
                }
            };
        }
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
            imageAnchorEl.href = imgLink;
            imageAnchorEl.dataset.subHtml = imgDesc;

            const imageEl = document.createElement("img");
            imageEl.referrerPolicy = "no-referrer";
            imageEl.src = imgLink;
            imageAnchorEl.append(imageEl);
            gallery.appendChild(imageAnchorEl);
        }
        gallery.addEventListener("lgAfterClose", function () {
            allowBodyScroll();
        });
        const lg = lightGallery(gallery, {
            plugins: [lgZoom],
            speed: 250,
            mobileSettings: {},
        });
        return lg;
    }
}
