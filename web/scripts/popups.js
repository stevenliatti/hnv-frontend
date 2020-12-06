let currentNodeSelected = 'none'

let popupNodeInstance = false
let divPopupNode
let divPopupEdge
  // let divPopupNodeName
  // let divPopupNodeDescription

function popupEdgeManagement(cy, popupFN) {
  cy.on("click", "edge", function(evt) {
    popupFN(evt)
  })
}

// Node mouseover / mouseout management, to show node popup with more infos
function popupNodeManagement(cy, popupFn, ms) {
  let overTimer
  cy.on("mouseout", "node", function(evt) {
    clearTimeout(overTimer)
    if (!(currentNodeSelected == 'none')) {
      cy.elements()
        .difference(currentNodeSelected.outgoers()
          .union(currentNodeSelected.incomers()))
        .not(currentNodeSelected)
        .addClass('unfocused')
      currentNodeSelected.addClass('focused')
        .outgoers()
        .union(currentNodeSelected.incomers())
        .addClass('focused')
    }
    var sel = evt.target
    cy.elements()
      .removeClass('unhighlighted')
    sel.removeClass('highlighted')
      .outgoers()
      .union(sel.incomers())
      .removeClass('highlighted')
    popupFn(evt)
  })
  cy.on("mouseover", "node", function(evt) {
    overTimer = setTimeout(ms)
    let sel = evt.target
    if (currentNodeSelected != sel) {
      cy.elements().removeClass('unfocused')
      cy.elements().removeClass('focused')

      cy.elements()
        .difference(sel.outgoers()
          .union(sel.incomers()))
        .not(sel)
        .addClass('unhighlighted')
      sel.addClass('highlighted')
        .outgoers()
        .union(sel.incomers())
        .addClass('highlighted')
    }
    popupFn(evt)
  })
}

function closeMoviesPopup(popup) {
  document.body.removeChild(popup)
  divPopupEdge = ''
}

