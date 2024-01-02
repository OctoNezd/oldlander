import { OrderedMap } from "immutable";
import ExpandoProvider from "./expandoProvider";

export default class iReddIt implements ExpandoProvider {
    sitename = "i.redd.it";
    urlregex = new RegExp(/https:\/\/i\.redd\.it\/.{13}.{3,}/);
    async createGalleryData(post: HTMLDivElement) {
        if (post.dataset.url) {
            return OrderedMap([[post.dataset.url, ""]]);
        }
        else {
            return OrderedMap<string, string>();
        }
    }
}
