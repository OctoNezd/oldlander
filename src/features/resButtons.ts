import querySelectorAsync from "../utility/querySelectorAsync";
import { OLFeature } from "./base";
export default class RESFAB extends OLFeature {
    moduleName = "Reddit Enhancement Suite Buttons in header";
    moduleId = "res-buttons";

    async init() {
        this.buildResButtons(await querySelectorAsync(".res-floater-visibleAfterScroll"));
    }
    buildResButtons(resBtns: HTMLDivElement) {
        console.log("Building res buttons");
        const headerBtns = document.querySelector("#ol-header .aux-buttons")
        resBtns.classList.add("ol-res-buttons")
        headerBtns!.prepend(resBtns);
    }
}