function popupAtEdge(edge, cy) {
  if (divPopupEdge) { closeMoviesPopup(divPopupEdge) }

  let moviesIds = cy.$id(edge.id()).data()["movieIds"]

  getMovies(moviesIds)
    .then((moviesList) => {

      let sourceActorId = cy.$id(edge.id()).data()["source"]
      let targetActorId = cy.$id(edge.id()).data()["target"]

      let actorsFirstMovie = moviesList[0].actors
      let sourceActor = actorsFirstMovie.find(actor => { return actor.id == sourceActorId })
      let targetActor = actorsFirstMovie.find(actor => { return actor.id == targetActorId })

      edge.popper({
        content: () => {
          divPopupEdge = document.createElement("div")
          divPopupEdge.id = "movies-popup"
          divPopupEdge.style.width = "700px"
          divPopupEdge.style.height = "500px"

          // Top table : linked actors
          let actorsTable = document.createElement('table')
          actorsTable.setAttribute("id", "table-actors")
          actorsTable.style.width = "100%"
          actorsTable.style.background = "rgb(117,169,249, 0.6)"
          let actorsTopRow = actorsTable.insertRow()
          let actorsCollaborationsRow = actorsTable.insertRow()
          let actorsCloseRow = actorsTable.insertRow()
          let actorsBottomRow = actorsTable.insertRow()

          let leftPicture = actorsTopRow.insertCell()
          leftPicture.rowSpan = 4
          leftPicture.style.width = "100px"
          let topName = actorsTopRow.insertCell()
          let middleCollaborations = actorsCollaborationsRow.insertCell()
          let middleClose = actorsCloseRow.insertCell()
          let bottomName = actorsBottomRow.insertCell()
          let rightPicture = actorsTopRow.insertCell()
          rightPicture.rowSpan = 4
          rightPicture.style.width = "100px"

          topName.style.backgroundColor = "#c0c0c0"
          topName.style.height = "30px"
          topName.style.lineHeight = "0.6"
          topName.style.fontSize = "80%"
          topName.style.paddingLeft = "10px"
          topName.style.textAlign = "left"

          let sourceActorBirthday = sourceActor.birthday.split("-")
          sourceActorBirthday = sourceActorBirthday[2] + "." + sourceActorBirthday[1] + "." + sourceActorBirthday[0]
          let sourceActorText = sourceActor.name + " (" + sourceActorBirthday
          let sourceActorDeathday = sourceActor.deathday
          if (sourceActorDeathday) {
            sourceActorDeathday = sourceActorDeathday.split("-")
            sourceActorDeathday = sourceActorDeathday[2] + "." + sourceActorDeathday[1] + "." + sourceActorDeathday[0]
            sourceActorText += " - " + sourceActorDeathday + ")"
          } else { sourceActorText += ", " + (new Date().getFullYear() - sourceActorBirthday.split(".")[2]) + ")" }
          if (sourceActor.place_of_birth) { sourceActorText += ", " + sourceActor.place_of_birth.split(",").slice(-1).pop() }
          topName.innerHTML = sourceActorText

          bottomName.style.backgroundColor = "#ebebeb"
          bottomName.style.height = "30px"
          bottomName.style.lineHeight = "0.6"
          bottomName.style.fontSize = "80%"
          bottomName.style.paddingRight = "10px"
          bottomName.style.textAlign = "right"
          bottomName.innerHTML = targetActor.name

          let targetActorBirthday = targetActor.birthday.split("-")
          targetActorBirthday = targetActorBirthday[2] + "." + targetActorBirthday[1] + "." + targetActorBirthday[0]
          let targetActorText = targetActor.name + " (" + targetActorBirthday
          let targetActorDeathday = targetActor.deathday
          if (targetActorDeathday) {
            targetActorDeathday = targetActorDeathday.split("-")
            targetActorDeathday = targetActorDeathday[2] + "." + targetActorDeathday[1] + "." + targetActorDeathday[0]
            targetActorText += " - " + targetActorDeathday + ")"
          } else { targetActorText += ", " + (new Date().getFullYear() - targetActorBirthday.split(".")[2]) + ")" }
          if (targetActor.place_of_birth) { targetActorText += ", " + targetActor.place_of_birth.split(",").slice(-1).pop() }
          bottomName.innerHTML = targetActorText

          let sourceActorPicture = document.createElement('img')
          sourceActorPicture.setAttribute("src", "https://image.tmdb.org/t/p/w154/" + sourceActor.profile_path)
          sourceActorPicture.style.height = "150px"
          sourceActorPicture.style.width = "100px"
          sourceActorPicture.style.objectPosition = "center"
          sourceActorPicture.style.verticalAlign = "top"
          sourceActorPicture.style.float = "left"

          let targetActorPicture = document.createElement('img')
          targetActorPicture.setAttribute("src", "https://image.tmdb.org/t/p/w154/" + targetActor.profile_path)
          targetActorPicture.style.height = "150px"
          targetActorPicture.style.width = "100px"
          targetActorPicture.style.objectPosition = "center"
          targetActorPicture.style.verticalAlign = "top"
          targetActorPicture.style.float = "right"

          leftPicture.appendChild(sourceActorPicture)
          rightPicture.appendChild(targetActorPicture)

          middleCollaborations.style.height = "20px"
          middleCollaborations.style.fontSize = "60%"
          middleCollaborations.style.textAlign = "center"
          middleCollaborations.style.fontWeight = "900"
          bottomName.style.lineHeight = "0.2"
          middleCollaborations.style.paddingTop = "0px"
          middleCollaborations.style.paddingBottom = "0px"
          middleCollaborations.innerHTML = moviesList.length + " collaboration(s)"

          middleClose.style.height = "10px"

          // Bottom table : movies in the link
          let moviesTable = document.createElement('table')
          moviesTable.setAttribute("id", "table-movies")
          moviesTable.style.width = "100%"
          moviesTable.style.background = "rgb(249,170,117, 0.6)"
          moviesTable.style.display = "block"
          moviesTable.style.overflowX = "scroll"
          let moviesTopRow = moviesTable.insertRow()
          let moviesBottomRow = moviesTable.insertRow()

          for (movie of moviesList) {
            let customWidth = 700 / moviesList.length
            let currentMovieTop = moviesTopRow.insertCell()
            currentMovieTop.style.textAlign = "center"
            currentMovieTop.style.fontSize = "70%"
            let currentMovieName = document.createTextNode(movie.movie.title + " (" + movie.movie.release_date.split("-")[0] + ")")
            currentMovieTop.appendChild(currentMovieName)

            let currentMovieBottom = moviesBottomRow.insertCell()
            let currentMoviePicture = document.createElement('img')
            currentMoviePicture.setAttribute("src", "https://image.tmdb.org/t/p/w154/" + movie.movie.poster_path)
            currentMoviePicture.style.display = "block"
            currentMoviePicture.style.marginLeft = "auto"
            currentMoviePicture.style.marginRight = "auto"
            currentMovieBottom.appendChild(currentMoviePicture)

            if (moviesList.length < 5) {
              currentMovieTop.style.width = customWidth + "px"
              currentMovieBottom.style.width = customWidth + "px"
            } else {
              currentMovieTop.style.width = 700 / 4 + "px"
              currentMovieBottom.style.width = 700 / 4 + "px"
            }
          }

          // let textTop = document.createTextNode('Furuba')
          divPopupEdge.appendChild(actorsTable)
          divPopupEdge.appendChild(moviesTable)

          document.body.appendChild(divPopupEdge)

          // Close popup button
          let closeButton = document.createElement('button')
          closeButton.innerHTML = "Close"
          closeButton.style.fontSize = "60%"
          closeButton.style.width = "100px"
          closeButton.style.height = "30px"
          closeButton.style.display = "block"
          closeButton.style.margin = "auto"
          closeButton.onclick = function() { closeMoviesPopup(divPopupEdge) }
          middleClose.appendChild(closeButton)

          return divPopupEdge
        },
        popper: {
          removeOnDestroy: true
        },
        renderedPosition: () => ({ x: 400, y: 0 })
      })
    })
}

