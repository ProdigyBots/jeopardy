/**
 * Answers script handling answer overlays and daily doubles.
 */

 /**
  * Handles a non-image answer.
  * @param {string} data answer text
  * @param {object} element value box element
  */
 function answer(data, element) {
    if (data.toString().toLowerCase().includes("daily double")) 
        document.getElementById("dailydouble").style.display = "block";

    document.getElementById("answer").children[0].innerHTML = data;
    document.getElementById("answer").style.display = "block";
    element.children[0].style.visibility = "hidden";
}

/**
 * Handles an image answer.
 * @param {string} data answer text
 * @param {object} element value box element
 * @param {string} src path to image
 */
function imageAnswer(data, element, src) {
    if (data.toString().toLowerCase().includes("daily double")) 
        document.getElementById("dailydouble").style.display = "block";
    
    document.getElementById("imageanswer").children[0].innerHTML = data;
    document.getElementById("imageanswer").children[1].setAttribute("src", src);
    document.getElementById("imageanswer").style.display = "block";
    element.children[0].style.visibility = "hidden";
}

/**
 * Clears the current daily double overlay,
 * making the answer overlay beneath visible.
 */
function clearDailyDouble() {
    document.getElementById("dailydouble").style.display = "none";
}

/**
 * Clears any current screen answer overlay,
 * returning to the home answers page.
 */
function home() {
    document.getElementById("imageanswer").style.display = "none";
    document.getElementById("answer").style.display = "none";
}
