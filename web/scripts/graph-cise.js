function computeHue(community, communities) {
  const step = Math.round(200 / communities.length)
  return communities.indexOf(community) * step + 120
}

function computeHSL(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`
}

function graphCise(graph) {
  let cy = cytoscape({
    container: document.getElementById('cy')
  })

  cy.json(graph)
  cy.zoom(1)
  cy.center()

  const communities = Array.from(
    new Set(graph.elements.nodes.map(n => n.data.knowsCommunity))
  )
  const s = 60
  const l = 70

  cy.style()
    .selector('node')
    .style(
      'background-color',
      (e) => computeHSL(computeHue(e.data('knowsCommunity'), communities), s, l)
    )
    .update()

  console.log(graph)

  popupManagement(cy, (evt) => {
    // console.log('mouseover ' + cy.$id(node.id()).data()['name'])
    // popupPopper(evt, cy);
    popupAtNode(evt.target, evt.type, cy)
  }, 400)
}