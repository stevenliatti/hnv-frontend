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
    clearTimeout(overTimer)
  })
  cy.on('mouseover', 'node', function (evt) {
    overTimer = setTimeout(() => { popupFn(evt) }, ms)
  })
}

// Convert HSL color to hex value, thanks to https://stackoverflow.com/a/44134328
function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
    .style('background-color', (ele) => hslToHex(ele.data('knowsCommunity') % 360, 100, 50))
    .update()

  console.log(graph)

  popupManagement(cy, (evt) => {
    let node = evt.target
    console.log('mouseover ' + cy.$id(node.id()).data()['name'])
  }, 1000)

})
  .catch(err => console.error(err))
