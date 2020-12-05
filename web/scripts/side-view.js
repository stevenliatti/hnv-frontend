let sideLoading

// Create sideview on click
function showSideView(cy, sideViewFn) {
  cy.on("click", "node", function(evt) {
      sideViewFn(evt)
    })
    // cy.on("cxttapstart", "node", function(evt) {
    //   sideViewFn(evt)
    // })
}

function hideSideView(cy, sideViewFn) {
  cy.on("cxttapstart", "node", function(evt) {
    sideViewFn(evt)
  })
}

function closeSideView(node, cy) {
  if (document.getElementById('cy-cise').style.width == "50%") {
    cy.panBy({
      x: 230,
      y: 0
    });
  }
  document.getElementById('cy-cise').setAttribute("style", "width: 100%; height: 700px; float: left;")
  document.getElementById('side').setAttribute("style", "width: 0%; overflow: hidden; float: right;")
}

function createSideView(node, cy) {

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

  let sideID = cy.$id(node.id()).data()["tmdbId"]
  let sideName = cy.$id(node.id()).data()["name"]
  let sideBirthday = cy.$id(node.id()).data()["birthday"]
  let sideDeathday = cy.$id(node.id()).data()["deathday"]
  let sidePlace = cy.$id(node.id()).data()["place_of_birth"]
  let sideBiography = textExtract(cy.$id(node.id()).data()["biography"], 300)
  let sidePicture = cy.$id(node.id()).data()["profile_path"]
  let sideLink = cy.$id(node.id()).data()["tmdbId"]

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

  graphCose(sideID)
}