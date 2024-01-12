const NodeCache = require("node-cache");
const cache = new NodeCache();

const setGame = (id, game) => {
  return cache.set(id, game);
};

const getGame = (id) => {
  return cache.get(id);
};

const deleteGame = (id) => {
  return cache.del(id);
};

const flush = () => {
  return cache.flushAll();
};

module.exports = { setGame, getGame, deleteGame, flush };
