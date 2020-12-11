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
const sliderNbActors = document.getElementById('sliderNbActors');
const sliderNbFriends = document.getElementById('sliderNbFriends');
const inputSliderNbMovies = document.getElementById('input-sliderNbMovies');
const inputSliderNbActors = document.getElementById('input-sliderNbActors');
const inputSliderNbFriends = document.getElementById('input-sliderNbFriends');

function sliderChange(slider) {
  if (slider.id === "slider-collab")
    inputSliderCollab.value = slider.value;
  else if (slider.id === "slider-appearences")
    inputSliderAppearences.value = slider.value;
  else if (slider.id === "sliderNbMovies")
    inputSliderNbMovies.value = slider.value;
  else if (slider.id === "sliderNbActors")
    inputSliderNbActors.value = slider.value;
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
  else if (input.id === "input-sliderNbActors")
    sliderNbActors.value = input.value;
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
  tmp_graph.push(JSON.parse(JSON.stringify(current_graph)));
  tmp_filters.push(current_config);
}

function peopleFilters() {
  let rbStillAliveChoice = $('[name ="rbStillAliveChoice"]:checked')[0];
  let searchCountryFilter = $('#searchCountryFilter')[0];

  if (tmp_graph.length === 0)
    save_graph_filters_state(graph, {});

  let all_ids_to_remove = [];
  let filters_config = {};
  graph = JSON.parse(JSON.stringify(tmp_graph[0]));

  if (cbxActorsFilter.checked && !cbxActressesFilter.checked) {
    let ids = graph.elements.nodes.filter(x => x.data.gender !== "Male").map(x => x.data.id);
    all_ids_to_remove = all_ids_to_remove.concat(ids);
    filters_config.actors = true;
  }
  if (cbxActressesFilter.checked && !cbxActorsFilter.checked) {
    let ids = graph.elements.nodes.filter(x => x.data.gender !== "Female").map(x => x.data.id);
    all_ids_to_remove = all_ids_to_remove.concat(ids);
    filters_config.actresses = true;
  }
  if (searchCountryFilter.value) {
    let ids = graph.elements.nodes.filter(x => {
      let pobFormat = x.data.place_of_birth.split(' ');
      return pobFormat[pobFormat.length - 1] !== searchCountryFilter.value
    }).map(x => x.data.id);
    all_ids_to_remove = all_ids_to_remove.concat(ids);
    filters_config.country = searchCountryFilter.value;
  }
  if (bornBetweenStartFilter.value) {
    let ids = graph.elements.nodes.filter(x => x.data.birthday < bornBetweenStartFilter.value).map(x => x.data.id);
    all_ids_to_remove = all_ids_to_remove.concat(ids);
    filters_config.bornStart = bornBetweenStartFilter.value;
  }
  if (bornBetweenEndFilter.value) {
    let ids = graph.elements.nodes.filter(x => x.data.birthday > bornBetweenEndFilter.value).map(x => x.data.id);
    all_ids_to_remove = all_ids_to_remove.concat(ids);
    filters_config.bornEnd = bornBetweenEndFilter.value;
  }
  if (rbStillAliveChoice) {
    if (rbStillAliveChoice.value === "yes") {
      let ids = graph.elements.nodes.filter(x => x.data.deathday !== "").map(x => x.data.id);
      all_ids_to_remove = all_ids_to_remove.concat(ids);
    } else if (rbStillAliveChoice.value === "no") {
      let ids = graph.elements.nodes.filter(x => x.data.deathday === "").map(x => x.data.id);
      all_ids_to_remove = all_ids_to_remove.concat(ids);
    }
    filters_config.stillAlive = rbStillAliveChoice;
  }
  if (inputSliderCollab.value) {
    let ids = graph.elements.nodes.filter(x => x.data.knowsDegree <= inputSliderCollab.value).map(x => x.data.id);
    all_ids_to_remove = all_ids_to_remove.concat(ids);
    filters_config.collab = inputSliderCollab.value;
  }
  if (inputSliderAppearences.value) {
    let ids = graph.elements.nodes.filter(x => x.data.playInDegree <= inputSliderAppearences.value).map(x => x.data.id);
    all_ids_to_remove = all_ids_to_remove.concat(ids);
    filters_config.apparences = inputSliderAppearences.value;
  }


  graph.elements.nodes = graph.elements.nodes.filter(x => !all_ids_to_remove.includes(x.data.id));
  graph.elements.edges = graph.elements.edges.filter(x => !all_ids_to_remove.includes(x.data.source) && !all_ids_to_remove.includes(x.data.target))

  save_graph_filters_state(graph, filters_config);
  graphCise(graph);

}

