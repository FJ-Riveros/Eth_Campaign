 pragma solidity ^0.4.17;


contract CampaignFactory{
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimumContribution) public{
        address newCampaign = new Campaign(minimumContribution, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns(address[]){
        return deployedCampaigns;
    }
}

contract Campaign{
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        //To count the "YES" votes
        uint approvalCount;
        //Stores who voted already
        mapping(address => bool) approvals;
    }
    
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    Request[] public requests;
    uint public totalApprovers;
    
    modifier onlyManager{
        require(msg.sender==manager);
        _;
    }
    
    function Campaign(uint _minimumContribution, address creator) public{
        manager = creator;
        minimumContribution = _minimumContribution;
    }
    
    function contribute() public payable{
        //require(msg.value > web3.utils.toWei(minimumContribution, "ether");
        require(msg.value >minimumContribution);
        
        //How to add a new contributor to the mapping
        approvers[msg.sender] = true;
        totalApprovers++; 
        
    }
    
    function createRequest(string _description, uint _value, address _recipient) public onlyManager{
        Request memory newRequest = Request({
          description: _description,
          value: _value,
          recipient: _recipient,
          complete: false,
          approvalCount: 0
        });
        
        /*Alternative syntax
        Avoid using it.
        Request(_description, _value, _recipient, false)
        
        */
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint indexRequest) public{
        //We assign the variable request to shorten the length of the code
        Request storage request = requests[indexRequest];
        //Checks if the user is a contributor
        require(approvers[msg.sender]);
        //Checks if the contributor has already voted
        require(!request.approvals[msg.sender]);
        //We store that the user has voted
        request.approvals[msg.sender] = true;
        //Increment of the "YES" votes
        request.approvalCount++;
        
        
    }
    
    function finalizeRequest(uint indexRequest) public onlyManager{
        Request storage request = requests[indexRequest];
        require(!request.complete);
        require(request.approvalCount > totalApprovers/2);
        request.recipient.transfer(request.value);
        request.complete = true;
    }
    
    function getSummary() public view returns(
        uint, uint, uint, uint, address
        ){
        return(
            minimumContribution,
            this.balance,
            requests.length,
            totalApprovers,
            manager
        );
    }

    function getRequestCount() public view returns(uint){
        return requests.length;
    }
    
}   