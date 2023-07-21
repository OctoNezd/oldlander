export function preventBodyScroll() {
    document.body.classList.add("prevent-scroll");
}

export function allowBodyScroll() {
    document.body.classList.remove("prevent-scroll");
}