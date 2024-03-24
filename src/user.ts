import "./extensionPreferences";
import "./viewport";
import "./styling";
import "./header";
import "./features/posts";
import "./redditPreferences";
console.log("oldlander userscript loaded");
if (document.documentElement.classList.contains("oldlander")) {
    console.log("abnormal state detected, reloading page.");
    location.reload();
} else {
    document.documentElement.classList.add("oldlander");
}
console.log("OldLander loaded successfully");
