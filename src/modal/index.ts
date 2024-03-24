import { allowBodyScroll } from "../utility/bodyScroll";
import "./modal.css";

export default function createModal(
    title: string,
    contents: HTMLElement,
    okCallback: (() => void) | null,
    displayCancel: boolean = true,
    displayOk: boolean = true
) {
    const oldmodal = document.getElementById("modal");
    if (oldmodal !== null) {
        oldmodal.remove();
    }

    const modal = document.createElement("div");
    modal.id = "modal";
    modal.innerHTML = `
    <div class="ol-modal-content">
        <div class="ol-modal-header"></div>
        <div class="ol-modal-body"></div>
        <div class="ol-modal-footer">
            <button class="cancel">Cancel</button>
            <button class="ok">OK</button>
        </div>
    </div>
    `;
    modal.classList.toggle("ol-modal-hide-cancel", !displayCancel);
    modal.classList.toggle("ol-modal-hide-ok", !displayOk);
    modal.querySelector<HTMLElement>(".ol-modal-header")!.innerText = title;
    modal.querySelector<HTMLElement>(".ol-modal-body")!.appendChild(contents);

    function closeModal() {
        const anim = modal.animate([{ opacity: "100%" }, { opacity: "0%" }], {
            fill: "forwards",
            duration: 250,
        });
        const onfinish = () => {
            modal.removeEventListener("animationend", onfinish);
            modal.classList.add("hide");
            allowBodyScroll();
        };
        anim.addEventListener("finish", onfinish);
    }

    modal.querySelector<HTMLButtonElement>(
        ".ol-modal-footer button.cancel"
    )!.onclick = closeModal;
    modal.querySelector<HTMLButtonElement>(
        ".ol-modal-footer button.ok"
    )!.onclick = okCallback || closeModal;
    modal.onclick = (e) => {
        if (!e.target) {
            return;
        }
        const self = (e.target as Element).closest(".ol-modal-content");
        if (!self) {
            closeModal();
        }
    };
    document.addEventListener("closeOlModal", closeModal);

    document.body.appendChild(modal);
}
