import abi from './abi/contracts/DAO.sol/DAO.json';
import Web3 from 'web3';
import { setGlobalState, getGlobalState } from './store';
const { ethereum } = window;

window.web3 = new Web3(window.ethereum);

//custom error report, logging console with red text
const reportError = (error) => {
  console.log(JSON.stringify(error), 'red');
};

const connectWallet = async () => {
  try {
    if (!ethereum) console.log('Connect to the Wallet');

    //"eth_requestAccounts" will initialize meta mask popup and request to connect
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    setGlobalState('connectedAccount', accounts[0].toLowerCase());
  } catch (error) {
    console.log(error);
  }
};

const isWalletConnected = async () => {
  try {
    if (!ethereum) console.log('Connect to the Wallet');

    //if wallet connected than "eth_accounts" will fetch the accounts directly
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    //if chainid of the network changed tha reload and reset the wallet account
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });

    //on changing the account in mwtamask manually than accounts is resetted
    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0].toLowerCase());
      await isWalletConnected();
    });

    //resetting the account address in globalState
    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0].toLowerCase());
    } else {
      console.log('Connect to Wallet');
      console.log('No Accounts found');
    }
  } catch (error) {
    reportError(error);
  }
};

const getEthereumContract = () => {
  const connectedAccount = getGlobalState('connectedAccount');

  if (connectedAccount) {
    const web3 = window.web3;
    const contract = new web3.eth.Contract(
      abi.abi,
      '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    );
    //returns contract object
    return contract;
  } else {
    return getGlobalState('contract');
  }
};

const performContribute = async (amount) => {
  try {
    amount = window.web3.utils.toWei(amount.toString(), 'ether');

    //getting contract object
    const contract = await getEthereumContract();
    const account = getGlobalState('connectedAccount');

    //executes contribute function.
    //send is a write method that creates a transaction on the blockchain.
    //It modifies the state of the blockchain, and requires gas fees to execute.
    await contract.methods.contribute().send({ from: account, value: amount });

    //once the user contributed than reload to home page
    window.location.reload();
  } catch (error) {
    reportError(error);
  }
};

const getInfo = async () => {
  try {
    if (!ethereum) console.log('Please connect to Wallet');
    const contract = await getEthereumContract();
    const account = getGlobalState('connectedAccount');

    //fetch whether current user is stakeHolder or not
    //call is a read-only method that allows you to retrieve data from the blockchain without creating a transaction.
    //It does not modify the state of the blockchain, nor does it require any gas fees.
    const isStakeholder = await contract.methods
      .isStakeholder()
      .call({ from: account });

    //fetch the total smart contract balance
    const balance = await contract.methods.daoBalance().call({ from: account });

    //fetcing current user balance
    const myBalance = await contract.method
      .getBalance()
      .call({ from: account });

    //setting variables to the global storage
    setGlobalState('balance', window.web3.utils.fromWei(balance));
    setGlobalState('myBalance', window.web3.utils.fromWei(myBalance));
    setGlobalState('isStakeholder', window.web3.utils.fromWei(isStakeholder));
  } catch (error) {
    reportError(error);
  }
};

const raiseProposal = async ({ title, description, beneficiary, amount }) => {
  try {
    amount = window.web3.utils.toWei(amount.toString(), 'ether');
    const contract = await getEthereumContract();
    const account = getGlobalState('connectedAccount');

    //creating proposal with the user provided data
    await contract.methods
      .createProposal(title, description, beneficiary, amount)
      .send({ from: account });

    window.location.reload();
  } catch (error) {
    reportError(error);
  }
};

const getProposals = async () => {
  try {
    if (!ethereum) console.log('Please Connect to wallet');

    const contract = await getEthereumContract();

    //getting all the proposals in an array format
    const proposals = await contract.methods.getProposals().call();
    setGlobalState('proposals', structuredProposals(proposals));
  } catch (error) {
    reportError(error);
  }
};

const structuredProposals = (proposals) => {
  return proposals.map((proposal) => ({
    id: proposal.id,
    amount: window.web3.utils.fromWei(proposal.amount),
    title: proposal.title,
    description: proposal.description,
    paid: proposal.paid,
    passed: proposal.passed,
    proposer: proposal.proposer,
    upvotes: Number(proposal.upvotes),
    downvotes: Number(proposal.downvotes),
    beneficiary: proposal.beneficiary,
    executor: proposal.executor,
    duration: proposal.duration,
  }));
};

const getProposal = async (id) => {
  try {
    const proposals = getGlobalState('proposals');

    //getting the specific proposal for the given proposal ID
    return proposals.find((proposal) => proposal.id == id);
  } catch (error) {
    reportError(error);
  }
};

const voteOnProposal = async (proposalId, supported) => {
  try {
    const contract = await getEthereumContract();
    const account = getGlobalState('connectedAccount');

    //voting for the proposal with that proposal ID. send method will change the blockchain state
    await contract.methods.Vote(proposalId, supported).send({ from: account });

    //reloading the page after Voting
    window.location.reload();
  } catch (error) {
    reportError(error);
  }
};

const listVoters = async (id) => {
  try {
    const contract = await getEthereumContract();

    //fetching voters detail for a given proposal ID
    const votes = await contract.methods.getVoteOf(id).call();
    return votes;
  } catch (error) {
    reportError(error);
  }
};

const payoutBeneficiary = async (id) => {
  try {
    const contract = await getEthereumContract();
    const account = getGlobalState('connectedAccount');

    //paying ether to EOA for the given proposal Id
    await contract.methods.payBeneficiary(id).send({ from: account });

    //reloading the page after paying the beneficiary
    window.location.reload();
  } catch (error) {
    reportError(error);
  }
};

export {
  isWalletConnected,
  connectWallet,
  performContribute,
  getInfo,
  raiseProposal,
  getProposals,
  getProposal,
  voteOnProposal,
  listVoters,
  payoutBeneficiary,
};
