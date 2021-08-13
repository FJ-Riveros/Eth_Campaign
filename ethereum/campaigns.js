import web3 from "./web3.js";
import campaign from "./build/campaign.json";

const getInstance = (address) => {
  return new web3.eth.Contract(JSON.parse(campaign.interface), address);
};
export default getInstance;
