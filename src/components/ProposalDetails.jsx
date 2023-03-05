import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProposal, voteOnProposal } from '../Blockchain';
import { toast } from 'react-toastify';
import { useGlobalState, daysRemaining } from '../store';

const ProposalDetails = () => {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [data, setData] = useState([]);
  const [isStakeholder] = useGlobalState('isStakeholder');

  useEffect(() => {
    reterieveProposal();
  }, [id]);

  const reterieveProposal = async () => {
    await getProposal(id).then((res) => {
      setProposal(res);
      setData([
        { name: 'Voters', Acceptees: res?.upvotes, Rejectees: res?.downvotes },
      ]);
    });
  };

  const onVote = async (choice) => {
    if (new Date().getTime() > Number(proposal.duration + '000')) {
      toast.warning('Proposal expired!');
      return;
    }

    await voteOnProposal(id, choice);
    toast.success('Voted successfully');
  };

  return (
    <div className="p-8">
      <h2 className="font-semibold text-3xl mb-5">{proposal?.title}</h2>
      <p>
        This proposal is to payout <strong>{proposal?.amount} Eth</strong>and
        currently have{' '}
        <strong>{proposal?.upvotes + proposal?.downvotes} votes</strong> and
        will expire in <strong>{daysRemaining(proposal?.duration)}</strong>
      </p>
    </div>
  );
};

export default ProposalDetails;
