import ExpandoProvider from "./expandoProvider";

export default class iReddIt implements ExpandoProvider {
    sitename = "i.redd.it";
    urlregex = new RegExp(/https:\/\/i\.redd\.it\/.{13}.{3,}/);
    canHandlePost(post: HTMLDivElement) {
        const url = post.dataset.url;
        return !!(url && this.urlregex.test(url));
    }
    async createGalleryData(post: HTMLDivElement) {
        const url = post.dataset.url;
        if (url) {
            return [
                {
                    imageSrc: url,
                    caption: post.dataset.selftext,
                },
            ];
        } else {
            return [];
        }
    }
}
