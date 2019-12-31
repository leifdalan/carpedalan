import * as React from 'react';

const { useState, useEffect } = React;

export type User = 'read' | 'write' | undefined;

let user: User = window?.__SESSION__?.user;

type SetUser = (u?: User) => void;

let setters: SetUser[] = [];

const setUser = (userVal: User) => {
  setters.forEach(setter => {
    user = userVal;
    setter(user);
  });
};
interface UseUser {
  user: User;
  setUser: SetUser;
}

export default function useUser(): UseUser {
  const [, set] = useState(user);
  if (!setters.includes(set)) {
    setters.push(set);
  }

  useEffect(() => {
    return () => {
      setters = setters.filter((setter: SetUser) => setter !== set);
    };
  }, []);

  return {
    setUser,
    user,
  };
}
