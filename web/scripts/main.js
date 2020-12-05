getActors(10, 5, 5)
  .then((result) => {
    graph = result
    loadingSlideshow(graph)
  })
  .then(() => {
    setTimeout(() => {
      graphCise(graph)
    }, 300)
  })
  .catch(err => console.error(err))