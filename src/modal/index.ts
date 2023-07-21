import { allowBodyScroll } from "../utility/bodyScroll";
import "./modal.css";

export default function createModal(
    title: string,
    contents: HTMLElement,
    okCallback: (() => void) | null
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

    document.body.appendChild(modal);
}
