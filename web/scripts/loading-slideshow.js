// Function to return a random number between min and max excluded
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Split array making sure an opening parenthesis is met with a closing one
function prettySplitter(splitArray) {
  let firstSplit = splitArray[0]
  if (firstSplit.includes("(")) {
    if (firstSplit.includes(")")) { return firstSplit } else {
      idx = 1
      do {
        firstSplit += splitArray[idx]
        idx++
      } while ((firstSplit.split("(").length - 1) != (firstSplit.split(")").length - 1) && idx < 20)
    }
    return firstSplit
  } else { return firstSplit }
}

// Extract an exerpt of the TMDb description for a specified length
function textExtract(textDescription, descriptionLength) {
  let currentDescription = textDescription.split("\n")
  let currentDescriptionText = ""
  if (currentDescription.length == 0 || !(currentDescription[0])) {
    currentDescriptionText = "TMDb does not provide any description for this person."
  } else {
    currentDescription = currentDescription.filter(function(value, index, arr) {
      return (!(value.includes('Wikipedia')) && (value))
    })
    if (currentDescription.length == 1) {
      if (currentDescription[0].length > descriptionLength) {
        currentDescriptionText = currentDescription[0].substring(0, descriptionLength) + prettySplitter(currentDescription[0].substring(descriptionLength, 2 * descriptionLength).split("."))
        if (currentDescriptionText.slice(-1) == ".") { currentDescriptionText += " [More on TMDb]" } else { currentDescriptionText += ". [More on TMDb]" }
      } else {
        currentDescriptionText = currentDescription[0]
      }
    } else {
      let tempDescription = ""
      idx = 0
      do {
        tempDescription = currentDescriptionText + currentDescription[idx]
        if (tempDescription.length < 500) {
          currentDescriptionText += currentDescription[idx] + "<br>"
        } else {
          currentDescriptionText += currentDescription[idx].substring(0, descriptionLength) + prettySplitter(currentDescription[idx].substring(descriptionLength, 2 * descriptionLength).split("."))
          if (currentDescriptionText.slice(-1) == ".") { currentDescriptionText += " [More on TMDb]" } else { currentDescriptionText += ". [More on TMDb]" }
        }
        idx++
      } while ((currentDescriptionText.length < descriptionLength) && (idx < currentDescription.length))
    }
  }
  return currentDescriptionText
}

// Main fuction, load name, description, url and picture
function loadingSlideshow(graph) {
  let arrayActors = graph.elements.nodes

  let descriptionLength = 200
  let loadingSlideshowActor = arrayActors[randInt(0, arrayActors.length)]
  while (loadingSlideshowActor.data.biography.length < descriptionLength) {
    loadingSlideshowActor = arrayActors[randInt(0, arrayActors.length)]
  }
  descriptionLength = 500

  document.getElementById("loading-slideshow-name").innerHTML = loadingSlideshowActor.data.name
  document.getElementById("loading-slideshow-description").innerHTML = textExtract(loadingSlideshowActor.data.biography, descriptionLength)
  document.getElementById("loading-slideshow-url").href = "https://www.themoviedb.org/person/" + loadingSlideshowActor.data.tmdbId
  document.getElementById("loading-slideshow-picture").src = "https://image.tmdb.org/t/p/w154/" + loadingSlideshowActor.data.profile_path
}

// Same as main function, uses the global variable graph
function loadingAnother() {
  loadingSlideshow(graph)
}