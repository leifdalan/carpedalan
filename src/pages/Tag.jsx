import React, { useContext, useEffect } from 'react';
import { shape } from 'prop-types';

import View from '../components/View';
import { TagPosts } from '../providers/TagPostsProvider';
import { Tag as TagProvider } from '../providers/TagProvider';

export default function Tag({ match, location, history }) {
  const { getTagPosts, tagPosts, meta, clearTags, cache } = useContext(
    TagPosts,
  );

  const { tags } = useContext(TagProvider);

  const fetchData = () => {
    const { id } = tags.find(({ name }) => name === match.params.tagName) || {};
    if (id) {
      getTagPosts(id);
    }
  };

  useEffect(() => {
    if (tags.length) {
      cache.clearAll();
      clearTags();
      fetchData();
    }
  }, [match.params.tagName, tags]);

  return (
    <View
      title={`#${match.params.tagName}`}
      posts={tagPosts}
      cache={cache}
      fetchData={fetchData}
      meta={meta}
      match={match}
      history={history}
      location={location}
    />
  );
}

Tag.propTypes = {
  match: shape({}).isRequired,
  location: shape({}).isRequired,
  history: shape({}).isRequired,
};
