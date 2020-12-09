let placesOfBirth = [];
getAllPlacesOfBirth();

$('.basicAutoSelectSearch').autoComplete({
  resolver: 'custom',
  formatResult: function(item) {
    return {
      value: item.tmdbId,
      text: JSON.stringify({
        label: item.label,
        tmdbId: item.tmdbId
      }),
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
    return $("<span>").append(label).css("color", "rgb(117,169,249, 1)").css("float", "right");
  } else {
    return $("<span>").append(label).css("color", "rgb(249,170,117, 1)").css("float", "right");
  }
}

$('.basicAutoSelectSearch').on('change', (event) => {
  const result = JSON.parse(event.target.value);
  // console.log("in change:", result);
  findInfos(result.tmdbId, result.label);
  // Little hack
  document.getElementById("mainSearchBar").value = "";
});

function findInfos(tmdbId, label) {
  switch (label) {
    case 'Actor':
      getActor(tmdbId)
        .then(actor => {
          createSideViewSearchActor(actor['actor'], cyCise);
        })
      break;
    case 'Movie':
      getMovieGraph(tmdbId)
        .then(graph => {
          const movieData = graph.nodes.map(n => n.data).find(n => n.tmdbId == tmdbId);
          createSideViewSearchMovie(movieData, graph, cyCise);
        })
      break;
    default:
      break;
  }
}

function createSideViewSearchActor(actorInfos, cy) {
  let sideLink = actorInfos["tmdbId"]
  let sideID = actorInfos["id"]
  let sideName = actorInfos["name"]
  let sideBirthday = actorInfos["birthday"]
  let sideDeathday = actorInfos["deathday"]
  let sidePlace = actorInfos["place_of_birth"]
  let sideBiography = textExtract(actorInfos["biography"], 500);
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

function createSideViewSearchMovie(movieData, graph, cy) {
  let sideLink = movieData["tmdbId"];
  let sideID = movieData["id"];
  let sideTitle = movieData["title"];
  let sideTagline = movieData["tagline"];
  let sideReleaseDate = movieData["release_date"];
  let sideRuntime = movieData["runtime"];
  let sideOverview = movieData["overview"];
  let sidePicture = movieData["poster_path"];

  movieInfosSideView(
    graph,
    cy,
    sideLink,
    sideID,
    sideTitle,
    sideTagline,
    sideReleaseDate,
    sideRuntime,
    sideOverview,
    sidePicture
  )
}