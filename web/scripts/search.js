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
      text: item.tmdbId+"",
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
      text: item.tmdbId+"",
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

  if ((document.getElementById('cy-cise').style.width == "80%") || (document.getElementById('cy-cise').style.width == "100%")) {
    cy.panBy({
      x: -230,
      y: 0
    });
  }

  document.getElementById('loading-slideshow').style.display = "none"
  document.getElementById('cy-cise').setAttribute("style", "width: 50%; float: left;")
  document.getElementById('cy-cose').style.display = "none"
  document.getElementById('side-loading-icon').style.display = "block"
  document.getElementById("side-loading-text").style.display = "block"
  document.getElementById('side').setAttribute("style", "width: 50%; float: right;")

  let sideLink = actorInfos["tmdbId"]
  let sideID = actorInfos["id"]
  let sideName = actorInfos["name"]
  let sideBirthday = actorInfos["birthday"]
  let sideDeathday = actorInfos["deathday"]
  let sidePlace = actorInfos["place_of_birth"]
  let sideBiography = actorInfos["biography"];
  let sidePicture = actorInfos["profile_path"]

  sideBirthday = sideBirthday.split("-")
  sideBirthday = sideBirthday[2] + "." + sideBirthday[1] + "." + sideBirthday[0]
  let sideTopInfo = sideName + " (" + sideBirthday
  if (sideDeathday) {
    sideDeathday = sideDeathday.split("-")
    sideDeathday = sideDeathday[2] + "." + sideDeathday[1] + "." + sideDeathday[0]
    sideTopInfo += " - " + sideDeathday + ")"
  } else { sideTopInfo += ", " + (new Date().getFullYear() - sideBirthday.split(".")[2]) + ")" }
  if (sidePlace) { sideTopInfo += ", " + sidePlace.split(",").slice(-1).pop() }

  document.getElementById('side-top-info').innerHTML = sideTopInfo
  document.getElementById('side-top-info').setAttribute("style", "text-align: center; font-size: 120%, font-weight: 900")
  document.getElementById('side-picture').src = "https://image.tmdb.org/t/p/w154/" + sidePicture
  document.getElementById('side-biography').innerHTML = sideBiography
  document.getElementById("side-url").href = "https://www.themoviedb.org/person/" + sideLink

  graphCose(sideLink, sideID.toString())
}


