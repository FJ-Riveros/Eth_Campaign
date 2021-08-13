import React, { useState } from "react";
import Layout from "../../components/Layout.js";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory.js";
import web3 from "../../ethereum/web3.js";
import { Router } from "../../routes.js";
const CampaignNew = () => {
  const [minimumContribution, setMinimumContribution] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const createCampaign = async (e) => {
    e.preventDefault();
    try {
      setLoadingSpinner(true);
      const [firstAccount] = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(minimumContribution)
        .send({ from: firstAccount });

      //Redirection
      Router.pushRoute("/");
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 6000);
    }
    setLoadingSpinner(false);
    setMinimumContribution("");
  };
  return (
    <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={createCampaign} error={!!errorMessage}>
        <Form.Field>
          <label>Minimum Contribution(wei)</label>
          <Input
            label="wei"
            labelPosition="right"
            onChange={(e) => setMinimumContribution(e.target.value)}
            value={minimumContribution}
          />
        </Form.Field>
        <Button loading={loadingSpinner} primary type="submit">
          Create
        </Button>
        <Message error header="Oops!" content={errorMessage} />
      </Form>
    </Layout>
  );
};

export default CampaignNew;
