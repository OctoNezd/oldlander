import ExpandoProvider from "./expandoProvider";

export default class iReddIt implements ExpandoProvider {
    sitename = "i.redd.it";
    urlregex = new RegExp(/https:\/\/i\.redd\.it\/.{13}.{3,}/);
    async createGalleryData(post: HTMLDivElement) {
        const url = post.dataset.url;
        if (url) {
            return [{
                imageSrc: url
            }];
        } else {
            return [];
        }
    }
}
