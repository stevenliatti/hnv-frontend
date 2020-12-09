let tutoImg = ["./img/img1.png", "./img/img2.jpg", "./img/img3.png"]

let currentIdx = 0;
let btnBack = document.getElementById("btnBack");
let btnNext = document.getElementById("btnNext");

btnBack.style.visibility = 'hidden';


function back() {
    currentIdx--;
    $('#tutoImg').attr("src", tutoImg[currentIdx]);
    if(currentIdx === 0)
        btnBack.style.visibility = 'hidden';
    if(btnNext.style.visibility === 'hidden')
        btnNext.style.visibility = 'visible';
}

function next() {
    if(btnBack.style.visibility === 'hidden')
        btnBack.style.visibility = 'visible';
    currentIdx++;
    $('#tutoImg').attr("src", tutoImg[currentIdx]);
    if(currentIdx === tutoImg.length-1)
        btnNext.style.visibility = 'hidden';

}

function resetTuto() {
    currentIdx = 0;
    $('#tutoImg').attr("src", tutoImg[currentIdx]);
    btnBack.style.visibility = 'hidden';
    btnNext.style.visibility = 'visible';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*function autoChange() {
    sleep(3000).then(() => {
        next();
        if(currentIdx === tutoImg.length-1)
            return;
        else
            autoChange();
    });
 }*/