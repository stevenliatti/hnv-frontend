$(document).ready(() => {
  $('#sidebarCollapse').on('click', () => {
    $('#sidebar').toggleClass('active');
    $(this).toggleClass('active');
  });
});


/////// MANAGE SLIDERS

const sliderBuget = document.getElementById('slider-buget');
const inputSliderBudget = document.getElementById('input-slider-buget');
const sliderRevenue = document.getElementById('slider-revenue');
const inputSliderRevenue = document.getElementById('input-slider-revenue');
const sliderLength = document.getElementById('slider-length');
const inputSliderLength = document.getElementById('input-slider-length');

function sliderChange(slider) {
  if (slider.id === "slider-buget")
    inputSliderBudget.value = slider.value;
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