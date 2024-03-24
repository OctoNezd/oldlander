import createModal from "../../modal";
import { OLFeature, SettingToggle } from "../base";
import "./css/buttonHide.scss";
// https://stackoverflow.com/a/21696585
function isHidden(el: Element) {
    var style = window.getComputedStyle(el);
    return style.display === "none";
}
export default class ButtonHide extends OLFeature {
    moduleId = "buttonhide";
    moduleName = "Hide rarely-used buttons on post";
    disabled = false;
    addCommentCount = true;
    async init(): Promise<void> {
        this.settingOptions.push(
            new SettingToggle(
                "Show all buttons on posts",
                "Reload required",
                "allButtons",
                (showAllButtons: boolean) => {
                    this.disabled = showAllButtons;
                    console.log("set hidebuttons to", !showAllButtons);
                    document.documentElement.classList.toggle(
                        "hideButtons",
                        !showAllButtons
                    );
                }
            ),
            new SettingToggle(
                "Display comment count on comment icon",
                "Instead of displaying it next to vote count",
                "showCommentCountOnButton",
                (showCommentCountOnButton: boolean) => {
                    this.addCommentCount = !showCommentCountOnButton;
                    document.documentElement.classList.toggle(
                        "showCommentCountOnButton",
                        showCommentCountOnButton
                    );
                }
            )
        );
    }
    async onPost(post: HTMLDivElement): Promise<void> {
        if (this.disabled) {
            return;
        }
        const buttonList = post.querySelector(".flat-list");
        const modalSpawnerCtr = document.createElement("li");
        const modalSpawner = document.createElement("a");
        modalSpawnerCtr.appendChild(modalSpawner);
        modalSpawner.classList.add("modal-spawner");
        buttonList?.appendChild(modalSpawnerCtr);

        modalSpawner.href = "javascript:void(0);";
        modalSpawner.onclick = async (e) => {
            const modalContents = document.createElement("div");
            for (const button of buttonList?.children ?? []) {
                if (isHidden(button)) {
                    const buttonProxy = document.createElement("a");
                    buttonProxy.classList.add("modalMenuElement");
                    buttonProxy.href = "javascript:void(0)";
                    buttonProxy.onclick = (e) => {
                        document.dispatchEvent(new Event("closeOlModal"));
                        button.querySelector("a")?.click();
                    };
                    buttonProxy.innerText = button.textContent!.toString();
                    modalContents.appendChild(buttonProxy);
                }
            }
            createModal("", modalContents, () => {}, false, false);
        };
        if (post.dataset.type !== "comment" && this.addCommentCount) {
            const commentCount = document.createElement("span");
            const commentCountValue = Number(post.dataset.commentsCount);
            commentCount.innerText = commentCountValue.toString();
            commentCount.classList.add("commentCount");
            if (commentCountValue === 1) {
                commentCount.classList.add("commentCount-singular");
            }

            post.querySelector(".ol-votecount")?.after(commentCount);
        }
    }
}
