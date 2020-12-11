let stack = [];

function clearStack() { stack = [] }

function backToPrevious() {
  if (stack.length > 1) {
    let toApply = stack[stack.length - 2];
    stack.pop()
    if (toApply.label == "actor") {
      createSideView(toApply.mNode, toApply.graph)
      stack.pop()
      if (stack.length < 2) { document.getElementById("stack-back").style.display = "none" }
    } else {
      getMovieGraph(toApply.mMovie)
        .then(graph => {
          const movieData = graph.nodes.map(n => n.data).find(n => n.tmdbId == toApply.mMovie);
          createSideViewSearchMovie(movieData, graph, cyCise);
        })
      stack.pop()
      if (stack.length < 2) { document.getElementById("stack-back").style.display = "none" }
    }
  }
}

function actorGraphCose(sideId, sideLink) {
  Promise.all([
      fetch('cy-style-cose.json')
      .then(function(res) {
        return res.json()
      }),
      getFriendsGraph(sideLink, 10, 3)
    ])
    .then(function(dataArray) {
      document.getElementById("side-loading-icon").style.display = "none"
      document.getElementById("side-loading-text").style.display = "none"
      document.getElementById('cy-cose').style.display = "block"

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
        elements: dataArray[1]
      })

      let mainNode
      for (node of cyCose.nodes()) {
        if (node.data('id') == sideId) { mainNode = node }
      }
      mainNode.style({
        'background-color': '#0b65d3',
        'font-size': '20px'
      })

      cyCose.zoom(2)
      cyCose.center()

      cyCose.style()
        .selector('edge')
        .style({
          'width': (e) => e.data('movieIds').length,
          'line-color': (e) => {
              if (e.data('target') == mainNode.data('id')) {
                return '#f9aa75'
              } else if (e.data('source') == mainNode.data('id')) {
                return '#f9aa75'
              } else {
                return '#bbb'
              }
            }
            // (e) => Math.pow(e.data('movieIds').length, 2)
        }).update()

      cyCose.style()
        .selector('node')
        .style({
          'width': (e) => e.data('playInDegree') * 1.4,
          'height': (e) => e.data('playInDegree') * 1.4,
          'text-wrap': "wrap",
          'content': (n) => {
            let arrayName = n.data('name').split(" ")
            let contentName = arrayName.shift() + '\n'
            for (a of arrayName) { contentName += a + " " }
            return contentName
          },
          'background-color': (n) => {
            let linkedEdgeTarget = cyCose.edges().find(e => { return ((e.data('source') == mainNode.data('id')) && (e.data('target') == n.data('id'))) })
            let linkedEdgeSource = cyCose.edges().find(e => { return ((e.data('target') == mainNode.data('id')) && (e.data('source') == n.data('id'))) })
            if (linkedEdgeTarget) {
              if (linkedEdgeTarget.data('source') == mainNode.data('id')) { return '#75a9f9' }
            }
            if (linkedEdgeSource) {
              if (linkedEdgeSource.data('target') == mainNode.data('id')) { return '#75a9f9' }
            }
          }
        }).update()

      popupEdgeManagement(cyCose, (evt) => {
        popupAtEdge(evt.target, cyCose)
      })

      showSideView(cyCose, (evt) => {
        createSideView(evt.target, cyCose)
      })

      // stack.push({ graph: cyCose.json(), label: "actor", mNode: mainNode });
      stack.push({ graph: cyCose, label: "actor", mNode: mainNode });
      if (stack.length > 1) { document.getElementById("stack-back").style.display = "block" }
    })
}

function movieGraphCose(sideId, graph, tmdbId) {
  fetch('cy-style-cose.json')
    .then(function(res) {
      return res.json()
    })
    .then(function(style) {

      document.getElementById("side-loading-icon").style.display = "none"
      document.getElementById("side-loading-text").style.display = "none"
      document.getElementById('cy-cose').style.display = "block"

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
          padding: 10,
          randomize: true,
          componentSpacing: 60,
          // nodeRepulsion: 200000,
          nodeRepulsion: function(node) {
            let repulsion = 500000
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

        style: style,
        elements: graph
      })

      cyCose.style()
        .selector('edge')
        .style({
          'line-color': '#bbb',
        }).update()

      cyCose.on('mouseover', 'edge', evt => {
        let edge = evt.target;
        edge.style({
          'label': edge.data('character')
        });
      });

      cyCose.on('mouseout', 'edge', evt => {
        let edge = evt.target;
        edge.style('label', '');
      });

      cyCose.style()
        .selector('node')
        .style({
          'width': 80,
          'height': 80,
          'text-valign': 'center',
          'text-halign': 'center',
          'text-wrap': 'wrap',
          'content': (n) => {
            let arrayName;
            if (n.data('name')) {
              arrayName = n.data('name').split(' ');
            } else {
              arrayName = n.data('title').split(' ');
            }
            let contentName = arrayName.shift() + '\n';
            for (a of arrayName) { contentName += a + ' ' }
            return contentName;
          },
          'background-color': '#f79767'
        })
        .update()

      for (node of cyCose.nodes()) {
        // actor
        if ('knowsDegree' in node._private.data) {
          node.style({
            'background-color': '#57c7e3',
            'width': 60,
            'height': 60,
          })
        }
        // genre
        else if ('knownForDegree' in node._private.data) {
          node.style({
            'background-color': '#8dcc93',
            'width': 60,
            'height': 60,
          })
        }
        // country
        else if ('iso_3166_1' in node._private.data) {
          node.style({
            'background-color': '#d9c8ae',
            'width': 60,
            'height': 60,
          })
        }
      }

      cyCose.zoom(5)
      cyCose.center()

      stack.push({ graph: cyCose, label: "movie", mMovie: tmdbId });
      if (stack.length > 1) { document.getElementById("stack-back").style.display = "block" }

      showSideView(cyCose, (evt) => {
        if (evt.target.data('gender')) {
          createSideView(evt.target, cyCose)
        }
      })
    })
}