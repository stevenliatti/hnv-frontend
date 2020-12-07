// API call to get actors with KNOWS rels as graph(nodes, rels)
async function getActorsGraph(limitMovie, limitActor, limitActorFriends) {
  const res = await fetch(env.API_BASE_URL + `/graph/actors?limitMovie=${limitMovie}&limitActor=${limitActor}&limitActorFriends=${limitActorFriends}`)
  return await res.json()
}

async function getActor(actorId) {
  const res = await fetch(env.API_BASE_URL + `/actor/${actorId}`)
  return await res.json()
}

async function getFriendsGraph(actor, limitFriends, limitFriendsFriends) {
  const res = await fetch(env.API_BASE_URL + `/graph/friendsOf/${actor}?friends=${limitFriends}&friendsOfFriends=${limitFriendsFriends}`)
  return await res.json()
}

async function getMovies(movies) {
  const res = await fetch(env.API_BASE_URL + `/movies?tmdbIds=${movies}`)
  return await res.json()
}

async function getMovieGraph(movieId) {
  const res = await fetch(env.API_BASE_URL + `/graph/movie/${movieId}`)
  return await res.json()
}