$('.basicAutoSelectSearch').autoComplete({
  resolver: 'custom',
  formatResult: function(item) {
    return {
      value: item.id,
      text: item.name,
      html: [
        item.name, ' ',
        formatLabel(item.label)
      ]
    };
  },
  events: {
    search: function(query, callback) {
      let limitActors = 5;
      let limitMovies = 5;
      searchRequest(query, limitActors, limitMovies, callback);
    }
  }
});

$('.basicAutoSelectSearchPeopleOnly').autoComplete({
  resolver: 'custom',
  formatResult: function(item) {
    return {
      value: item.id,
      text: item.name,
      html: [
        item.name
      ]
    };
  },
  events: {
    search: function(query, callback) {
      let limitActors = 5;
      let limitMovies = 0;
      searchRequest(query, limitActors, limitMovies, callback);
    }
  }
});

function searchRequest(query, limitActors, limitMovies, callback) {
  fetch(env.API_BASE_URL + `/search?criteria=${query}&limitActors=${limitActors}&limitMovies=${limitMovies}`)
    .then(res =>
      res.json().then(json => {
        // console.log(json.res);
        callback(json);
      }))
}

function formatLabel(label) {
  if (label === "Actor") {
    return $("<span>").append(label).css("color", "green").css("float", "right");
  } else {
    return $("<span>").append(label).css("color", "blue").css("float", "right");
  }
}