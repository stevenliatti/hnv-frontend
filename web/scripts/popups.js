let popupInstance = false
let divPopup
  // let divPopupName
  // let divPopupDescription

// Node mouseover / mouseout management, to show popup with more infos
function popupManagement(cy, popupFn, ms) {
  let overTimer
  cy.on("mouseout", "node", function(evt) {
    // console.log("clearTimeout")
    clearTimeout(overTimer)
    popupFn(evt)
  })
  cy.on("mouseover", "node", function(evt) {
    overTimer = setTimeout(ms)
    popupFn(evt)
  })
}

function showPopupAtNode(evt, cy) {
  let node = evt.target
  let name = cy.$id(node.id()).data()["name"]

  node.qtip({
    content: name,
    show: {
      event: evt.type,
      ready: true
    },
    hide: {
      event: "mouseout unfocus"
    }
  }, evt);
}

function popupAtNode(node, type, cy) {

  switch (type) {
    case "mouseover":
      {
        // console.log("Create popup")
        popupInstance = true

        node.popper({
          content: () => {
            linebreak = document.createElement("br")
            divPopup = document.createElement("div")
            divPopup.style.width = "500px"
            divPopup.style.background = "rgb(117,169,249, 0.8)"

            let divPopupMainName = document.createTextNode(cy.$id(node.id()).data()["name"])
            let divPopupMainDescription = document.createTextNode(textExtract(cy.$id(node.id()).data()["biography"], 100))

            let divPopupMainPicture = document.createElement("img")
            divPopupMainPicture.setAttribute("src", "https://image.tmdb.org/t/p/w154/" + cy.$id(node.id()).data()["profile_path"])

            let divPopupMainTable = document.createElement('table')
            let pictureAndDescription = divPopupMainTable.insertRow()

            let picture = pictureAndDescription.insertCell()
            picture.appendChild(divPopupMainPicture)
            let description = pictureAndDescription.insertCell()
            description.appendChild(divPopupMainDescription)
              // divPopup.innerHTML = cy.$id(node.id()).data()["name"]

            divPopup.appendChild(divPopupMainName)
            divPopup.appendChild(linebreak)
            divPopup.appendChild(divPopupMainTable)
              // divPopup.appendChild(divPopupMainPicture)
              // divPopup.appendChild(divPopupMainDescription)

            document.body.appendChild(divPopup)

            return divPopup
          },
          popper: {
            removeOnDestroy: true
          }
        })
        break
      }
    case (popupInstance && "mouseout"):
      {
        // console.log("Destroy popup")
        popupInstance = false

        document.body.removeChild(divPopup)
        break
      }
    default:
      {
        console.log("Popups: nothing to do here.")
      }
  }


}