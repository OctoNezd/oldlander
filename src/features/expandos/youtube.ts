import ExpandoProvider from "./expandoProvider";

export default class YoutubeExpando implements ExpandoProvider {
    sitename = "youtube.com";
    // regular expressions scare me
    // grabbed from https://stackoverflow.com/a/67255602
    urlregex = new RegExp(/^(?:https?:)?(?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]{7,15})(?:[\?&][a-zA-Z0-9\_-]+=[a-zA-Z0-9\_-]+)*(?:[&\/\#].*)?$/);
    usesDataSet = true;
    
    async createGalleryData(post: HTMLDivElement) {
        let videoUrl = (post.dataset.url as string)
        const regexed = this.urlregex.exec(videoUrl);
        if (regexed && regexed?.length > 1) {
            const vid = regexed[1]
            videoUrl = `https://youtu.be/${vid}?mute=0`
        }
        return [{
            imageSrc: videoUrl
        }];
    };
}