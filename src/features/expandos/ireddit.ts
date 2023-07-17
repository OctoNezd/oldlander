import BaseExpando from "./baseGallery";
export default class iReddIt extends BaseExpando {
    sitename = "i.redd.it";
    urlregex = new RegExp(/https:\/\/i\.redd\.it\/.{13}.{3,}/);
    async createGalleryData(post: HTMLDivElement) {
        return new Map([[post.dataset.url, ""]]);
    }
}
