import "swiped-events";
import "~/css/subreddit_sidebar.css";
export default function setupSidebar() {
    const sidebar = document.createElement("div");
    const sidebarToggle = document.createElement("div");
    const actualSidebar = document.querySelector(".side");
    sidebarToggle.id = "sidebar-toggle";
    sidebar.id = "custom-sidebar";
    sidebar.appendChild(sidebarToggle);
    sidebar.appendChild(actualSidebar);
    document.querySelectorAll("#custom-sidebar").forEach((el) => el.remove());
    document.body.appendChild(sidebar);
    function activeToggle() {
        if (sidebar.classList.contains("active")) {
            sidebar.classList.add("abouttodie");
        } else {
            sidebar.classList.add("active", "showingup");
        }
    }
    sidebarToggle.onclick = (e) => {
        e.preventDefault();
        // sidebar.classList.toggle("active");
        activeToggle();
    };
    actualSidebar.addEventListener("animationend", () => {
        console.log("Animation ended", sidebar.classList);
        if (sidebar.classList.contains("abouttodie")) {
            sidebar.classList.remove("active");
        }
        sidebar.classList.remove("showingup", "abouttodie");
    });
    return [activeToggle, sidebar];
}
