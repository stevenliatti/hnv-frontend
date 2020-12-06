function graphCose(sideId, callBackData) {
  Promise.all([
      fetch('cy-style-cose.json')
      .then(function(res) {
        return res.json()
      }),
      callBackData
    ])
    .then(function(dataArray) {

      let dataActors = dataArray[1].elements.nodes.map((dataActor) => { return { data: dataActor.data } })

      let centerActor = dataActors.find(actor => { return actor.data.id == sideId })

      document.getElementById("side-loading-icon").style.display = "none"
      document.getElementById("side-loading-text").style.display = "none"
      document.getElementById('cy-cose').style.display = "block"

      //   let cyCose = cytoscape({
      //     container: document.getElementById('cy-cose')
      //   })

      //   cyCose.json(dataArray[1])
      //   cyCose.zoom(1)
      //   cyCose.center()

      //   cyCose.style()
      //     .selector('node')
      //     .style('background-color', (ele) => `hsl(${ele.data('knowsCommunity') % 360}, 100%, 50%)`)
      //     .update()

      let cyCose = cytoscape({
        container: document.getElementById('cy-cose'),

        minZoom: 0.5,
        maxZoom: 2,

        layout: {
          name: 'cose',
          // idealEdgeLength: 100,
          idealEdgeLength: function(edge) {
            let edgeLength = 100
            if ((edge.data.source == sideId) || (edge.data.target == sideId)) { edgeLength = 10000 }
            return edgeLength
          },
          nodeOverlap: 20,
          refresh: 20,
          fit: true,
          padding: 30,
          randomize: true,
          componentSpacing: 100,
          // nodeRepulsion: 200000,
          nodeRepulsion: function(node) {
            let repulsion = 700000
            if (node.id == sideId) { repulsion = 10 }
            return repulsion
          },
          edgeElasticity: 100,
          nestingFactor: 1,
          gravity: 80,
          numIter: 1000,
          initialTemp: 200,
          coolingFactor: 0.95,
          minTemp: 1.0
        },

        style: dataArray[0],
        elements: dataArray[1].elements // with api-cache
      })

      let mainNode
      for (node of cyCose.nodes()) {
        if (node._private.data.id == sideId) { mainNode = node }
      }
      mainNode.style('background-color', 'red')

      cyCose.zoom(2)
      cyCose.center()

      cyCose.style()
        .selector('edge')
        .style(
          'width',
          (e) => e.data('movieIds').length
          // (e) => Math.pow(e.data('movieIds').length, 2)
        ).update()

      cyCose.style()
        .selector('edge')
        .style(
          'line-color',
          '#75a9f9'
        ).update()

      let arrayName
      let contentName
      cyCose.style()
        .selector('node')
        .style({
          'width': (e) => e.data('playInDegree'),
          'height': (e) => e.data('playInDegree'),
          'text-wrap': "wrap",
          'content': (d) => {
            arrayName = d.data('name').split(" ")
            contentName = arrayName.shift() + '\n' + arrayName
            return contentName
          }
        }).update()

      // cyCose.json(dataArray[1])

      popupEdgeManagement(cyCose, (evt) => {
        popupAtEdge(evt.target, cyCose)
      })
    })
    //   let cyCose = cytoscape({
    //     container: document.getElementById('cy-cose')
    //   })

  //   cyCose.json(graph)
  //   cyCose.zoom(1)
  //   cyCose.center()
}