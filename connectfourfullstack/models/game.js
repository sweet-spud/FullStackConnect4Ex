const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  player1Id: {
    type: String,
    required: true,
    unique: true,
  },
  player2Id: {
    type: String,
    unique: true,
    sparse: true,
  },
  yellow1: {
    type: Boolean,
  },
  searching: {
    type: Boolean,
    required: true,
  },
});

gameSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject__v;
  },
});

module.exports = mongoose.model("Game", gameSchema);
