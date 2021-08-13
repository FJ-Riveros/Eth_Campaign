import React from "react";
import Layout from "../../../components/Layout";
import { Button, Table } from "semantic-ui-react";
import { Link } from "../../../routes";
import Campaign from "../../../ethereum/campaigns";
import RequestRow from "../../../components/RequestRow";
const RequestIndex = ({ address, totalRequests, requests, approversCount }) => {
  const { Header, Row, HeaderCell, Body } = Table;

  const renderRows = () => {
    return requests.map((request, index) => {
      return (
        <RequestRow
          request={request}
          key={index}
          address={address}
          id={index}
          approversCount={approversCount}
        />
      );
    });
  };
  return (
    <Layout>
      <h3>Requests</h3>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <Link route={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary floated="right">
            Add Request
          </Button>
        </a>
      </Link>
      <div>Found {totalRequests} requests.</div>
    </Layout>
  );
};

RequestIndex.getInitialProps = async (props) => {
  const { address } = props.query;
  const campaign = Campaign(address);
  const totalRequests = await campaign.methods.getRequestCount().call();
  const requests = await Promise.all(
    Array(parseInt(totalRequests))
      .fill()
      .map(async (element, index) => {
        return await campaign.methods.requests(index).call();
      })
  );
  const approversCount = await campaign.methods.totalApprovers().call();

  console.log(requests);
  return { address, totalRequests, requests, approversCount };
};

export default RequestIndex;
