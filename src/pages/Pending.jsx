import React, { useContext, useEffect } from 'react';
// import DayPicker from 'react-day-picker';

import { Posts } from '../providers/PostsProvider';

import GlobalStyleComponent from './styles/Pending';

export default function Pending() {
  const { getPending, pending } = useContext(Posts);

  useEffect(() => {
    getPending();
  }, []);
  return (
    <>
      {pending.map(pend => (
        <div>{pend.id}</div>
      ))}
      <GlobalStyleComponent />
      {/* <DayPicker onDayClick={console.log} /> */}
    </>
  );
}
