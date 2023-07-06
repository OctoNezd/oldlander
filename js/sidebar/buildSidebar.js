export default function buildSidebar(
    innerSidebar,
    sidebarId,
    closeToggleId,
    isOnLeft
) {
    document.querySelectorAll(`#${sidebarId}`).forEach((el) => el.remove());

    const sidebar = document.createElement("div");
    sidebar.id = sidebarId;

    innerSidebar.addEventListener("animationend", () => {
        if (sidebar.classList.contains("abouttodie")) {
            sidebar.classList.remove("active");
        }
        sidebar.classList.remove("showingup", "abouttodie");
    });

    function activeToggle() {
        if (sidebar.classList.contains("active")) {
            sidebar.classList.add("abouttodie");
        } else {
            sidebar.classList.add("active", "showingup");
        }
    }
    const closeToggle = document.createElement("div");
    closeToggle.id = closeToggleId;
    closeToggle.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        activeToggle();
    };

    if (isOnLeft) {
        sidebar.append(innerSidebar, closeToggle);
    } else {
        sidebar.append(closeToggle, innerSidebar);
    }

    return [activeToggle, sidebar];
}
