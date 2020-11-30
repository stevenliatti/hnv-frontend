function graphCise(graph) {
  let cy = cytoscape({
    container: document.getElementById('cy')
  })

  cy.json(graph)
  cy.zoom(1)
  cy.center()

  cy.style()
    .selector('node')
    .style('background-color', (ele) => `hsl(${ele.data('knowsCommunity') % 360}, 100%, 50%)`)
    .update()

  console.log(graph)

  popupManagement(cy, (evt) => {
    // console.log('mouseover ' + cy.$id(node.id()).data()['name'])
    // popupPopper(evt, cy);
    popupAtNode(evt.target, evt.type, cy)
  }, 400)
}