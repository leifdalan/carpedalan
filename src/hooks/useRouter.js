import { useContext } from 'react';

import { Window } from '../providers/WindowProvider';

export default function useRouter() {
  const { match, location, history } = useContext(Window);
  return {
    match,
    location,
    history,
  };
}
