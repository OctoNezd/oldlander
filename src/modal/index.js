import "./modal.css";

export default function createModal(title, contents, callback) {
    const oldmodal = document.getElementById("modal");
    if (oldmodal !== null) {
        oldmodal.remove();
    }

    const modal = document.createElement("div");
    modal.id = "modal";
    modal.innerHTML = `
    <div class="olmodal-content">
        <div class="olmodal-header"></div>
        <div class="olmodal-body"></div>
        <div class="olmodal-buttons">
            <button>Cancel</button>
            <button class="ok">OK</button>
        </div>
    </div>
    `;
    modal.querySelector(".olmodal-header").innerText = title;
    modal.querySelector(".olmodal-body").appendChild(contents);
    modal.querySelectorAll(".olmodal-buttons button").forEach(
        (btn) =>
            (btn.onclick = function () {
                const anim = modal.animate(
                    [{ opacity: "100%" }, { opacity: "0%" }],
                    {
                        fill: "forwards",
                        duration: 250,
                    }
                );
                const onFinish = () => {
                    console.log(anim.playState);
                    modal.removeEventListener("animationend", onFinish);
                    modal.classList.add("hide");
                };
                anim.addEventListener("finish", onFinish);
            })
    );
    modal.querySelector(".olmodal-buttons button.ok").onclick = callback;
    document.body.appendChild(modal);
}

window.testModal = () => {
    const modalContents = document.createElement("div");
    modalContents.innerHTML =
        "<hr/>blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah<hr/>";
    createModal("Test modal", modalContents, function () {
        console.log("Modal closed");
    });
};
