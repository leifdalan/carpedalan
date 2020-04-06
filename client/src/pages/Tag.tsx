import debug from 'debug';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useLocation, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

import { client } from 'ApiClient';
import Feed from 'components/Feed';
import Gallery from 'components/Gallery';
import Grid from 'components/Grid';
import { PostsWithTagsWithFakes } from 'hooks/types';
import useApi from 'hooks/useApi';
import usePosts, { getBg, getFakePosts } from 'hooks/usePosts';
import useTags from 'hooks/useTags';

``;

const log = debug('component:Tag');

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

/**
 * Tag view. Gets posts by tag based on the route param. Will
 * update view when the route param changes, and make another request
 * @param {RouteComponentProps<{ tagName: string }>} props
 * @returns {React.ReactElement}
 */
const Tag = (): React.ReactElement => {
  const { tagName } = useParams();
  const { request, response } = useApi(client.getPostsByTag);
  const { allFakes } = usePosts();
  const { tags } = useTags();
  const tag = useMemo(() => {
    return tags.find(tag => tag.name === tagName);
  }, [tagName, tags]);

  const makeItFake = useCallback(() => {
    return [
      { key: tagName, fake: true, placeholder: getBg() },
      ...getFakePosts(tag?.count || 0),
    ];
  }, [tag, tagName]);
  // Just use the master post list as a placeholder
  const [postsWithTitle, setPostsWithTitle] = useState<
    PostsWithTagsWithFakes[]
  >(makeItFake());

  const { hash } = useLocation();

  const isGrid = useMemo(() => hash.includes('grid'), [hash]);

  /**
   * Add Title to posts list
   */
  useEffect(() => {
    log('%c post dep changed', 'background: blue;');

    if (response) {
      const [first, ...rest] = postsWithTitle;
      const newPostsWithFake = response.data.map((post, i) => ({
        ...rest[i],
        ...post,
        fake: false,
      }));

      setPostsWithTitle([first, ...newPostsWithFake]);
      // addPosts(newPostsWithFake);
    }
  }, [tagName, response]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Fetch posts by tag when the tags change, or the tagName (route)
   * changes.
   */
  useEffect(() => {
    if (tags.length) {
      setPostsWithTitle(makeItFake());
      const tag = tags.find(tag => tag.name === tagName);
      if (tag?.id) {
        request({
          requestParams: {
            tagId: tag.id,
          },
        });
      }
    }
  }, [tags, tagName, request, allFakes, makeItFake]);
  log('postsWithTitle', postsWithTitle);
  return (
    <>
      <Wrapper data-testid="home">
        {isGrid ? (
          <Grid key={tagName} itemsWithTitle={postsWithTitle} />
        ) : (
          <Feed key={tagName} itemsWithTitle={postsWithTitle} />
        )}
      </Wrapper>

      <Routes>
        <Route
          path="gallery/:postId"
          element={<Gallery posts={postsWithTitle} />}
        />
      </Routes>
    </>
  );
};

export default Tag;
