const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "lecture tool ancient summer clog learn feel private awake behind logic awake",
  "https://rinkeby.infura.io/v3/8e62d971c7f2418385cbf98aadce8025"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Trying to deploy from account: " + accounts[0]);
  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to: " + result.options.address);
};
deploy();
