import { OrderedMap } from "immutable";

export default interface ExpandoProvider {
    sitename: string;
    urlregex: RegExp;
    createGalleryData: (post: HTMLDivElement) => Promise<OrderedMap<string, string>>;
}
