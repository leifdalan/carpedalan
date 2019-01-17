import React, { useContext } from 'react';
import { shape } from 'prop-types';

import View from '../components/View';
import { Posts } from '../providers/PostsProvider';

export default function Slash({ match, location }) {
  const { posts, cache, getPosts, meta } = useContext(Posts);

  return (
    <View
      title="Carpe Dalan"
      posts={posts}
      cache={cache}
      fetchData={getPosts}
      meta={meta}
      match={match}
      location={location}
      fancy
    />
  );
}

Slash.propTypes = {
  match: shape({}).isRequired,
  location: shape({}).isRequired,
};
