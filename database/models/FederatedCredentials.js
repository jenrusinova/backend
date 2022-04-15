const mongoose = require("mongoose");

const federatedCredentials = new mongoose.Schema({
  user_id: {type: String},
  provider: {type: String},
  subject: {type: String}
});

const FederatedCredentials = mongoose.model("FederatedCredentials", federatedCredentials);
module.exports = FederatedCredentials;