let dummyFriends = ['Tohru', 'Yuki', 'Kyo', 'Arisa', 'Saki']

let popupInstance = false
let divPopup
  // let divPopupName
  // let divPopupDescription

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
    popupFn(evt)
  })
  cy.on("mouseover", "node", function(evt) {
    overTimer = setTimeout(ms)
    popupFn(evt)
  })
}

function popupAtEdge(edge, cy) {
  console.log("Clicked on a edge")

  let moviesIds = cy.$id(edge.id()).data()["movieIds"]
  console.log(moviesIds)

  getMovies(moviesIds)
    .then((result) => {
      console.log(result)
    })
}

function popupAtNode(node, type, cy) {
  switch (type) {
    case "mouseover":
      {
        // console.log("Create popup")
        popupInstance = true

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
            divPopup = document.createElement("div")
            divPopup.style.width = "500px"
            divPopup.style.background = "rgb(117,169,249, 0.8)"

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
            divPopup.appendChild(spanTopInfo)

            divPopup.appendChild(linebreak)

            let divPopupMainTable = document.createElement('table')
            divPopupMainTable.style.maxHeight = "200px"
            divPopupMainTable.style.display = "block"
            divPopupMainTable.style.overflowY = "hidden"

            let pictureAndFriends = divPopupMainTable.insertRow()
            pictureAndFriends.style.verticalAlign = "top"
            pictureAndFriends.style.fontSize = "70%"

            let picture = pictureAndFriends.insertCell()
            picture.appendChild(imgMainPicture)

            let friends = pictureAndFriends.insertCell()

            let tableFriends = document.createElement('table')
            tableFriends.setAttribute("id", "table-friends")
            tableFriends.style.width = "100%"
            let friendsTitle = tableFriends.insertRow()
            friendsTitle.style.fontWeight = "900"
            friendsTitle.appendChild(document.createTextNode('Most frequent collaborations out of (...)'))

            friends.appendChild(tableFriends)

            divPopup.appendChild(divPopupMainTable)

            document.body.appendChild(divPopup)

            return divPopup
          },
          popper: {
            removeOnDestroy: true
          },
          renderedPosition: () => ({ x: 0, y: 0 }),
          renderedDimensions: () => ({ w: 515, h: 10 }),
        })
        break
      }
    case (popupInstance && "mouseout"):
      {
        popupInstance = false
        document.body.removeChild(divPopup)
        break
      }
    default:
      {
        console.log("Popups (node) : nothing to do here.")
      }
  }
}