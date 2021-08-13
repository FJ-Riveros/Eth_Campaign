import React from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import Layout from "../../components/Layout.js";
import Campaign from "../../ethereum/campaigns.js";
import web3 from "../../ethereum/web3.js";
import ContributeForm from "../../components/ContributeForm.js";
import { Link } from "../../routes.js";

const CampaignShow = (props) => {
  return (
    <Layout>
      <h3>Campaign Show</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{renderCards(props)}</Grid.Column>

          <Grid.Column width={6}>
            <ContributeForm address={props.address}></ContributeForm>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link route={`/campaigns/${props.address}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

//Este props viene de routes.js, con props.query podemos acceder al address(o nombre que le hayamos asigando)
CampaignShow.getInitialProps = async (props) => {
  const campaign = Campaign(props.query.address);
  const summary = await campaign.methods.getSummary().call();

  return {
    minimumContribution: summary[0],
    balance: summary[1],
    requestsCount: summary[2],
    approversCount: summary[3],
    manager: summary[4],
    address: props.query.address,
  };
};

const renderCards = (props) => {
  const {
    balance,
    manager,
    minimumContribution,
    requestsCount,
    approversCount,
  } = props;
  const items = [
    {
      header: manager,
      meta: "Address of Manager",
      description:
        "The manager created this campaign and can create requests to withdraw the money",
      style: { overflowWrap: "break-word" },
    },
    {
      header: minimumContribution,
      meta: "Minimum Contribution(wei)",
      description:
        "You must contribute atleast this much wei to become an approver",
    },
    {
      header: requestsCount,
      meta: "Number of Requests",
      description:
        "A reuqest tries to withdraw money from the contract. Requests must be approved by approvers",
    },
    {
      header: approversCount,
      meta: "Number of Approvers",
      description: "Number of people who have already donated to this campaign",
    },
    {
      header: web3.utils.fromWei(balance, "ether"),
      meta: "Campaign Balance (ether)",
      description:
        "The balance is how much money this campaign has left to spend.",
    },
  ];
  return <Card.Group items={items} />;
};
export default CampaignShow;
