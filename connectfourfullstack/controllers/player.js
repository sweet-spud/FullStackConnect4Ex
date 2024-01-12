const playerRouter = require("express").Router();
const Player = require("../models/player");

playerRouter.get("/players", (request, response) => {
  Player.find({}).then((players) => {
    response.json(players);
  });
});

playerRouter.get("/players/:id", (request, response, next) => {
  Player.findById(request.params.id)
    .then((player) => {
      if (player) {
        response.json(player);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

playerRouter.post("/players", (request, response, next) => {
  const user = request.body;
  const player = new Player({
    username: user.username,
    matchmaking: user.matchmaking,
    date: user.date,
  });
  player
    .save()
    .then((savedPlayer) => {
      response.json(savedPlayer);
    })
    .catch((error) => next(error));
});

playerRouter.delete("/players/:id", (request, response, next) => {
  Player.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

playerRouter.put("/players/:id", (request, response, next) => {
  const user = request.body;
  const player = {
    username: user.username,
    matchmaking: user.matchmaking,
    date: user.date,
  };
  Player.findByIdAndUpdate(request.params.id, player, { new: true })
    .then((updatedPlayer) => {
      response.json(updatedPlayer);
    })
    .catch((error) => next(error));
});

module.exports = playerRouter;
