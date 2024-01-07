import ExpandoProvider from "./expandoProvider";

// type ImageMetadata = {
//     // y: number;
//     // x: number;
//     u: string;
// };

type MediaMetadataItem = {
    // status: string,
    // e: string,
    m: string;
    // p: unknown[]; //ImageMetadata[];
    // s: ImageMetadata,
    id: string;
};

export default class RedditGallery implements ExpandoProvider {
    sitename = "Reddit Gallery";
    urlregex = new RegExp(/https:\/\/www\.reddit\.com\/gallery\/.{7}/);
    canHandlePost(post: HTMLDivElement) {
        const isGallery = post.dataset.isGallery;
        return isGallery === "true";
    }
    async createGalleryData(post: HTMLDivElement) {
        const postLink = post.dataset.permalink;
        const jsonUrl = `https://old.reddit.com${postLink}.json`;
        console.log(jsonUrl);
        const response = await fetch(jsonUrl, {
            referrerPolicy: "no-referrer",
        });
        if (!response.ok) {
            console.log(response);
            throw new Error("Error in fetching gallery json data");
        }
        const responseJson = await response.json();
        const postData = responseJson[0].data.children[0].data;
        console.debug("postData is", postData);

        const galleryItems: { media_id: string; caption: string }[] =
            postData.gallery_data.items;
        const mediaMetadata = postData.media_metadata;
        return galleryItems.map(({ media_id, caption }) => {
            return {
                imageSrc: this.getImageSrc(mediaMetadata[media_id]),
                caption,
            };
        });
    }

    private getImageSrc(imgData: MediaMetadataItem) {
        const imgFileExtension = imgData.m.split("/")[1];
        return `https://i.redd.it/${imgData.id}.${imgFileExtension}`; // there is probably a better way!
    }
}
