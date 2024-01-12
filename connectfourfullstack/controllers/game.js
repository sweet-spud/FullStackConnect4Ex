const gameRouter = require("express").Router();
const Game = require("../models/game");
const cache = require("../cache/gameplay");

gameRouter.get("/logic/:id", (request, response, next) => {
  Game.findById(request.params.id)
    .then((game) => {
      if (game) {
        console.log(cache.getGame(game.id));
        response.json(cache.getGame(game.id));
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

gameRouter.post("/logic/:id", (request, response, next) => {
  console.log("post");
  const body = request.body;
  Game.findById(request.params.id)
    .then((game) => {
      console.log("post game    " + game);
      if (game) {
        if (cache.setGame(game.id, body)) {
          console.log("post   " + body);
          response.json(body);
        } else {
          response.status(500).end();
        }
      }
    })
    .catch((error) => next(error));
});

gameRouter.delete("/logic/:id", (request, response, next) => {
  Game.findById(request.params.id)
    .then((game) => {
      if (game) {
        if (cache.deleteGame(game.id) != 0) {
          response.status(204).end();
        }
        response.status(500).end();
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

gameRouter.delete("/logic", () => {
  if (!cache.flush()) {
    response.status(500).end();
  }
});

gameRouter.get("/", (request, response) => {
  Game.find({}).then((games) => {
    response.json(games);
  });
});

gameRouter.get("/:id", (request, response, next) => {
  Game.findById(request.params.id)
    .then((game) => {
      if (game) {
        response.json(game);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

gameRouter.post("/", (request, response, next) => {
  const body = request.body;
  const game = new Game({
    player1Id: body.player1Id,
    player2Id: body.player2Id,
    yellow1: body.yellow1,
    searching: body.searching,
  });
  game
    .save()
    .then((savedGame) => {
      response.json(savedGame);
    })
    .catch((error) => next(error));
});

gameRouter.put("/:id", (request, response, next) => {
  const body = request.body;
  const game = {
    player1Id: body.player1Id,
    player2Id: body.player2Id,
    yellow1: body.yellow1,
    searching: body.searching,
  };
  Game.findByIdAndUpdate(request.params.id, game, { new: true })
    .then((updatedGame) => {
      response.json(updatedGame);
    })
    .catch((error) => next(error));
});

gameRouter.delete("/:id", (request, response, next) => {
  Game.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

module.exports = gameRouter;
