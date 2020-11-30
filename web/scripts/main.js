getActors(3, 5, 2)
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

$(document).ready(() => {
  $('#sidebarCollapse').on('click', () => {
    $('#sidebar').toggleClass('active');
    $(this).toggleClass('active');
  });
});