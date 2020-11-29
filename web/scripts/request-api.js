// API call to get actors with KNOWS rels as graph(nodes, rels)
function getActors(limitMovie, limitActor, limitActorFriends) {
  return fetch(env.API_BASE_URL + `/actors?limitMovie=${limitMovie}&limitActor=${limitActor}&limitActorFriends=${limitActorFriends}`)
    .then(res => res.json())
}