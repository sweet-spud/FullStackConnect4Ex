const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    sparse: true,
  },
  matchmaking: {
    type: Boolean,
    required: true,
  },
  expireAt: {
    type: Date,
    default: Date.now,
    expires: 86400,
  },
});

playerSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject__v;
  },
});

module.exports = mongoose.model("Player", playerSchema);
