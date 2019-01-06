import React, { useContext, useEffect } from 'react';
import { shape } from 'prop-types';

import { TagPosts } from '../providers/TagPostsProvider';
import GridView from '../components/GridView';
import Title from '../styles/Title';

export default function Tag({ match }) {
  const { getTagPosts, tagPosts, meta, clearTags } = useContext(TagPosts);
  useEffect(
    () => {
      clearTags();
    },
    [match.params.tag],
  );
  const fetchData = () => getTagPosts(match.params.tag);

  return (
    <>
      <Title center>{match.params.tag}</Title>
      <GridView
        fetchData={fetchData}
        data={tagPosts}
        meta={meta}
        type={match.params.tag}
      />
    </>
  );
}

Tag.propTypes = {
  match: shape({}).isRequired,
};
