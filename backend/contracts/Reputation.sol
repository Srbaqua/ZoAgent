// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ZoReputation {
    address public agent;

    mapping(address => uint256) public reputation;

    event ReputationUpdated(address indexed user, uint256 score);

    constructor(address _agent) {
        agent = _agent;
    }

    modifier onlyAgent() {
        require(msg.sender == agent, "Not authorized");
        _;
    }

    function updateReputation(address user, uint256 score) external onlyAgent {
        reputation[user] = score;
        emit ReputationUpdated(user, score);
    }
}
