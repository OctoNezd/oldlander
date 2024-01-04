import { OrderedMap } from "immutable";

export default interface ExpandoProvider {
    sitename: string;
    urlregex: RegExp;
    usesDataSet?: boolean;
    createGalleryData: (post: HTMLDivElement) => Promise<OrderedMap<string, string>>;
}
