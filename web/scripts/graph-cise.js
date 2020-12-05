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
    .selector('node')
    .style(
      'background-color',
      (e) => computeHSL(computeHue(e.data('knowsCommunity'), communities), s, l)
    )
    .update()

  // console.log(graph)

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