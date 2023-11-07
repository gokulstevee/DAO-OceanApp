const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('DAO Contract', function () {
  let dao;
  let owner;
  let stakeholder;
  let contributor;

  before(async function () {
    // Deploy the DAO contract
    [owner, stakeholder, contributor] = await ethers.getSigners();
    const DAO = await ethers.getContractFactory('DAO');
    dao = await DAO.deploy();
    await dao.deployed();

    // Grant roles to stakeholders and contributors
    await dao.grantRole(await dao.STAKEHOLDER_ROLE(), stakeholder.address);
    await dao.grantRole(await dao.CONTRIBUTOR_ROLE(), contributor.address);
  });

  it('should allow stakeholders to create a proposal', async function () {
    const proposalTitle = 'Test Proposal';
    const proposalDescription = 'This is a test proposal.';
    const proposalBeneficiary = contributor.address;
    const proposalAmount = ethers.utils.parseEther('1.0');

    await expect(
      dao.connect(stakeholder).createProposal(
        proposalTitle,
        proposalDescription,
        proposalBeneficiary,
        proposalAmount
      )
    ).to.emit(dao, 'EventAction').withArgs(
      stakeholder.address,
      await dao.STAKEHOLDER_ROLE(),
      'PROPOSAL RAISED',
      proposalBeneficiary,
      proposalAmount,
      ethers.BigNumber.from(0)
    );
  });

  it('should allow stakeholders to vote on a proposal', async function () {
    const proposals = await dao.getProposals();
    const proposal = proposals[0];
    const proposalId = proposal.id;

    await expect(
      dao.connect(stakeholder).Vote(proposalId, true)
    ).to.emit(dao, 'Action').withArgs(
      stakeholder.address,
      await dao.STAKEHOLDER_ROLE(),
      'PROPOSAL VOTE',
      proposal.beneficiary,
      proposal.amount
    );
  });

  it('should allow stakeholders to pay a beneficiary', async function () {
    const proposals = await dao.getProposals();
    const proposal = proposals[0];
    const proposalId = proposal.id;

    // Ensure the proposal has enough upvotes to pass
    await dao.connect(stakeholder).Vote(proposalId, true);
    await dao.connect(stakeholder).Vote(proposalId, true);

    // Get the initial balance of the beneficiary
    const initialBalance = await contributor.getBalance();

    // Execute the payment
    await expect(
      dao.connect(stakeholder).payBeneficiary(proposalId)
    ).to.emit(dao, 'Action').withArgs(
      stakeholder.address,
      await dao.STAKEHOLDER_ROLE(),
      'PAYMENT TRANSFERED',
      proposal.beneficiary,
      proposal.amount
    );

    // Check if the beneficiary's balance increased
    const finalBalance = await contributor.getBalance();
    expect(finalBalance.sub(initialBalance)).to.equal(proposal.amount);
  });

  it('should allow contributors to contribute to the DAO', async function () {
    const contributionAmount = ethers.utils.parseEther('2.0');

    // Get the initial balance of the DAO
    const initialDaoBalance = await dao.daoBalance();

    // Contributor makes a contribution
    await expect(
      dao.connect(contributor).contribute({ value: contributionAmount })
    ).to.emit(dao, 'Action').withArgs(
      contributor.address,
      await dao.STAKEHOLDER_ROLE(),
      'CONTRIBUTION RECEIVED',
      dao.address,
      contributionAmount
    );

    // Check if the DAO's balance increased
    const finalDaoBalance = await dao.daoBalance();
    expect(finalDaoBalance.sub(initialDaoBalance)).to.equal(contributionAmount);
  });

  // Add more test cases as needed
});
