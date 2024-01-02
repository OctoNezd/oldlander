import { OLFeature } from "../base"

// 
function isMarginClick(element: HTMLElement, e: MouseEvent) {
    var style = window.getComputedStyle(element, null);
    var pTop = parseInt( style.getPropertyValue('margin-top') );
    var pRight = parseFloat( style.getPropertyValue('margin-right') );
    var pLeft = parseFloat( style.getPropertyValue('margin-left') );  
    var pBottom = parseFloat( style.getPropertyValue('margin-bottom') );
    var width = element.offsetWidth;
    var height = element.offsetHeight;
    var x = e.offsetX;
    var y = e.offsetY;  
  
    return !(( x > pLeft && x < width - pRight) &&
             ( y > pTop && y < height - pBottom))
  }

export default class IndentCommentHide extends OLFeature {
    moduleId: string = "IndentCommentHide";
    moduleName: string = "Hide comments on tap on indent";
    async onPost(post: HTMLDivElement): Promise<void> {
        if (post.classList.contains("comment")) {
            post.addEventListener("click", (e) => {
                if (!(e.target as HTMLElement).classList.contains("sitetable")) {
                    return;
                }
                if (isMarginClick(post, e)) {
                    console.log("padding clicked!", post, e)
                    e.stopPropagation();
                    (post.querySelector(".expand") as HTMLAnchorElement).click()
                }
            })
        }
    }
}