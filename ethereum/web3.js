import Web3 from "web3";

let web3;
//Next compiles the code in the server side, thats why we cant access
//the window object.
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/8e62d971c7f2418385cbf98aadce8025"
  );
  web3 = new Web3(provider);
}

export default web3;