function backFilter() {
  // console.log("BACK to version : " + (tmp_graph.length-1).toString());
  if (tmp_graph.length > 1) {
    tmp_graph.pop(); // Quitte état courant
    graphCise(tmp_graph[tmp_graph.length - 1]);
    tmp_filters.pop(); // Quitte état courant
    restoreFiltersToState(tmp_filters[tmp_filters.length - 1]);
  }
}

function restoreFiltersToState(state) {
  let searchCountryFilter = $('#searchCountryFilter')[0];
  let rbStillAliveChoice = $('[name ="rbStillAliveChoice"]:checked')[0];
  state.actors ? cbxActorsFilter.checked = true : cbxActorsFilter.checked = false;
  state.actresses ? cbxActressesFilter.checked = true : cbxActressesFilter.checked = false;
  state.country ? searchCountryFilter.value = state.country : searchCountryFilter.value = "";
  state.bornStart ? bornBetweenStartFilter.value = state.bornStart : bornBetweenStartFilter.value = null;
  state.bornEnd ? bornBetweenEndFilter.value = state.bornEnd : bornBetweenEndFilter.value = null;
  state.stillAlive ? state.stillAlive.checked = true : rbStillAliveChoice ? rbStillAliveChoice.checked = false : null;
  state.collab ? inputSliderCollab.value = state.collab : inputSliderCollab.value = "";
  state.collab ? sliderCollab.value = state.collab : sliderCollab.value = 20;
  state.apparences ? inputSliderAppearences.value = state.apparences : inputSliderAppearences.value = "";
  state.apparences ? sliderAppearences.value = state.apparences : sliderAppearences.value = 5;

}

function resetGraph() {
  if (tmp_graph.length > 0) {
    graphCise(tmp_graph[0]);
    graph = tmp_graph[0];
    tmp_graph = [];
    tmp_filters = [];
  }
}

function resetPeopleFilters() {
  let rbStillAliveChoice = $('[name ="rbStillAliveChoice"]:checked')[0];
  let searchCountryFilter = $('#searchCountryFilter')[0];

  cbxActorsFilter.checked = true;
  cbxActressesFilter.checked = true;
  searchCountryFilter.value = "";
  bornBetweenStartFilter.value = "1930-01-01";
  bornBetweenEndFilter.value = "1980-01-01";
  if (rbStillAliveChoice)
    rbStillAliveChoice.checked = false;
  document.getElementById('rbDontCare').checked = true;
  inputSliderCollab.value = null;
  sliderCollab.value = 10;
  inputSliderAppearences.value = null;
  sliderAppearences.value = 5;

  resetGraph();
}

//// Shortest path

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let tmp_g;
let searchActorSP1 = null;
let searchActorSP2 = null;

$('.basicAutoSelectSearchPeopleOnly').autoComplete({
  resolver: 'custom',
  formatResult: function(item) {
    return {
      value: item.tmdbId,
      text: item.name,
      html: [
        item.name
      ]
    };
  },
  events: {
    search: function(query, callback) {
      let limitActors = 5;
      let limitMovies = 0;
      searchRequest(query, limitActors, limitMovies, callback);
    }
  }
});

$('#searchActorSP1').on('autocomplete.select', function(evt, item) {
  searchActorSP1 = item.tmdbId;
});

$('#searchActorSP2').on('autocomplete.select', function(evt, item) {
  searchActorSP2 = item.tmdbId;
});

function computeSP() {
  tmp_g = tmp_graph.length > 0 ? tmp_graph[tmp_graph.length - 1] : graph;

  let errorSP = $('#errorSP')[0];

  if (searchActorSP1 && searchActorSP2)
    spQuery(searchActorSP1, searchActorSP2);
  else {
    errorSP.style.display = 'block';
    sleep(3000).then(() => {
      errorSP.style.display = 'none';
    })
  }
}

function clearSP() {
  let searchActorSP1 = $('#searchActorSP1')[0];
  let searchActorSP2 = $('#searchActorSP2')[0];

  searchActorSP1 = null;
  searchActorSP2 = null;
  // console.log(tmp_g);
  if (tmp_g) {
    graphCise(tmp_g);
  }
}

function spQuery(tmdbId1, tmdbId2) {
  fetch(env.API_BASE_URL + `/graph/shortestPath/${tmdbId1}/${tmdbId2}`)
    .then(res => {
      res.json().then(json => {
        graphCise(json);
      }).catch(err => {
        let errorQSP = $('#errorQSP')[0];
        errorQSP.style.display = 'block';
        sleep(3000).then(() => {
          errorQSP.style.display = 'none';
        })
      })
    })
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