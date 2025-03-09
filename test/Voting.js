const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting", function () {
    let proposalNames;
    let votesAddresses;
    let voting;

    beforeEach(async function () {
        proposalNames = ["Proposal 1", "Proposal 2", "Proposal 3"];
        [addr0, addr1, addr2, addr3, addr4, addr5, addr6, addr7] = await ethers.getSigners();
        votesAddresses = [addr0.address, addr1.address, addr2.address, addr3.address, addr4.address, addr5.address, addr6.address];

        const Voting = await ethers.getContractFactory("Voting"); 
        voting = await Voting.deploy(proposalNames, votesAddresses); 

        
    });

    function removeNullBytes(str){
        return str.split("").filter(char => char.codePointAt(0)).join("");
    }

    describe("Deployment", function () {
        it("Should set the right value of proposals", async function () {
            for (let i = 0; i < proposalNames.length; i++) {
                let prop = await voting.getProposal(i);
                let cleanProp = removeNullBytes(prop[0]);
                expect(cleanProp).to.equal(proposalNames[i]); 
            }
        });

        it("Should set the right value of the voters addresses", async function () {
            for (let i = 0; i < votesAddresses.length; i++) {
                let voterAddress = await voting.voters(votesAddresses[i]);
                expect(voterAddress.voter).to.equal(votesAddresses[i]);
                
            }
        });
    });

    describe("Vote", function () {
        it("Shouldn't vote", async function () {
            await expect(voting.vote(votesAddresses[1], 1)).to.be.revertedWith("Voting system: This msg sender has no right to vote");
        });

        it("Should vote", async function () {
            await expect(voting.vote(votesAddresses[0], 1)).not.to.be.reverted;
        });

        
    });

    describe("Delegate", function(){
        it("Shouldn't delegate, self delegation", async function () {
            await expect(voting.delegateVote(votesAddresses[0])).to.be.revertedWith("Voting system: Self delegate is not allowed");
        });

        it("Shouldn't delegate, user has already voted", async function () {
            await voting.vote(votesAddresses[0], 1);
            await expect(voting.delegateVote(votesAddresses[1])).to.be.revertedWith("Voting system: Voter already voted");
        });

        it("Shouldn't delegate, this address has no right to vote", async function () {
            await expect(voting.connect(addr7).delegateVote(votesAddresses[1])).to.be.revertedWith("Voting System: This msg sender has no right to vote");
        });

        it("Should delegate", async function () {
            await expect(voting.delegateVote(votesAddresses[1])).not.to.be.reverted;
            let voterAddress = await voting.voters(votesAddresses[0]);
            await expect(voterAddress.delegate).to.equal(votesAddresses[1]);
        });
    });

    describe("Voting", function(){
        it("Shouldn't vote, this proposal doesn't exit", async function () {
            await expect(voting.vote(votesAddresses[0], 8)).to.be.revertedWith("Voting system: Proposal index out of bounds");
        });

        it("Shouldn't vote, voter already voted", async function () {
            await voting.vote(votesAddresses[0], 1);
            await expect(voting.vote(votesAddresses[0], 1)).to.be.revertedWith("Voting system: Voter already voted");
        });

        it("Shouldn't vote, address does not have right to vote", async function () {
            await expect(voting.connect(addr1).vote(votesAddresses[0], 1)).to.be.revertedWith("Voting system: This msg sender has no right to vote");
        });

        it("Shouldn't vote, this proposal doesn't exit", async function () {
            await expect(voting.vote(votesAddresses[0], 8)).to.be.revertedWith("Voting system: Proposal index out of bounds");
        });

        it("Should vote", async function () {
            await expect(voting.vote(votesAddresses[0], 1)).not.to.be.reverted;
        });
    });

    describe("Winners", function () {
        it("Can't compute winners. Caller is not the owner", async function () {
            await voting.vote(votesAddresses[0], 1); //addr0
            await voting.connect(addr1).vote(votesAddresses[1], 1); //addr1
            await voting.connect(addr2).vote(votesAddresses[2], 0); //addr2
            await voting.connect(addr3).vote(votesAddresses[3], 2); //addr3
            await voting.connect(addr4).vote(votesAddresses[4], 1); //addr4
            await voting.connect(addr5).vote(votesAddresses[5], 0); //addr5
            await voting.connect(addr6).vote(votesAddresses[6], 1); //addr6

            await expect(voting.connect(addr1).computeWinners()).to.be.reverted;
        });

        it("Can compute winners", async function () {
            await voting.vote(votesAddresses[0], 2); //addr0
            await voting.connect(addr1).vote(votesAddresses[1], 1); //addr1
            await voting.connect(addr2).vote(votesAddresses[2], 0); //addr2
            await voting.connect(addr3).vote(votesAddresses[3], 0); //addr3
            await voting.connect(addr4).vote(votesAddresses[4], 1); //addr4
            await voting.connect(addr5).vote(votesAddresses[5], 0); //addr5
            await voting.connect(addr6).vote(votesAddresses[6], 1); //addr6

            await expect(voting.computeWinners()).not.to.be.reverted;
            let prop = await voting.getWinningProposals();
            
            expect(prop[0]).to.be.equal(0);
            expect(prop[1]).to.be.equal(1);
        });
    });

    
});
