function computeHue(community, communities) {
  const step = Math.round(200 / communities.length)
  return communities.indexOf(community) * step + 120
}

function computeHSL(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`
}

function graphCise(graph) {
  document.getElementById("main-loading").style.display = "none"
  document.getElementById('cy-cise').style.display = "block"

  let cyCise = cytoscape({
    container: document.getElementById('cy-cise')
  })

  cyCise.json(graph)
  cyCise.zoom(1)
  cyCise.center()

  const communities = Array.from(
    new Set(graph.elements.nodes.map(n => n.data.knowsCommunity))
  )
  const s = 60
  const l = 70

  cyCise.style()
    .selector('edge')
    .style({
      "curve-style": "unbundled-bezier",
      'width': (e) => Math.pow(e.data('movieIds').length, 1.2)
    }).update()

  cyCise.style()
    .selector('node')
    .style({
      'background-color': (e) => computeHSL(computeHue(e.data('knowsCommunity'), communities), s, l),
      "text-valign": "center",
      "text-halign": "center",
      'text-wrap': "wrap",
      'content': (d) => {
        arrayName = d.data('name').split(" ")
        contentName = arrayName.shift() + '\n' + arrayName
        return contentName
      }
    })
    .update()

  cyCise.style()
    .selector('node:selected')
    .style({
      'border-color': '#ff6600',
      'border-width': '20px',
      'border-opacitiy': '0.9'
    }).update()

  cyCise.style()
    .selector('edge.highlighted')
    .style({
      "line-color": "#ff00ff",
      "opacity": "0.8"
    }).update()

  cyCise.style()
    .selector('edge.unhighlighted')
    .style({
      "line-color": "#c0c0c0",
      "opacity": "0.1"
    }).update()

  cyCise.style()
    .selector('edge.focused')
    .style({
      "line-color": "#ff6600",
      "opacity": "0.8"
    }).update()

  cyCise.style()
    .selector('edge.unfocused')
    .style({
      "line-color": "#c0c0c0",
      "opacity": "0.1"
    }).update()

  popupNodeManagement(cyCise, (evt) => {
    popupAtNode(evt.target, evt.type, cyCise)
  }, 400)

  showSideView(cyCise, (evt) => {
    createSideView(evt.target, cyCise)
  })

  hideSideView(cyCise, (evt) => {
    closeSideView(evt.target, cyCise)
  })
}