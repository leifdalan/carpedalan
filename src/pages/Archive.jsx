import React, { useContext } from 'react';

import { Posts } from '../providers/PostsProvider';
import GridView from '../components/GridView';

// Default sizes help Masonry decide how many images to batch-measure

export default function Archive() {
  const { getPosts, posts, meta } = useContext(Posts);
  return <GridView fetchData={getPosts} data={posts} meta={meta} />;
}
