$(document).ready(() => {
  $('#sidebarCollapse').on('click', () => {
    $('#sidebar').toggleClass('active');
    $(this).toggleClass('active');
  });
});


/////// MANAGE SLIDERS

// Side menu
const sliderCollab = document.getElementById('slider-collab');
const inputSliderCollab = document.getElementById('input-slider-collab');
const sliderAppearences = document.getElementById('slider-appearences');
const inputSliderAppearences = document.getElementById('input-slider-appearences');
// Navbar
const sliderNbMovies = document.getElementById('sliderNbMovies');
const sliderNbAcors = document.getElementById('sliderNbAcors');
const sliderNbFriends = document.getElementById('sliderNbFriends');
const inputSliderNbMovies = document.getElementById('input-sliderNbMovies');
const inputSliderNbAcors = document.getElementById('input-sliderNbAcors');
const inputSliderNbFriends = document.getElementById('input-sliderNbFriends');

function sliderChange(slider) {
  if (slider.id === "slider-collab")
    inputSliderCollab.value = slider.value;
  else if (slider.id === "slider-appearences")
    inputSliderAppearences.value = slider.value;
  else if (slider.id === "sliderNbMovies")
    inputSliderNbMovies.value = slider.value;
  else if (slider.id === "sliderNbAcors")
    inputSliderNbAcors.value = slider.value;
  else if (slider.id === "sliderNbFriends")
    inputSliderNbFriends.value = slider.value;
}

function InputSliderChange(input) {
  if (input.id === "input-slider-collab")
    sliderCollab.value = input.value;
  else if (input.id === "input-slider-appearences")
    sliderAppearences.value = input.value;
  else if (input.id === "input-sliderNbMovies")
    sliderNbMovies.value = input.value;
  else if (input.id === "input-sliderNbAcors")
    sliderNbAcors.value = input.value;
  else if (input.id === "input-sliderNbFriends")
    sliderNbFriends.value = input.value;
}


//// People filters

let cbxActorsFilter = $('#cbxActorsFilter')[0];
let cbxActressesFilter = $('#cbxActressesFilter')[0];
let bornBetweenStartFilter = $('#bornBetweenStartFilter')[0];
let bornBetweenEndFilter = $('#bornBetweenEndFilter')[0];

function peopleFilters() {
  let rbStillAliveChoice = $('[name ="rbStillAliveChoice"]:checked')[0];
  let searchCountryFilter = $('#searchCountryFilter')[0];

  if (cbxActorsFilter.checked)
    console.log("ACTORSFILTERCHECKD");
  if (cbxActressesFilter.checked)
    console.log("ACTRESSES CHECKED");
  if (searchCountryFilter.value)
    console.log("COUNTRy : " + searchCountryFilter.value);
  if (bornBetweenStartFilter.value)
    console.log("STARTDATE: " + bornBetweenStartFilter.value);
  if (bornBetweenEndFilter.value)
    console.log("ENDDATE: " + bornBetweenEndFilter.value);
  if (rbStillAliveChoice)
    console.log("VALUERB: " + rbStillAliveChoice.value);
  if (inputSliderCollab.value)
    console.log("INPUT COLLAB : " + inputSliderCollab.value);
  if (inputSliderAppearences.value)
    console.log("INPUT APPARENCES : " + inputSliderAppearences.value);
}

function resetPeopleFilters() {
  let rbStillAliveChoice = $('[name ="rbStillAliveChoice"]:checked')[0];
  let searchCountryFilter = $('#searchCountryFilter')[0];

  cbxActorsFilter.checked = false;
  cbxActressesFilter.checked = false;
  searchCountryFilter.value = "";
  bornBetweenStartFilter.value = null;
  bornBetweenEndFilter.value = null;
  if (rbStillAliveChoice)
    rbStillAliveChoice.checked = false;
  inputSliderCollab.value = 50;
  sliderCollab.value = 50;
  inputSliderAppearences.value = 50;
  sliderAppearences.value = 50;
}

//// Shortest path

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function computeSP() {
  let searchActorSP1 = $('#searchActorSP1')[0];
  let searchActorSP2 = $('#searchActorSP2')[0];
  let errorSP = $('#errorSP')[0];

  if(searchActorSP1.value && searchActorSP1.value)
    spQuery(searchActorSP1.value, searchActorSP2.value);
  else{
    errorSP.style.display = 'block';
    sleep(3000).then(() => {
      errorSP.style.display = 'none';
    })
  }
}


function clearSP() {
  let searchActorSP1 = $('#searchActorSP1')[0];
  let searchActorSP2 = $('#searchActorSP2')[0];

  searchActorSP1.value = "";
  searchActorSP2.value = "";
}

function spQuery(tmdbId1, tmdbId2) {
  fetch(env.API_BASE_URL + `/graph/shortestPath/${tmdbId1}/${tmdbId2}`)
  .then(res =>
    res.json().then(json => {
      console.log(json);
      graphCise(json);
    }))
}


//// Movie filters
/*let madeBetweenStartFilter = $('#madeBetweenStartFilter')[0];
let madeBetweenStopFilter = $('#madeBetweenStopFilter')[0];

function movieFilters() {
  if (madeBetweenStartFilter.value)
    console.log("START DATE: " + madeBetweenStartFilter.value);
  if (madeBetweenStopFilter.value)
    console.log("END DATE: "+ madeBetweenStopFilter.value);
  if (inputSliderBuget.value)
    console.log("INPUT BUGET : " + inputSliderBuget.value);
  if (inputSliderRevenue.value)
    console.log("INPUT REVENU: " + inputSliderRevenue.value);
  if (inputSliderLength.value)
    console.log("INPUT LENGTH: " + inputSliderLength.value);
}

function resetMovieFilters() {
  madeBetweenStartFilter.value = null;
  madeBetweenStopFilter.value = null;
  inputSliderBuget.value = 50;
  inputSliderRevenue.value = 50;
  inputSliderLength.value = 50;
  sliderBuget.value = 50;
  sliderRevenue.value = 50;
  sliderLength.value = 50;
}*/