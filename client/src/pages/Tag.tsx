import debug from 'debug';
import * as React from 'react';
import { useParams, useLocation, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

import { client } from 'ApiClient';
import Feed from 'components/Feed';
import Gallery from 'components/Gallery';
import Grid from 'components/Grid';
import { PostsWithTagsWithFakes } from 'hooks/types';
import useApi from 'hooks/useApi';
import { getBg } from 'hooks/usePosts';
import useTags from 'hooks/useTags';

const log = debug('component:Tag');

const { useState } = React;

const { useEffect, useRef } = React;

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
  const { request, response, loading } = useApi(client.getPostsByTag);
  const { tags } = useTags();
  const [postsWithTitle, setPostsWithTitle] = useState<
    PostsWithTagsWithFakes[]
  >([]);
  const wrapperRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef(0);

  const { hash } = useLocation();

  function isGrid() {
    return hash.includes('grid');
  }

  /**
   * Add Title to posts list
   */
  useEffect(() => {
    log('%c post dep changed', 'background: blue;');

    if (response) {
      const newPosts = [...response.data];
      newPosts.unshift({ key: tagName });
      const newPostsWithFake = newPosts.map(post => ({
        ...post,
        fake: false,
        placeholder: getBg(),
      }));

      setPostsWithTitle(newPostsWithFake);
      // addPosts(newPostsWithFake);
    }
  }, [tagName, response]);

  /**
   * Fetch posts by tag when the tags change, or the tagName (route)
   * changes.
   */
  useEffect(() => {
    if (tags.length) {
      const tag = tags.find(tag => tag.name === tagName);
      if (tag?.id) {
        request({
          requestParams: {
            tagId: tag.id,
          },
        });
        gridRef.current += 1;
      }
    }
  }, [tags, tagName, request]);

  log('loading', loading);

  return (
    <>
      {loading ? (
        'loading'
      ) : (
        <Wrapper data-testid="home" ref={wrapperRef}>
          {isGrid() ? (
            <Grid key={tagName} itemsWithTitle={postsWithTitle} />
          ) : (
            <Feed key={tagName} itemsWithTitle={postsWithTitle} />
          )}
        </Wrapper>
      )}
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
