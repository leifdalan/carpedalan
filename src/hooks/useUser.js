import { useContext } from 'react';

import { WRITE_USER } from '../../server/constants';
import { User } from '../index';

export default function useUser() {
  const { user } = useContext(User);
  const isAdmin = user === WRITE_USER;
  return {
    user,
    isAdmin,
  };
}
