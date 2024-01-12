import axios from "axios";
const baseUrl = "/api";

const getLogic = (id) => {
  const request = axios.get(`${baseUrl}/games/logic/${id}`);
  return request.then((response) => response.data);
};
const updateLogic = (id, newL) => {
  const request = axios.post(`${baseUrl}/games/logic/${id}`, newL);
  return request.then((response) => response.data);
};
const deleteLogic = (id) => {
  const request = axios.delete(`${baseUrl}/games/logic/${id}`);
  return request.then((response) => response.data);
};
const deleteAllLogic = () => {
  const request = axios.delete(`${baseUrl}/games/logic`);
  return request.then((response) => response.data);
};

const getAllPlayers = () => {
  const request = axios.get(`${baseUrl}/players`);
  console.log(`${baseUrl}/players`);
  return request.then((response) => response.data);
};

const getPlayer = (id) => {
  const request = axios.get(`${baseUrl}/players/${id}`);
  return request.then((response) => response.data);
};

const createPlayer = (newPlayer) => {
  const request = axios.post(`${baseUrl}/players`, newPlayer);
  return request.then((response) => response.data);
};

const updatePlayer = (id, newPlayer) => {
  const request = axios.put(`${baseUrl}/players/${id}`, newPlayer);
  return request.then((response) => response.data);
};

const getAllGames = () => {
  const request = axios.get(`${baseUrl}/games`);
  return request.then((response) => response.data);
};

const getGame = (id) => {
  const request = axios.get(`${baseUrl}/games/${id}`);
  return request.then((response) => response.data);
};

const createGame = (newGame) => {
  const request = axios.post(`${baseUrl}/games`, newGame);
  console.log(`${baseUrl}/games`);
  return request.then((response) => response.data);
};

const deleteGame = (id) => {
  const request = axios.delete(`${baseUrl}/games/${id}`);
  return request.then((response) => response.data);
};

const updateGame = (id, game) => {
  const request = axios.put(`${baseUrl}/games/${id}`, game);
  return request.then((response) => response.data);
};

export default {
  getAllPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  getAllGames,
  getGame,
  createGame,
  updateGame,
  deleteGame,
  getLogic,
  updateLogic,
  deleteLogic,
  deleteAllLogic,
};

/*

players-
    player:
        username: 
        matchmaking:
 
games -
    game:
        player1
        player2
*/
