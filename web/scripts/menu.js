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

let tmp_graph = [];
let tmp_filters = [];

function save_graph_filters_state(current_graph, current_config) {
  tmp_graph.push(JSON.parse( JSON.stringify( current_graph ) ));
  tmp_filters.push(current_config);
}

function peopleFilters() {
  let rbStillAliveChoice = $('[name ="rbStillAliveChoice"]:checked')[0];
  let searchCountryFilter = $('#searchCountryFilter')[0];

  if(tmp_graph.length === 0)
    save_graph_filters_state(graph, {});

  let all_ids_to_take = []
  let filters_config = {};
  graph = JSON.parse( JSON.stringify( tmp_graph[0] ) );

  /*
  
console.log(graph.elements.nodes.filter(x => x.data.gender === "Female")); // Femme
console.log(graph.elements.nodes.filter(x => x.data.gender === "Male")); // Homme
console.log(graph.elements.nodes.filter(x => x.data.place_of_birth === "USA")); // Lieux de naissance
console.log(graph.elements.nodes.filter(x => x.data.birthday >= "1974-11-11" && x.data.birthday <= "2000-11-11")); // Nés entre X et X
console.log(graph.elements.nodes.filter(x => x.data.deathday === "")); // Vivants
console.log(graph.elements.nodes.filter(x => x.data.deathday !== "")); // Morts
*/

  if (cbxActorsFilter.checked) {
    all_ids_to_take = all_ids_to_take
    .concat(graph.elements.nodes
      .filter(x => x.data.gender === "Male").map(x => x.data.id));
    filters_config.actors = true;
  }
  if (cbxActressesFilter.checked) {
    all_ids_to_take = all_ids_to_take.concat(graph.elements.nodes
      .filter(x => x.data.gender === "Female").map(x => x.data.id));
    filters_config.actresses = true;  
  }
  if (searchCountryFilter.value) {
    all_ids_to_take = all_ids_to_take
    .concat(graph.elements.nodes
      .filter(x => {
        let pobFormat = x.data.place_of_birth.split(' ');
        return pobFormat[pobFormat.length-1] === searchCountryFilter.value
      }).map(x => x.data.id));
    filters_config.country = searchCountryFilter.value;
  }
  if (bornBetweenStartFilter.value) {
    all_ids_to_take = all_ids_to_take.concat(graph.elements.nodes
    .filter(x => x.data.birthday > bornBetweenStartFilter.value).map(x => x.data.id));
    console.log(graph.elements.nodes.filter(x => x.data.birthday > bornBetweenStartFilter.value));
    filters_config.bornStart = bornBetweenStartFilter.value;
  }
  if (bornBetweenEndFilter.value) {
    all_ids_to_take = all_ids_to_take.concat(graph.elements.nodes
    .filter(x => x.data.birthday < bornBetweenStartFilter.value).map(x => x.data.id));
    filters_config.bornEnd = bornBetweenEndFilter.value;
  }
  if (rbStillAliveChoice) {
    if(rbStillAliveChoice.value === "yes")
      all_ids_to_take = all_ids_to_take.concat(graph.elements.nodes
      .filter(x => x.data.deathday === "").map(x => x.data.id));
    else if (rbStillAliveChoice.value === "no")
      all_ids_to_take = all_ids_to_take.concat(graph.elements.nodes
      .filter(x => x.data.deathday !== "").map(x => x.data.id));
    filters_config.stillAlive = rbStillAliveChoice;
  }
  if (inputSliderCollab.value) {
    console.log("INPUT COLLAB : " + inputSliderCollab.value);
    filters_config.collab = inputSliderCollab.value;
    all_ids_to_take = all_ids_to_take.concat(graph.elements.nodes
      .filter(x => x.data.knowsDegree >= inputSliderCollab.value).map(x => x.data.id));
    filters_config.collab = bornBetweenEndFilter.value;
  }
  if (inputSliderAppearences.value) {
    console.log("INPUT APPARENCES : " + inputSliderAppearences.value);
    filters_config.apparences = inputSliderAppearences.value;
  }



  if(all_ids_to_take.length > 0) {
    graph.elements.nodes = graph.elements.nodes.filter(x => all_ids_to_take.includes(x.data.id));
    graph.elements.edges = graph.elements.edges.filter(x => all_ids_to_take.includes(x.data.source) && all_ids_to_take.includes(x.data.target))
    
    save_graph_filters_state(graph, filters_config);
    graphCise(graph);
  }

}

function backFilter() {
  console.log("BACK to version : " + (tmp_graph.length-1).toString());
  if(tmp_graph.length > 1) {
    tmp_graph.pop(); // Quitte état courant
    graphCise(tmp_graph[tmp_graph.length-1]);
    tmp_filters.pop(); // Quitte état courant
    restoreFiltersToState(tmp_filters[tmp_filters.length-1]);
  }
  console.log("NEW LENGTH : " + tmp_graph.length);
}

function restoreFiltersToState(state) {
  let searchCountryFilter = $('#searchCountryFilter')[0];
  state.actors ? cbxActorsFilter.checked = true : cbxActorsFilter.checked = false;
  state.actresses ? cbxActressesFilter.checked = true : cbxActressesFilter.checked = false;
  state.country ? searchCountryFilter.value = state.country : searchCountryFilter.value = "";
  state.bornStart ? bornBetweenStartFilter.value = state.bornStart : bornBetweenStartFilter.value = null;
  state.bornEnd ? bornBetweenEndFilter.value = state.bornEnd :   bornBetweenEndFilter.value = null;
  state.stillAlive ? state.stillAlive.checked = true : state.stillAlive.checked = false;
}

function resetGraph() {
  if(tmp_graph.length > 0) {
    graphCise(tmp_graph[0]);
    graph = tmp_graph[0];
    tmp_graph = [];
    restoreFiltersToState(tmp_filters[0]);
    tmp_filters = [];
  }
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
  inputSliderCollab.value = null;
  sliderCollab.value = 20;
  inputSliderAppearences.value = null;
  sliderAppearences.value = 5;

  resetGraph();
}

//// Shortest path

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function computeSP() {
  save_restore_graph_state(graph);
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
  if(tmp_graph[0]) {
    graphCise(tmp_graph[0]);
    graph = tmp_graph[0];
  }
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