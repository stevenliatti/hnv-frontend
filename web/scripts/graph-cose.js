function graphCose(sideID) {
  Promise.all([
      fetch('cy-style-cose.json')
      .then(function(res) {
        return res.json()
      }),
      getFriendsGraph(sideID)
    ])
    .then(function(dataArray) {
      console.log(dataArray[1])

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

        layout: {
          name: 'cose',
          idealEdgeLength: 100,
          nodeOverlap: 20,
          refresh: 20,
          fit: true,
          padding: 30,
          randomize: true,
          componentSpacing: 100,
          nodeRepulsion: 400000,
          edgeElasticity: 100,
          nestingFactor: 5,
          gravity: 80,
          numIter: 1000,
          initialTemp: 200,
          coolingFactor: 0.95,
          minTemp: 1.0
        },

        style: dataArray[0],
        elements: dataArray[1].elements //.elements
      });

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

      cyCose.style()
        .selector('node')
        .style(
          'width',
          (e) => e.data('playInDegree')
        ).update()

      cyCose.style()
        .selector('node')
        .style(
          'height',
          (e) => e.data('playInDegree')
        ).update()
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