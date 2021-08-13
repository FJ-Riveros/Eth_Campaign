import React, { useState } from "react";
import { Input, Form, Message, Button } from "semantic-ui-react";
import web3 from "../../../ethereum/web3";
import Campaign from "../../../ethereum/campaigns";
import { Link, Router } from "../../../routes";
import Layout from "../../../components/Layout";

const RequestNew = ({ address }) => {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [recipient, setRecipient] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    const campaign = Campaign(address);

    try {
      setLoadingSpinner(true);
      const [mainAccount] = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: mainAccount });
      Router.pushRoute(`/campaigns/${address}/requests`);
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoadingSpinner(false);
  };

  return (
    <Layout>
      <Link route={`/campaigns/${address}/requests`}>
        <a>Back</a>
      </Link>
      <h3>Create a Request</h3>
      <Form onSubmit={submitHandler} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value);
            }}
          />
        </Form.Field>
        <Button loading={loadingSpinner} primary type="submit">
          Create!
        </Button>
        <Message error header="Oops!" content={errorMessage} />
      </Form>
    </Layout>
  );
};

RequestNew.getInitialProps = async (props) => {
  const { address } = props.query;
  return { address };
};
export default RequestNew;
