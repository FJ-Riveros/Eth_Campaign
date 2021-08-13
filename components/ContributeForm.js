import React, { useState } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaigns.js";
import { Router } from "../routes.js";

const ContributeForm = ({ address }) => {
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [contributeAmount, setContributeAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const submitHandler = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    const [mainAccount] = await web3.eth.getAccounts();
    const campaign = await Campaign(address);
    try {
      setStatusMessage("Trying to contribute...");
      setLoading(true);
      await campaign.methods.contribute().send({
        value: web3.utils.toWei(contributeAmount, "ether"),
        from: mainAccount,
      });
      setContributeAmount("");
      Router.pushRoute(`/campaigns/${address}`);
      setLoading(false);
      setStatusMessage("Contribution completed");
    } catch (err) {
      setStatusMessage("");
      setLoading(false);
      setErrorMessage(err.message);
    }
  };

  return (
    <Form onSubmit={submitHandler} error={!!errorMessage}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          label="ether"
          labelPosition="right"
          value={contributeAmount}
          onChange={(e) => setContributeAmount(e.target.value)}
        />
      </Form.Field>
      <Message error header="Oops" content={errorMessage} />
      <Button loading={loading} primary type="submit">
        Contribute!
      </Button>

      {statusMessage}
    </Form>
  );
};

export default ContributeForm;
