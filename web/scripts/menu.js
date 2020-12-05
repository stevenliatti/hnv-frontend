$(document).ready(() => {
  $('#sidebarCollapse').on('click', () => {
    $('#sidebar').toggleClass('active');
    $(this).toggleClass('active');
  });
});


/////// MANAGE SLIDERS

const sliderBuget = document.getElementById('slider-buget');
const inputSliderBuget = document.getElementById('input-slider-buget');
const sliderRevenue = document.getElementById('slider-revenue');
const inputSliderRevenue = document.getElementById('input-slider-revenue');
const sliderLength = document.getElementById('slider-length');
const inputSliderLength = document.getElementById('input-slider-length');

function sliderChange(slider) {
  if (slider.id === "slider-buget")
    inputSliderBuget.value = slider.value;
  else if (slider.id === "slider-revenue")
    inputSliderRevenue.value = slider.value;
  else if (slider.id === "slider-length")
    inputSliderLength.value = slider.value;
}

function InputSliderChange(input) {
  if (input.id === "input-slider-buget")
    sliderBuget.value = input.value;
  else if (input.id === "input-slider-revenue")
    sliderRevenue.value = input.value;
  else if (input.id === "input-slider-length")
    sliderLength.value = input.value;
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
}

//// Movie filters
let madeBetweenStartFilter = $('#madeBetweenStartFilter')[0];
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
}

//// Shortest path

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function computeSP() {
  let searchActorSP1 = $('#searchActorSP1')[0];
  let searchActorSP2 = $('#searchActorSP2')[0];
  let errorSP = $('#errorSP')[0];

  if(searchActorSP1.value)
    console.log("ACTOR1 : " + searchActorSP1.value);
  if(searchActorSP1.value)
    console.log("ACTOR2 : " + searchActorSP2.value);
  if(searchActorSP1.value && searchActorSP2.value)
    console.log("OK");
  else{
    errorSP.style.display = 'block';
    sleep(3000).then(() => {
      errorSP.style.display = 'none ';
    })
  }
}


function clearSP() {
  let searchActorSP1 = $('#searchActorSP1')[0];
  let searchActorSP2 = $('#searchActorSP2')[0];

  searchActorSP1.value = "";
  searchActorSP2.value = "";
}