let placesOfBirth = [];
getAllPlacesOfBirth();

let cyCise = cytoscape({
  container: document.getElementById('cy-cise')
})

$('.basicAutoSelectSearch').autoComplete({
  resolver: 'custom',
  formatResult: function(item) {
    return {
      value: item.tmdbId,
      text: item.tmdbId + "",
      html: [
        item.name, ' ',
        formatLabel(item.label)
      ]
    };
  },
  events: {
    search: function(query, callback) {
      let limitActors = 5;
      let limitMovies = 5;
      searchRequest(query, limitActors, limitMovies, callback);
    }
  }
});

$('.basicAutoSelectSearchPeopleOnly').autoComplete({
  resolver: 'custom',
  formatResult: function(item) {
    return {
      value: item.id,
      text: item.tmdbId + "",
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

$('.basicAutoSelectSearchCountry').autoComplete({
  resolver: 'custom',
  formatResult: function(item) {
    return {
      value: item,
      text: item,
      html: [
        item
      ]
    };
  },
  events: {
    search: function(query, callback) {
      searchCountryQuery(query, callback);
    }
  }
});

function searchCountryQuery(query, callback) {
  callback(placesOfBirth.filter(x => x.toLowerCase().includes(query.toLowerCase())));
}


function searchRequest(query, limitActors, limitMovies, callback) {
  fetch(env.API_BASE_URL + `/search?criteria=${query}&limitActors=${limitActors}&limitMovies=${limitMovies}`)
    .then(res =>
      res.json().then(json => {
        callback(json);
      }))
}

function getAllPlacesOfBirth() {
  fetch(env.API_BASE_URL + `/placesOfBirth`)
    .then(res =>
      res.json().then(json => {
        placesOfBirth = json;
      }))
}

function formatLabel(label) {
  if (label === "Actor") {
    return $("<span>").append(label).css("color", "green").css("float", "right");
  } else {
    return $("<span>").append(label).css("color", "blue").css("float", "right");
  }
}

$('.basicAutoSelectSearch').on('change', (event) => {
  console.log(event.target.value);
  findInfos(event.target.value);
  // Little hack
  document.getElementById("mainSearchBar").value = "";
  // createSideView(node, cy)
});

function findInfos(tmdbId) {
  fetch(env.API_BASE_URL + `/actor/${tmdbId}`)
    .then(res =>
      res.json().then(json => {
        console.log(json);
        createSideViewSearch(json['actor'], cyCise);
      }))
}

function createSideViewSearch(actorInfos, cy) {
  let sideLink = actorInfos["tmdbId"]
  let sideID = actorInfos["id"]
  let sideName = actorInfos["name"]
  let sideBirthday = actorInfos["birthday"]
  let sideDeathday = actorInfos["deathday"]
  let sidePlace = actorInfos["place_of_birth"]
  let sideBiography = actorInfos["biography"];
  let sidePicture = actorInfos["profile_path"]

  actorInfosSideView(
    cy,
    sideLink,
    sideID,
    sideName,
    sideBirthday,
    sideDeathday,
    sidePlace,
    sideBiography,
    sidePicture
  )
}