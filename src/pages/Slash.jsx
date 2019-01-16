import React, { useContext } from 'react';

import View from '../components/View';
import { Posts } from '../providers/PostsProvider';

export default function Slash() {
  const { posts, cache, getPosts, meta } = useContext(Posts);

  return (
    <View
      title="Carpe Dalan"
      posts={posts}
      cache={cache}
      fetchData={getPosts}
      meta={meta}
    />
  );
}
