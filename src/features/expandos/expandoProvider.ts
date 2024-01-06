export type GalleryEntryData = {
    imageSrc: string;
    imageDescHtml: string;
}

export default interface ExpandoProvider {
    sitename: string;
    urlregex: RegExp;
    usesDataSet?: boolean;
    createGalleryData: (post: HTMLDivElement) => Promise<GalleryEntryData[]>;
}
