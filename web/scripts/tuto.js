let tutoImg = ["./img/Tuto_01_General.png",
  "./img/Tuto_02_Nodes.png",
  "./img/Tuto_03_Edges.png",
  "./img/Tuto_04_Side.png",
  "./img/Tuto_05_Search.png",
  "./img/Tuto_06_Filters.png",
  "./img/Tuto_07_SP.png"
]

let currentIdx = 0;
let btnBack = document.getElementById("btnBack");
let btnNext = document.getElementById("btnNext");

btnBack.style.visibility = 'hidden';


function back() {
  currentIdx--;
  $('#tutoImg').attr("src", tutoImg[currentIdx]);
  if (currentIdx === 0)
    btnBack.style.visibility = 'hidden';
  if (btnNext.style.visibility === 'hidden')
    btnNext.style.visibility = 'visible';
}

function next() {
  if (btnBack.style.visibility === 'hidden')
    btnBack.style.visibility = 'visible';
  currentIdx++;
  $('#tutoImg').attr("src", tutoImg[currentIdx]);
  if (currentIdx === tutoImg.length - 1)
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