import React from 'react';
import Banner from '../components/Banner';
import CreateProposal from '../components/CreateProposal';
import Proposal from './Proposal';

const Home = () => {
  return (
    <>
      <Banner />
      <Proposal />
      <CreateProposal />
    </>
  );
};

export default Home;
