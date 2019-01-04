import React, { useContext } from 'react';
import { shape } from 'prop-types';

import { TagPosts } from '../providers/TagPostsProvider';
import GridView from '../components/GridView';

export default function Tag({ match }) {
  const { getTagPosts, tagPosts, meta } = useContext(TagPosts);
  const fetchData = () => getTagPosts(match.params.tag);
  return <GridView fetchData={fetchData} data={tagPosts} meta={meta} />;
}

Tag.propTypes = {
  match: shape({}).isRequired,
};
