function reloadMain() {
  document.getElementById('cy-cise').style.display = "none";
  document.getElementById("main-loading").style.display = "block";
  const limitMovie = document.getElementById('input-sliderNbMovies').value;
  const limitActor = document.getElementById('input-sliderNbActors').value;
  const limitActorFriends = document.getElementById('input-sliderNbFriends').value;

  getActors(limitMovie, limitActor, limitActorFriends)
    .then(result => {
      graph = result;
      graphCise(graph);
    })
    .catch(err => console.error(err))
}

function main() {
  const limitMovie = 10;
  const limitActor = 5;
  const limitActorFriends = 5;

  document.getElementById('input-sliderNbMovies').value = limitMovie;
  document.getElementById('input-sliderNbActors').value = limitActor;
  document.getElementById('input-sliderNbFriends').value = limitActorFriends;
  document.getElementById('sliderNbMovies').value = limitMovie;
  document.getElementById('sliderNbActors').value = limitActor;
  document.getElementById('sliderNbFriends').value = limitActorFriends;

  getActors(limitMovie, limitActor, limitActorFriends)
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
}

main();
