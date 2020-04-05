import debug from 'debug';
import * as React from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Feed from 'components/Feed';
import Gallery from 'components/Gallery';
import Grid from 'components/Grid';
import Menu from 'components/Menu';
import { PostsWithTagsWithFakes } from 'hooks/types';
import usePosts from 'hooks/usePosts';
import GridIcon from 'styles/GridIcon';
import PhotoIcon from 'styles/PhotoIcon';

const log = debug('component:Slash');

const { useState } = React;

// const LazyGallery = lazy(() =>
//   import(/* webpackChunkName: "gallery" */ 'components/Gallery'),
// );

const { useEffect } = React;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledLink = styled(Link)`
  color: black;
  display: flex;
  align-items: center;
  padding: 4px;
  span {
    padding-right: 8px;
  }
`;

interface RowRender {
  index: number;
  style: React.CSSProperties;
}

const Slash: React.FC = () => {
  const { posts, metaRequest, metaResponse, metaLoading } = usePosts();
  const [postsWithTitle, setPostsWithTitle] = useState<
    PostsWithTagsWithFakes[]
  >(posts);

  const { hash, pathname } = useLocation();

  function isGrid() {
    return hash.includes('grid');
  }

  useEffect(() => {
    metaRequest(undefined);
  }, [metaRequest]);

  useEffect(() => {
    log('%c post dep changed', 'background: blue;');
    const newPosts = [...posts];
    newPosts.unshift({ fake: false, placeholder: '', key: 'Carpe Dalan' });
    setPostsWithTitle(newPosts);
  }, [posts]);

  return metaResponse && !metaLoading ? (
    <>
      <Menu side="right">
        <StyledLink to={`${pathname}${hash.includes('grid') ? '' : '#grid'}`}>
          <span>{hash.includes('grid') ? 'List' : 'Grid'}</span>
          {!hash.includes('grid') ? <GridIcon /> : <PhotoIcon />}
        </StyledLink>
      </Menu>
      {metaResponse ? (
        <Wrapper data-testid="home">
          {isGrid() ? (
            <Grid itemsWithTitle={postsWithTitle} />
          ) : (
            <Feed itemsWithTitle={postsWithTitle} />
          )}
        </Wrapper>
      ) : null}
      <Routes>
        <Route
          path="gallery/:postId"
          element={<Gallery posts={postsWithTitle} />}
        />
      </Routes>
    </>
  ) : null;
};

export default Slash;
