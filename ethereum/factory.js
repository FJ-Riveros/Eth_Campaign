import React from "react";
import web3 from "./web3.js";
import CampaignFactory from "./build/CampaignFactory.json";
const ADDRESS = "0x4283cdc4C40160e77A58Ab67598e83a8815bEb92";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  ADDRESS
);

export default instance;
