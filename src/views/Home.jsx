import React from 'react';
import Banner from '../components/Banner';
import CreateProposal from '../components/CreateProposal';
import Proposals from '../components/Proposals';

const Home = () => {
  return (
    <>
      <Banner />
      <Proposals />
      {/* when raise proposal button is clicked globalState will set the css property 
      for creating MODAL by changing the "scale-0" to "scale-100" tailwind-css class and becomes visible in DOM flow*/}
      <CreateProposal />
    </>
  );
};

export default Home;
