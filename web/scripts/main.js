getActors(3, 5, 2)
  .then(function(result) {
    graph = result

    loadingSlideshow(graph)
    return new Promise((resolve, reject) => {
      resolve(fetch('cy-style.json').then(res => res.json()))
    })
  })
  .then(function(result) {
    // console.log(result)
    setTimeout(() => {
      graphCise(result, graph)
    }, 300)

    //
  })
  .catch(err => console.error(err))

// Promise.all([
//     fetch('cy-style.json').then(res => res.json()),
//     getActors(5, 5, 5)
//   ])
//   .then(data => {
//     graph = data[1]
//     loadingSlideshow(graph)
//     return data
//   })
//   .then(data => {
//     let j = 0
//     for (i = 0; i < 400000000; i++) {
//       j += i
//     }
//     console.log("Hello")
//       // graphCise(data)
//   })
//   .catch(err => console.error(err))

$(document).ready(function() {
  $('#sidebarCollapse').on('click', function() {
    $('#sidebar').toggleClass('active');
    $(this).toggleClass('active');
  });
});