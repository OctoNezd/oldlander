import "./extensionPreferences";
import "./viewport";
import "./styling";
import "./header";
import "./features/posts";
import "./redditPreferences";
console.log("oldlander userscript loaded");
if (document.documentElement.classList.contains("oldlander")) {
    location.reload()
} else {
    document.documentElement.classList.add("oldlander");
}