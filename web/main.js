let actorsDiv = document.getElementById("actors")

fetch(env.API_BASE_URL + "/actors?limitMovie=2&limitActor=1&limitActorFriends=1")
  .then(res => res.json())
  .then(graph => {
    console.log(graph)
    graph.nodes.forEach(node => {
      const actor = node.data

      let link = document.createElement("a")
      link.href = "https://www.themoviedb.org/person/" + actor.tmdbId
      link.target = "_blank"
      link.innerText = actor.name

      let image = document.createElement("img")
      image.src = "https://image.tmdb.org/t/p/w154/" + actor.profile_path
      image.alt = actor.name

      let p = document.createElement("p")

      p.appendChild(image)
      p.appendChild(link)

      actorsDiv.appendChild(p)
    });
  })
  .catch(err => console.error(err))