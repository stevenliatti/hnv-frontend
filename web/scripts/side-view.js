let sideLoading

// Create sideview on click
function showSideView(cy, sideViewFn) {
  cy.on("click", function(evt) {
    if ((currentNodeSelected) && (evt.target === cy)) {
      currentNodeSelected = 'none'
      cy.elements().removeClass('unfocused')
      cy.elements().removeClass('focused')
    }
  })
  cy.on("click", "node", function(evt) {
    let sel = evt.target
    currentNodeSelected = sel
    cy.elements()
      .difference(sel.outgoers()
        .union(sel.incomers()))
      .not(sel)
      .addClass('unfocused')
    sel.addClass('focused')
      .outgoers()
      .union(sel.incomers())
      .addClass('focused')
    sideViewFn(evt)
  })
}

function hideSideView(cy, sideViewFn) {
  cy.on("cxttapstart", "node", function(evt) {
    sideViewFn(evt)
  })
}

function closeSideView(cy) {
  // console.log('yes')
  if (document.getElementById('cy-cise').style.width == "50%") {
    cy.panBy({
      x: 230,
      y: 0
    });
  }
  document.getElementById('cy-cise').setAttribute("style", "width: 100%; height: 85%; float: left;")
  document.getElementById('side').setAttribute("style", "width: 0%; height: 90%; overflow: hidden; float: right;")
}

function actorInfosSideView(
  cy,
  sideLink,
  sideID,
  sideName,
  sideBirthday,
  sideDeathday,
  sidePlace,
  sideBiography,
  sidePicture
) {
  if (cy._private.container.offsetWidth > 1000) {
    cy.panBy({
      x: -230,
      y: 0
    });
  }

  document.getElementById('loading-slideshow').style.display = "none"
  document.getElementById('cy-cise').setAttribute("style", "width: 50%; height: 85%; float: left;")
  document.getElementById('cy-cose').style.display = "none"
  document.getElementById('side-loading-icon').style.display = "block"
  document.getElementById("side-loading-text").style.display = "block"
  document.getElementById('side').setAttribute("style", "width: 50%; float: right;")

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
  document.getElementById('side-middle-info').style.display = "none";
  document.getElementById('side-top-info').setAttribute("style", "text-align: center; font-size: 120%, font-weight: 900")
  document.getElementById('side-picture').src = "https://image.tmdb.org/t/p/w154/" + sidePicture
  document.getElementById('side-biography').innerHTML = sideBiography
  document.getElementById("side-url").href = "https://www.themoviedb.org/person/" + sideLink
  document.getElementById("side-url").className = "hovertextactor";

  actorGraphCose(sideID, sideLink)
}

function createSideView(node, cy) {
  let sideLink = cy.$id(node.id()).data()["tmdbId"]
  let sideID = cy.$id(node.id()).data()["id"]
  let sideName = cy.$id(node.id()).data()["name"]
  let sideBirthday = cy.$id(node.id()).data()["birthday"]
  let sideDeathday = cy.$id(node.id()).data()["deathday"]
  let sidePlace = cy.$id(node.id()).data()["place_of_birth"]
  let sideBiography = textExtract(cy.$id(node.id()).data()["biography"], 300)
  let sidePicture = cy.$id(node.id()).data()["profile_path"]

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

function movieInfosSideView(
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
) {
  if (cy._private.container.offsetWidth > 1000) {
    cy.panBy({
      x: -230,
      y: 0
    });
  }

  document.getElementById('loading-slideshow').style.display = "none"
  document.getElementById('cy-cise').setAttribute("style", "width: 50%; height: 85%; float: left;")
  document.getElementById('cy-cose').style.display = "none"
  document.getElementById('side-loading-icon').style.display = "block"
  document.getElementById("side-loading-text").style.display = "block"
  document.getElementById('side').setAttribute("style", "width: 50%; float: right;")

  if (sideReleaseDate) {
    sideReleaseDate = sideReleaseDate.split("-")[0];
  } else {
    sideReleaseDate = "";
  }

  if (sideRuntime) {
    sideRuntime = `${sideRuntime} minutes`;
  } else {
    sideRuntime = "";
  }

  let sideTopInfo = `${sideTitle} (${sideReleaseDate}), ${sideRuntime}`;
  let sideTopInfoElement = document.getElementById('side-top-info');
  sideTopInfoElement.innerHTML = sideTopInfo;
  sideTopInfoElement.setAttribute("style", "text-align: center; font-size: 120%, font-weight: 900")

  document.getElementById('side-middle-info').style.display = "block";
  document.getElementById('side-middle-info').innerHTML = `${sideTagline}`;

  document.getElementById('side-picture').src = "https://image.tmdb.org/t/p/w154/" + sidePicture
  document.getElementById('side-biography').innerHTML = textExtract(sideOverview, 300);
  document.getElementById("side-url").href = "https://www.themoviedb.org/movie/" + sideLink
  document.getElementById("side-url").className = "hovertextmovie";

  movieGraphCose(sideID, graph)
}