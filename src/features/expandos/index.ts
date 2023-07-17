import { OLFeature } from "../base";

import RedditGallery from "./redditGallery";
import iReddIt from "./ireddit";

import BaseExpando from "./baseGallery";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import lightGallery from "lightgallery";

import lgZoom from "lightgallery/plugins/zoom";

const expandoProviders: Array<BaseExpando> = [
    new RedditGallery(),
    new iReddIt(),
];
export default class Expandos extends OLFeature {
    moduleName = "Expandos";
    moduleId = "expandos";
    async onPost(post: HTMLDivElement) {
        const thumbnailLink = post.querySelector(".thumbnail");
        if (!thumbnailLink) {
            return;
        }

        const thumbnailDiv = document.createElement("div");
        thumbnailDiv.classList.add("thumbnail");
        thumbnailLink.replaceWith(thumbnailDiv);
        thumbnailDiv.appendChild(thumbnailLink);

        thumbnailDiv.addEventListener("click", async (e) => {
            const url = post.dataset.url;
            e.preventDefault();
            for (const expandoProvider of expandoProviders) {
                if (expandoProvider.urlregex.test(url)) {
                    const imgLinks = await expandoProvider.createGalleryData(
                        post
                    );
                    const gallery = document.createElement("div");
                    for (const [imgLink, imgDesc] of imgLinks) {
                        const imageAnchorEl = document.createElement("a");
                        imageAnchorEl.href = imgLink;
                        imageAnchorEl.dataset.subHtml = imgDesc;
                        const imageEl = document.createElement("img");
                        imageEl.src = imgLink;
                        imageAnchorEl.append(imageEl);
                        gallery.appendChild(imageAnchorEl);
                        console.log(imageAnchorEl);
                    }
                    const lg = lightGallery(gallery, {
                        plugins: [lgZoom],
                        speed: 250,
                    });
                    lg.openGallery(0);
                    return;
                }
            }
            console.warn(
                "Couldnt find expando provider for URL",
                url,
                "falling back to RES/reddit"
            );
            const expando_btn =
                post.querySelector<HTMLButtonElement>(".expando-button");
            if (expando_btn) {
                expando_btn.click();
            }
        });
    }
}