function popupAtNode(node, type, cy) {
  switch (type) {
    case "mouseover":
      {
        popupNodeInstance = true

        // Actor info
        let mainId = cy.$id(node.id()).data()["id"]
        let mainTmdbId = cy.$id(node.id()).data()["tmdbId"]
        let mainName = cy.$id(node.id()).data()["name"]
        let mainBirthday = cy.$id(node.id()).data()["birthday"]
        let mainDeathday = cy.$id(node.id()).data()["deathday"]
        let mainPlace = cy.$id(node.id()).data()["place_of_birth"]
        let mainBiography = textExtract(cy.$id(node.id()).data()["biography"], 100)
        let mainPicture = cy.$id(node.id()).data()["profile_path"]

        // Friends info
        getFriends(mainTmdbId)
        .then((result) => {
          actorFriends = result.friends
          actorRelations = result.knowsRelations

          let tableRelations = []
          let friendId
          let friendObject
          for (relation of actorRelations) {
            if (relation.source == mainId) {
              friendId = relation.target
              friendObject = actorFriends.find(currentFriend => { return currentFriend.id === friendId })
              tableRelations.push([friendObject.name, relation.movieIds.length])
            } else {
              friendId = relation.source
              friendObject = actorFriends.find(currentFriend => { return currentFriend.id === friendId })
              tableRelations.push([friendObject.name, relation.movieIds.length])
            }
          }

          let sortedTableRelations = tableRelations.sort((a, b) => b[1] - a[1])

          tableFriends = document.getElementById("table-friends")
          if (tableFriends) {
            tableFriends.rows[0].innerHTML = 'Most frequent collaborations out of ' + actorFriends.length

            blue = true
            for (friend of sortedTableRelations.slice(0, 8)) {
              let currentFriend = tableFriends.insertRow()
              if (blue) { currentFriend.style.backgroundColor = "#c0c0c0" } else { currentFriend.style.backgroundColor = "#ebebeb" }
              blue = !blue
              currentFriend.appendChild(document.createTextNode(friend[0] + " (" + friend[1] + ")"))
            }
          }

        }).catch(err => console.error(err))

        node.popper({
          content: () => {
            // Div style
            linebreak = document.createElement("br")
            divPopupNode = document.createElement("div")
            divPopupNode.style.width = "435px"
            divPopupNode.style.height = "233px"
            divPopupNode.style.background = "rgb(117,169,249, 0.8)"

            // Top info (name, age, place)
            mainBirthday = mainBirthday.split("-")
            mainBirthday = mainBirthday[2] + "." + mainBirthday[1] + "." + mainBirthday[0]
            let mainTopInfo = mainName + " (" + mainBirthday
            if (mainDeathday) {
              mainDeathday = mainDeathday.split("-")
              mainDeathday = mainDeathday[2] + "." + mainDeathday[1] + "." + mainDeathday[0]
              mainTopInfo += " - " + mainDeathday + ")"
            } else { mainTopInfo += ", " + (new Date().getFullYear() - mainBirthday.split(".")[2]) + ")" }
            if (mainPlace) { mainTopInfo += ", " + mainPlace.split(",").slice(-1).pop() }
            let textMainTopInfo = document.createTextNode(mainTopInfo)

            // Picture and actors list
            let imgMainPicture = document.createElement("img")
            imgMainPicture.setAttribute("src", "https://image.tmdb.org/t/p/w154/" + mainPicture)
            imgMainPicture.style.height = "200px"
            imgMainPicture.style.width = "auto"

            let textMainBiography = document.createTextNode(mainBiography)

            let spanTopInfo = document.createElement("span")
            spanTopInfo.style.fontSize = "80%"
            spanTopInfo.style.marginLeft = "10px"
            spanTopInfo.style.fontWeight = "900"
            spanTopInfo.appendChild(textMainTopInfo)
            divPopupNode.appendChild(spanTopInfo)

            divPopupNode.appendChild(linebreak)

            let divPopupNodeMainTable = document.createElement('table')
            divPopupNodeMainTable.style.maxHeight = "200px"
            divPopupNodeMainTable.style.display = "block"
            divPopupNodeMainTable.style.overflowY = "hidden"

            let pictureAndFriends = divPopupNodeMainTable.insertRow()
            pictureAndFriends.style.verticalAlign = "top"
            pictureAndFriends.style.fontSize = "70%"

            let picture = pictureAndFriends.insertCell()
            picture.appendChild(imgMainPicture)

            let friends = pictureAndFriends.insertCell()

            let tableFriends = document.createElement('table')
            tableFriends.setAttribute("id", "table-friends")
            tableFriends.style.width = "100%"
            let friendsTitle = tableFriends.insertRow()
            friendsTitle.style.fontSize = "98%"
            friendsTitle.style.fontWeight = "900"
            friendsTitle.appendChild(document.createTextNode('Most frequent collaborations out of (...)'))

            friends.appendChild(tableFriends)

            divPopupNode.appendChild(divPopupNodeMainTable)

            document.body.appendChild(divPopupNode)

            return divPopupNode
          },
          popper: {
            removeOnDestroy: true
          },
          renderedPosition: () => ({ x: 0, y: 0 }),
          renderedDimensions: () => ({ w: 515, h: 10 }),
        })
        break
      }
    case (popupNodeInstance && "mouseout"):
      {
        popupNodeInstance = false
        document.body.removeChild(divPopupNode)
        break
      }
    default:
      {
        console.log("Popups (node) : nothing to do here.")
      }
  }
}