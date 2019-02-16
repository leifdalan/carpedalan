import React, { useContext, useEffect } from 'react';

import { Posts } from '../providers/PostsProvider';
import PatchPendingForm from '../components/Pending/PatchPendingForm';
import Wrapper from '../styles/Wrapper';

import GlobalStyleComponent from './styles/Pending';

export default function Pending() {
  const { getPending, pending } = useContext(Posts);

  useEffect(() => {
    getPending();
  }, []);

  return (
    <Wrapper>
      {pending.map(pend => (
        <PatchPendingForm record={pend} />
      ))}
      <GlobalStyleComponent />
    </Wrapper>
  );
}
