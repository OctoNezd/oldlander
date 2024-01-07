export type GalleryEntryData = {
    imageSrc: string;
    caption?: string;
    outbound_url?: string;
}

export default interface ExpandoProvider {
    sitename: string;
    urlregex: RegExp;
    usesDataSet?: boolean;
    canHandlePost: (post: HTMLDivElement) => boolean;
    createGalleryData: (post: HTMLDivElement) => Promise<GalleryEntryData[]>;
}
