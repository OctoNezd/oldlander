import setupSubredditSidebar from "./subreddit_sidebar.js";
import setupUserSidebar from "./user_sidebar.js";
function setupSidebars() {
    const [toggleSub, subSide] = setupSubredditSidebar();
    const [toggleUser, userSide] = setupUserSidebar();
    document.addEventListener("toggleUser", toggleUser);
    document.addEventListener("toggleSub", toggleSub);
    document.addEventListener("swiped-right", function (e) {
        // sidebar.classList.remove("active");
        if (subSide.classList.contains("active")) {
            toggleSub();
            return;
        }
        if (!userSide.classList.contains("active")) {
            toggleUser();
        }
    });
    document.addEventListener("swiped-left", function (e) {
        // sidebar.classList.add("active");
        if (userSide.classList.contains("active")) {
            toggleUser();
            return;
        }
        if (!subSide.classList.contains("active")) {
            toggleSub();
        }
    });
}
setupSidebars();
