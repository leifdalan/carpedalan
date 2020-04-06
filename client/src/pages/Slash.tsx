import debug from 'debug';
import * as React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Feed from 'components/Feed';
import Gallery from 'components/Gallery';
import Grid from 'components/Grid';
import { PostsWithTagsWithFakes } from 'hooks/types';
import usePosts from 'hooks/usePosts';

const log = debug('component:Slash');

const { useState } = React;

const { useEffect } = React;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

interface RowRender {
  index: number;
  style: React.CSSProperties;
}

const Slash: React.FC = () => {
  const { posts } = usePosts();
  const [postsWithTitle, setPostsWithTitle] = useState<
    PostsWithTagsWithFakes[]
  >(posts);

  const { hash } = useLocation();

  function isGrid() {
    return hash.includes('grid');
  }

  useEffect(() => {
    log('%c post dep changed', 'background: blue;');
    const newPosts = [...posts];
    newPosts.unshift({ fake: false, placeholder: '', key: 'Carpe Dalan' });
    setPostsWithTitle(newPosts);
  }, [posts]);

  return (
    <>
      <Wrapper data-testid="home">
        {isGrid() ? (
          <Grid itemsWithTitle={postsWithTitle} />
        ) : (
          <Feed itemsWithTitle={postsWithTitle} />
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

export default Slash;
