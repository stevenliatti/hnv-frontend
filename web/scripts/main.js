
// API call to get actors with KNWOS rels as graph(nodes, rels)
function getActors(limitMovie, limitActor, limitActorFriends) {
  return fetch(env.API_BASE_URL + `/actors?limitMovie=${limitMovie}&limitActor=${limitActor}&limitActorFriends=${limitActorFriends}`)
    .then(res => res.json())
}

// Node mouseover / mouseout management, to show popup with more infos
function popupManagement(cy, popupFn, ms) {
  let overTimer
  cy.on('mouseout', 'node', function () {
    console.log('clearTimeout')
    unshowPopup();
    clearTimeout(overTimer)
  })
  cy.on('mouseover', 'node', function (evt) {
    overTimer = setTimeout(() => { popupFn(evt) }, ms)
  })
}

Promise.all([
  fetch('cy-style.json').then(res => res.json()),
  getActors(5, 5, 5)
]).then(data => {
  let style = data[0]
  let graph = data[1]

  let cy = cytoscape({
    container: document.getElementById('cy'),
    minZoom: 0.1,
    maxZoom: 10,
    style: style,
    elements: graph,
    layout: {
      name: 'cise',
      clusters: function (node) {
        return node.data('knowsCommunity')
      },

      // -------- Optional parameters --------
      // Whether to animate the layout
      // - true : Animate while the layout is running
      // - false : Just show the end result
      // - 'end' : Animate directly to the end result
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
      padding: 100,

      // separation amount between nodes in a cluster
      // note: increasing this amount will also increase the simulation time 
      nodeSeparation: 2,

      // Inter-cluster edge length factor 
      // (2.0 means inter-cluster edges should be twice as long as intra-cluster edges)
      idealInterClusterEdgeLengthCoefficient: 3,

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
    }
  })

  cy.style()
    .selector('node')
    .style('background-color', (ele) => `hsl(${ele.data('knowsCommunity') % 360}, 100%, 50%)`)
    .update()

  console.log(graph)

  popupManagement(cy, (evt) => {
    let node = evt.target
    // console.log('mouseover ' + cy.$id(node.id()).data()['name'])
    showPopupAtNode(evt, cy);
  }, 400)

})
  .catch(err => console.error(err))


function showPopupAtNode(evt, cy) {
  let node = evt.target
  let name = cy.$id(node.id()).data()['name'];

  node.qtip({
    content: name,
    show: {
       event: evt.type,
       ready: true
    },
    hide: {
       event: 'mouseout unfocus'
    }
  }, evt);
}

$(document).ready(function () {
  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
    $(this).toggleClass('active');
  });
});
