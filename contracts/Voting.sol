// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable{

    using Math for uint256;

    // Structure to store voter details
    struct Voter {
        address voter; // Address of the voter
        address delegate; // Address to whom the vote is delegated
        uint vote; // Index of the selected proposal
        bool voted; // Indicates if the voter has already voted
    }

    // Structure to store proposal details
    struct Proposal {
        bytes32 name; // Name of the proposal in bytes32 format
        uint voteCount; // Number of votes received
    }

    // Mapping to store voter details by their address
    mapping (address=>Voter) public voters;
    Proposal[] proposals; // Dynamic array of proposals
    uint256 proposalsCount; // Total number of proposals

    uint256[] winningProposal; // Array to store the winning proposal(s)

    // Modifiers to check conditions before executing functions
    modifier proposalExists( uint256 _proposalIndex) {
        require (_proposalIndex < proposalsCount, "Voting system: Proposal index out of bounds");
        _;
    }

    modifier notYetVoted (address _voter) {
        require (!voters[_voter].voted, "Voting system: Voter already voted");
        _;
    }

    // Events to log contract activities
    event VotingStarted(address indexed owner, uint256 _proposalCount);
    event VoteCasted (uint256 _proposalVoted, address indexed _voter);
    event DelegationSuccesful (address indexed voter, address indexed delegate);

    // Constructor initializes proposals and voters
    constructor(string[] memory proposalNames, address[] memory voterAddress) Ownable(msg.sender) {
        proposalsCount = proposalNames.length;
        for (uint i = 0; i < proposalsCount; ) {
            Proposal memory proposal = Proposal (stringToBytes32 (proposalNames[i]), 0);
            proposals.push(proposal);
            unchecked { i += 1; } // No overflow risk in Solidity 0.8+
        }

        for (uint i = 0; i < voterAddress.length;) {
            Voter memory voter = Voter (voterAddress[i], address(0), 0, false);
            voters[voterAddress[i]] = voter;
            unchecked { i += 1; }
        }

        emit VotingStarted(owner(), proposalsCount);
    }

    // Function to retrieve proposal details by index
    function getProposal(uint256 _proposalIndex) public view proposalExists(_proposalIndex) returns (string memory _proposalName, uint256 _voteCount) {
        (_proposalName, _voteCount) = (bytes32ToString(proposals[_proposalIndex].name), proposals[_proposalIndex].voteCount);
    }

    // Function to cast a vote for a specific proposal
    function vote(address _voter, uint256 _proposalIndex) external notYetVoted(_voter) proposalExists(_proposalIndex) returns (bool) {
        Voter storage sender = voters[_voter];
        require (msg.sender == _voter || msg.sender == sender.delegate, "Voting system: This msg sender has no right to vote");

        sender.vote = _proposalIndex; // Assign the selected proposal index to the voter
        unchecked {proposals[_proposalIndex].voteCount = proposals[_proposalIndex].voteCount + 1;} // Increase proposal vote count
        sender.voted = true; // Mark voter as voted
        emit VoteCasted(_proposalIndex, _voter);
        return true;
    }

    // Function to delegate voting power to another voter
    function delegateVote (address _to) external notYetVoted(msg.sender) {
        require (_to != msg.sender, "Voting system: Self delegate is not allowed");
        Voter storage sender = voters[msg.sender];
        require (sender.voter != address(0), "Voting System: This msg sender has no right to vote");

        sender.delegate = _to; // Assign the delegate address
        emit DelegationSuccesful(msg.sender, _to);
    }

    // Function to compute the winning proposal(s)
    function computeWinners() external onlyOwner {
        delete winningProposal; // Reset previous winning proposals
        uint256 winningVoteCount = 0;
        uint256 winner = 0;

        // Identify the proposal with the highest votes
        for (uint256 i = 0; i < proposals.length;) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winner = i;
            }
            unchecked { i += 1; }
        }

        winningProposal.push(winner); // Store the winning proposal index

        // Identify other proposals with the same highest vote count (tie handling)
        for (uint256 i = 0; i < proposals.length;) {
            if (proposals[i].voteCount == proposals[winner].voteCount && i != winner) {
                winningProposal.push(i);
            }
            unchecked { i += 1; }
        }
    }


    // Function to retrieve the indexes of winning proposals
    function getWinningProposals() external view returns (uint256[] memory) {
        return winningProposal;
    }

    // Utility function to convert a string to bytes32
    function stringToBytes32(string memory str) internal pure returns (bytes32){
        return bytes32(abi.encodePacked(str));
    }

    // Utility function to convert bytes32 to string
    function bytes32ToString(bytes32 byt) internal pure returns (string memory){
        return string(abi.encode(byt));
    }
}
