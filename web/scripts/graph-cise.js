function computeHue(community, communities) {
  const step = Math.round(200 / communities.length)
  return communities.indexOf(community) * step + 120
}

function computeHSL(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`
}

function graphCise(graph) {
  fetch('cy-style-cise.json')
    .then(function(res) {
      return res.json()
    }).then(style => {
      document.getElementById("main-loading").style.display = "none"
      document.getElementById('cy-cise').style.display = "block"

      let cyCise = cytoscape({
        container: document.getElementById('cy-cise'),
        style: style,
        elements: graph,
        layout: {
          name: 'cise',
          clusters: function(node) {
            return node.data('knowsCommunity')
          },
          animate: false,
          refresh: 10,
          animationDuration: undefined,
          animationEasing: undefined,
          fit: true,
          padding: 100,
          nodeSeparation: 2,
          idealInterClusterEdgeLengthCoefficient: 4,
          allowNodesInsideCircle: false,
          maxRatioOfNodesInsideCircle: 0.1,
          springCoeff: 0.45,
          nodeRepulsion: 4500,
          gravity: 0.25,
          gravityRange: 3.8,
          ready: function() {}, // on layoutready
          stop: function() {}, // on layoutstop
        }
      })

      // cyCise.json(graph)
      cyCise.zoom(1)
      cyCise.center()

      const communities = Array.from(
        // new Set(graph.elements.nodes.map(n => n.data.knowsCommunity))
        new Set(graph.nodes.map(n => n.data.knowsCommunity))
      )
      const s = 60
      const l = 70

      cyCise.style()
        .selector('edge')
        .style({
          "curve-style": "unbundled-bezier",
          'width': (e) => Math.pow(e.data('movieIds').length, 1.2)
        }).update()

      let source
      let target
      cyCise.style()
        .selector('edge')
        .style({
          'line-color': (e) => {
            source = graph.nodes.find(node => { return node.data.id == e._private.data.target })
            target = graph.nodes.find(node => { return node.data.id == e._private.data.source })
            if (source.data.knowsCommunity == target.data.knowsCommunity) {
              return computeHSL(computeHue(source.data.knowsCommunity, communities), s, l)
            } else { return '#bbb' }
          },
          'opacity': (e) => {
            source = graph.nodes.find(node => { return node.data.id == e._private.data.target })
            target = graph.nodes.find(node => { return node.data.id == e._private.data.source })
            if (source.data.knowsCommunity == target.data.knowsCommunity) {
              return '0.7'
            } else { return '0.4' }
          }
        }).update

      cyCise.style()
        .selector('node')
        .style({
          'background-color': (n) => computeHSL(computeHue(n.data('knowsCommunity'), communities), s, l),
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

      popupNodeManagement(cyCise, (evt) => {
        popupAtNode(evt.target, evt.type, cyCise)
      }, 400)

      showSideView(cyCise, (evt) => {
        createSideView(evt.target, cyCise)
      })

      hideSideView(cyCise, (evt) => {
        closeSideView(evt.target, cyCise)
      })

    })

}