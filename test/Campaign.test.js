const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });
  //Destructuring para selecionar el primer elemento del array
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("Deploys a factory and a campaign", () => {
    console.log(campaign);
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("The account that creates the Campaign instance is the manager", async () => {
    assert((await campaign.methods.manager().call()) == accounts[0]);
  });

  it("A user contributes to the campaign and his address is included in the approvers mapping", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "200" });
    assert.ok(await campaign.methods.approvers(accounts[1]).call());
  });

  it("Requires a minimum contribution", async () => {
    try {
      await campaign.methods
        .contribute()
        .send({ from: accounts[0], value: "10" });
      throw false;
    } catch (err) {
      assert(err);
    }
  });

  it("Allows the manager to create a request", async () => {
    await campaign.methods
      .createRequest("This is a request", "1", accounts[2])
      .send({ from: accounts[0], gas: "1000000" });
    const request = await campaign.methods.requests(0).call();
    assert(request.description == "This is a request");
  });

  it("Processes the request life cycle", async () => {
    const requestValue = web3.utils.toWei("2", "ether");
    const initialBalance = await web3.eth.getBalance(accounts[3]);
    await campaign.methods
      .createRequest("This is a request", requestValue, accounts[3])
      .send({ from: accounts[0], gas: "1000000" });
    const request = await campaign.methods.requests(0).call();
    assert(request.description == "This is a request");
    //Contributor 1
    await campaign.methods
      .contribute()
      .send({ from: accounts[0], value: web3.utils.toWei("1", "ether") });
    //Contributor 2
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: web3.utils.toWei("1", "ether") });
    //Approving the request
    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[1], gas: "1000000" });
    //Finalizing the request
    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1000000" });
    const finalBalance = await web3.eth.getBalance(accounts[3]);
    const difference = finalBalance - initialBalance;
    assert(difference == web3.utils.toWei("2", "ether"));
  });
});
