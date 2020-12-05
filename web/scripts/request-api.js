// API call to get actors with KNOWS rels as graph(nodes, rels)
function getActors(limitMovie, limitActor, limitActorFriends) {
  return fetch(env.API_BASE_URL + `/graph/actors?limitMovie=${limitMovie}&limitActor=${limitActor}&limitActorFriends=${limitActorFriends}`)
    .then(res => res.json())
}

function getFriends(actor) {
  // console.log('getFriends called')
  return fetch(env.API_BASE_URL + `/actor/${actor}`)
    .then(res => res.json())
}

function getFriendsGraph(actor, limitFriends, limitFriendsFriends) {
  // return fetch(env.API_BASE_URL + `/graph/friendsOf/${actor}?friends=${limitFriends}&limitFriendsOfFriendsActor=${limitFriendsFriends}`)
  return fetch(env.API_BASE_URL + `/graph/friendsOf/${actor}`)
    .then(res => res.json())
}

function getMovies(movies) {
  movies = movies.join()
  return fetch(env.API_BASE_URL + `/movies?tmdbIds=${movies}`)
    .then(res => res.json())
}