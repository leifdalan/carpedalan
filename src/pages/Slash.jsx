import React, { useContext } from 'react';
import { shape } from 'prop-types';
import { Route } from 'react-router-dom';

import View from '../components/View';
import { Posts } from '../providers/PostsProvider';

import FAQ from './FAQ';

export default function Slash({ match, location, history }) {
  const { posts, cache, getPosts, meta } = useContext(Posts);

  return (
    <>
      <Route exact path="/faq" component={FAQ} />
      <View
        title="Carpe Dalan"
        posts={posts}
        cache={cache}
        fetchData={getPosts}
        meta={meta}
        match={match}
        location={location}
        history={history}
        fancy
      />
    </>
  );
}

Slash.propTypes = {
  match: shape({}).isRequired,
  location: shape({}).isRequired,
  history: shape({}).isRequired,
};
