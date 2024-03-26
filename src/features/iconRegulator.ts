import { OLFeature, SettingOption, SettingSlider } from "./base";

class IconSizePreview extends SettingOption {
    settingId = "iconSizePreview";
    constructor() {
        super("", "");
        // @ts-ignore
        this.element = document.createElement("div");
        this.element.innerHTML = `
        <p class="ol-set-title ol-setting">Preview: </p>
        <ul class="flat-list buttons">
        <li class="ol-vote-container">
        <a class="ol-upvote" href="javascript:void(0)">arrow_circle_up</a
        ><a class="ol-downvote" href="javascript:void(0)">arrow_circle_down</a>
        </li>
        <li class="first">
            <a
                data-event-action="comments"
                class="bylink comments may-blank"
                rel="nofollow"
                >99</a
            >
        </li>
        <li class="share">
            <a
                class="post-sharing-button"
                style="display: none"
                >share</a
            ><a class="riok-share" href="javascript:void(0)"></a>
        </li>
        <li class="link-save-button save-button login-required">
            <a href="javascript:void(0)">save</a>
        </li>
        <li>
            <form
                action="/post/hide"
                method="post"
                class="state-button hide-button"
            >
                <span
                    ><a
                        href="javascript:void(0)"
                        class=""
                        data-event-action="hide"
                        >hide</a
                    ></span
                >
            </form>
        </li>
        <li class="report-button login-required">
            <a
                href="javascript:void(0)"
                class="reportbtn access-required"
                data-event-action="report"
                >report</a
            >
        </li>
        <li class="crosspost-button">
            <a
                class="post-crosspost-button"
                href="javascript: void 0;"
                data-type="crosspost"
                >crosspost</a
            >
        </li>
        <li><a class="modal-spawner" href="javascript:void(0);"></a></li>
        `;
    }
}

export default class IconSizeChange extends OLFeature {
    moduleId: string = "iconSize";
    moduleName: string = "Icon size";
    async init() {
        this.settingOptions.push(
            new IconSizePreview(),
            new SettingSlider(
                "Icon size",
                "postIconSize",
                "px",
                28,
                0,
                100,
                (val) => {
                    console.log("updating icon-size to", val);
                    document.documentElement.style.setProperty(
                        "--icon-size",
                        val + "px"
                    );
                }
            )
        );
    }
}
