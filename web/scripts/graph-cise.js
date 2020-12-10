function computeHue(community, communities) {
  const step = Math.round(200 / communities.length)
  return communities.indexOf(community) * step + 120
}

function computeHSL(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`
}

function graphCise(graph, origin) {
  if (origin == 'main') {
    // console.log(origin)
    document.getElementById("main-loading").style.display = "none"
    document.getElementById('cy-cise').style.display = "block"
    document.getElementById('cy-cise').setAttribute("style", "width: 80%; height: 85%; float: left;")
  }

  cyCise = cytoscape({
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

  let source
  let target
  cyCise.style()
    .selector('edge')
    .style({
      "curve-style": "unbundled-bezier",
      'width': (e) => Math.pow(e.data('movieIds').length, 1.2),
      'line-color': (e) => {
        source = graph.elements.nodes.find(node => { return node.data.id == e.data('target') })
        target = graph.elements.nodes.find(node => { return node.data.id == e.data('source') })
        if (source.data.knowsCommunity == target.data.knowsCommunity) {
          return computeHSL(computeHue(source.data.knowsCommunity, communities), 70, 70)
        } else { return '#bbb' }
      },
      'opacity': (e) => {
        source = graph.elements.nodes.find(node => { return node.data.id == e.data('target') })
        target = graph.elements.nodes.find(node => { return node.data.id == e.data('source') })
        if (source.data.knowsCommunity == target.data.knowsCommunity) {
          return '0.7'
        } else { return '0.4' }
      }
    }).update

  cyCise.style()
    .selector('node')
    .style({
      'background-color': (n) => computeHSL(computeHue(n.data('knowsCommunity'), communities), 40, 60),
      "text-valign": "center",
      "text-halign": "center",
      'text-wrap': "wrap",
      'content': (n) => {
        arrayName = n.data('name').split(" ")
        contentName = arrayName.shift() + '\n'
        for (a of arrayName) { contentName += a + " " }
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

  popupEdgeManagement(cyCise, (evt) => {
    popupAtEdge(evt.target, cyCise)
  })

  popupNodeManagement(cyCise, (evt) => {
    popupAtNode(evt.target, evt.type, cyCise)
  }, 400)

  showSideView(cyCise, (evt) => {
    createSideView(evt.target, cyCise)
  })

  hideSideView(cyCise, (evt) => {
    closeSideView(cyCise)
  })
}