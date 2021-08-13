import React, { useState } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaigns";
import Router from "../routes";
const RequestRow = ({ id, request, address, approversCount }) => {
  const { Row, Cell } = Table;
  const [errMessage, setErrMessage] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [finalizeLoading, setFinalizeLoading] = useState(false);
  const readyToFinalize = request.approvalCount > approversCount / 2;
  const approval = async () => {
    try {
      setApproveLoading(true);
      const campaign = await Campaign(address);
      const [mainAcc] = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(id).send({ from: mainAcc });
      Router.replaceRoute(`/campaigns/${address}/requests`);
    } catch (err) {
      setErrMessage(err.message);
    }
    setApproveLoading(false);
  };

  const finalize = async () => {
    try {
      setFinalizeLoading(true);
      const campaign = await Campaign(address);
      const [mainAcc] = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(id).send({ from: mainAcc });
      Router.replaceRoute(`/campaigns/${address}/requests`);
    } catch (err) {
      setErrMessage(err.message);
    }
    setFinalizeLoading(false);
  };
  return (
    <Row
      disabled={request.complete}
      positive={readyToFinalize && !request.complete}
    >
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>{`${request.approvalCount}/${approversCount}`}</Cell>
      <Cell>
        {request.complete ? null : (
          <Button
            color="green"
            basic
            loading={approveLoading}
            onClick={approval}
          >
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button
            loading={finalizeLoading}
            color="red"
            basic
            onClick={finalize}
          >
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;
