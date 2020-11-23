let actorsDiv = document.getElementById("actors")

function getActors(limitMovie, limitActor, limitActorFriends) {
  return fetch(env.API_BASE_URL + `/actors?limitMovie=${limitMovie}&limitActor=${limitActor}&limitActorFriends=${limitActorFriends}`)
    .then(res => res.json())
}

// let actors = getActors(1, 1, 1)
//   .then(graph => {
//     console.log(graph)
//     graph.nodes.forEach(node => {
//       const actor = node.data

//       let link = document.createElement("a")
//       link.href = "https://www.themoviedb.org/person/" + actor.tmdbId
//       link.target = "_blank"
//       link.innerText = actor.name

//       let image = document.createElement("img")
//       image.src = "https://image.tmdb.org/t/p/w154/" + actor.profile_path
//       image.alt = actor.name

//       let p = document.createElement("p")

//       p.appendChild(image)
//       p.appendChild(link)

//       actorsDiv.appendChild(p)
//     });
//   })
//   .catch(err => console.error(err))

Promise.all([
  fetch('cy-style.json').then(res => res.json()),
  getActors(5, 5, 5)
]).then(data => {
  let style = data[0]
  let graph = data[1]

  var cy = window.cy = cytoscape({
    container: document.getElementById('cy'),

    layout: {
      name: 'cise',
      clusters: function (node) {
        return node.data('knowsCommunity')
      },
      animate: false,

      // number of ticks per frame; higher is faster but more jerky
      refresh: 10,

      // Animation duration used for animate:'end'
      animationDuration: undefined,

      // Easing for animate:'end'
      animationEasing: undefined,

      // Whether to fit the viewport to the repositioned graph
      // true : Fits at end of layout for animate:false or animate:'end'
      fit: true,

      // Padding in rendered co-ordinates around the layout
      padding: 300,

      // separation amount between nodes in a cluster
      // note: increasing this amount will also increase the simulation time 
      nodeSeparation: 2,

      // Inter-cluster edge length factor 
      // (2.0 means inter-cluster edges should be twice as long as intra-cluster edges)
      idealInterClusterEdgeLengthCoefficient: 1.4,

      // Whether to pull on-circle nodes inside of the circle
      allowNodesInsideCircle: false,

      // Max percentage of the nodes in a circle that can move inside the circle
      maxRatioOfNodesInsideCircle: 0.1,

      // - Lower values give looser springs
      // - Higher values give tighter springs
      springCoeff: 0.45,

      // Node repulsion (non overlapping) multiplier
      nodeRepulsion: 4500,

      // Gravity force (constant)
      gravity: 0.25,

      // Gravity range (constant)
      gravityRange: 3.8,

      // Layout event callbacks; equivalent to `layout.one('layoutready', callback)` for example
      ready: function () { }, // on layoutready
      stop: function () { }, // on layoutstop
    },

    style: style,

    elements: graph

  })
  console.log(graph)

  // cy.layout.run()
})
  .catch(err => console.error(err))
