# HNV frontend

Frontend of [Hollywood Network Visualizer](https://github.com/stevenliatti/hollywood-network-visualizer). Use of [Cytoscape.js](https://js.cytoscape.org/) to show graphs of actors and movies with data from [TMDb](https://www.themoviedb.org/).

Use [hnv-cytoscape-backend](https://github.com/stevenliatti/hnv-cytoscape-backend) as backend.

You have to deploy cytoscape-backend first, and next create a `.env` file like this :

```conf
API_BASE_URL=http://localhost:3000/api-cache
```

Finally, you can `make init run` to open Firefox and show the app ;-)
