export default class BaseExpando {
    sitename: string;
    urlregex: RegExp;
    constructor() {}
    async createGalleryData(
        post: HTMLDivElement
    ): Promise<Map<string, string | undefined>> {
        return new Map();
    }
}
