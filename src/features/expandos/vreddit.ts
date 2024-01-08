import ExpandoProvider from "./expandoProvider";

export default class vReddIt implements ExpandoProvider {
    sitename = "v.redd.it";
    urlregex = new RegExp(/https:\/\/v\.redd\.it\/(.{13})/);
    canHandlePost(post: HTMLDivElement) {
        const url = post.dataset.url;
        return !!(url && this.urlregex.test(url));
    }
    async createGalleryData(post: HTMLDivElement) {
        const url = post.dataset.url as string;
        const postId = this.urlregex.exec(url)
        if (postId) {
            return [{
                videoSrc: JSON.stringify({
                    source: [{src:`https://v.redd.it/${postId[1]}/DASHPlaylist.mpd`, type: "application/dash+xml"}],
                    attributes: {"data-oldlander-player": true, "controls": true}
                })
            }];
        } else {
            return [];
        }
    }
}
