Promise.all([
  fetch('furuba-cy-style.json')
    .then(function (res) {
      return res.json()
    }),

  fetch(env.API_URL + "?limitMovie=20&limitActor=20&limitActorFriends=10")
  //fetch("furuba3.json", {mode: 'no-cors'})
    .then(function (res) {
      return res.json()
    })
])
  .then(function (dataArray) {
    var cy = window.cy = cytoscape({
      container: document.getElementById('cy'),

      layout: {
        name: 'cose',
        idealEdgeLength: 300,
        nodeOverlap: 40,
        refresh: 20,
        fit: true,
        padding: 30,
        randomize: true,
        componentSpacing: 400,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 2,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.99,
        minTemp: 1.0
      },

      style: dataArray[0],

      elements: dataArray[1]

    });
  })
  .catch(err => console.error(err));