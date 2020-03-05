import debug from 'debug';
import keyBy from 'lodash/keyBy';
import * as React from 'react';

import { GetTagsResponseBodyI } from 'ApiClient';
import { PostsWithTagsWithFakes } from 'hooks/types';

const log = debug('providers:Data');

const { createContext, Children, useReducer, useCallback } = React;
export interface Data {
  posts: PostsWithTagsWithFakes[];
  tags: GetTagsResponseBodyI;
  postsById: {
    [uuid: string]: PostsWithTagsWithFakes;
  };
}
const data: Data = {
  posts: [],
  tags: [],
  postsById: {},
};
type SetPosts = (posts: PostsWithTagsWithFakes[]) => void;
type AddPosts = (posts: PostsWithTagsWithFakes[]) => void;
type SetTags = (posts: GetTagsResponseBodyI) => void;
export interface DataContextI {
  data: Data;
  setPosts: SetPosts;
  setTags: SetTags;
  addPosts: AddPosts;
}
/* eslint-disable  @typescript-eslint/no-empty-function */
export const DataContext = createContext<DataContextI>({
  data,
  setPosts: () => {},
  setTags: () => {},
  addPosts: () => {},
});
/* eslint-enable  @typescript-eslint/no-empty-function */

type Action =
  | { type: 'set posts'; payload: PostsWithTagsWithFakes[] }
  | { type: 'add posts'; payload: PostsWithTagsWithFakes[] }
  | {
      type: 'set tags';
      payload: GetTagsResponseBodyI;
    };

function reducer(state: Data, action: Action): Data {
  let newState = state;
  switch (action.type) {
    case 'set posts':
      newState = {
        ...state,
        posts: action.payload,
        postsById: {
          ...state.postsById,
          ...keyBy(action.payload, 'id'),
        },
      };
      break;
    case 'add posts': {
      newState = {
        ...state,
        postsById: { ...state.postsById, ...keyBy(action.payload, 'id') },
      };
      break;
    }
    case 'set tags':
      newState = {
        ...state,
        tags: action.payload,
      };
      break;
    default: {
      newState = state;
      break;
    }
  }
  return newState;
}

export const DataConsumer = DataContext.Consumer;

export const DataProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, data);

  const setPosts = useCallback(
    (posts: PostsWithTagsWithFakes[]) =>
      dispatch({ type: 'set posts', payload: posts }),
    [dispatch],
  );

  const addPosts = useCallback(
    (posts: PostsWithTagsWithFakes[]) =>
      dispatch({ type: 'set posts', payload: posts }),
    [dispatch],
  );

  const setTags = useCallback(
    (tags: GetTagsResponseBodyI) => {
      dispatch({ type: 'set tags', payload: tags });
    },
    [dispatch],
  );

  const value: DataContextI = {
    setTags,
    setPosts,
    addPosts,
    data: state,
  };
  log('value', value);
  return (
    <DataContext.Provider value={value}>
      {Children.only(children)}
    </DataContext.Provider>
  );
};
