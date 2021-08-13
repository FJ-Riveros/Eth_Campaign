import React from "react";
import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory.js";
import Layout from "../components/Layout.js";
import { Link } from "../routes.js";
const CampaignIndex = ({ campaigns }) => {
  const renderCampaigns = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <div>
        <h3>Open Campaigns</h3>
        <Link route="/campaigns/new">
          <a>
            <Button
              style={{ marginTop: "12px" }}
              floated="right"
              content="Create Campaign"
              icon="add circle"
              primary
            />
          </a>
        </Link>
        <div>{renderCampaigns()}</div>
      </div>
    </Layout>
  );
};

/*Next allows to preFetch some info in the server side before rendering
the component, so its faster.
We need to use the static method getInitialProps and returning the fetched data*/
CampaignIndex.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { campaigns };
};

export default CampaignIndex;
