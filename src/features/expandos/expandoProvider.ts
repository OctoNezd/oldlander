export default interface ExpandoProvider {
    sitename: string;
    urlregex: RegExp;
    createGalleryData: (post: HTMLDivElement) => Promise<Map<string, string>>;
}
