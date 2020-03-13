import debug from 'debug';
import React, { SyntheticEvent, useState, useCallback, useEffect } from 'react';
import styled, { css } from 'styled-components';

import { PostsWithTagsWithFakes } from 'hooks/types';
import { propTrueFalse } from 'styles/utils';
import { getFullImageSrcSet, getSquareImageSrcSet } from 'utils';

const Wrapper = styled.div`
  display: inline-block;
  margin-bottom: -4px;
  overflow: hidden;
`;

interface LoadedPictureI {
  loaded: boolean;
  shouldTransition: boolean;
  transitionTime: number;
}

const log = debug('components:Picture');

const StyledPicture = styled.picture<LoadedPictureI>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    ${({ shouldTransition, transitionTime }) =>
      shouldTransition
        ? css`
            transition-property: opacity;
            transition-duration: ${transitionTime}ms;
          `
        : null}
    opacity: ${propTrueFalse('loaded', 1, 0)};
  }
`;

const SVGWrapper = styled.figure`
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  > svg {
    height: 100%;
    width: 100%;
  }
`;

interface PictureInterface {
  shouldShowImage: boolean;
  width: string;
  ratio: number;
  post: PostsWithTagsWithFakes;
  placeholderColor: string;
  alt: PostsWithTagsWithFakes['description'];
  type: string;
  children?: React.ReactChildren;
}
log('hellzo');
function handleContextMenu(e: SyntheticEvent<HTMLPictureElement>) {
  e.preventDefault();
}

const Picture = ({
  shouldShowImage,
  width,
  ratio,
  post,
  placeholderColor,
  children,
  type,
  ...etc
}: PictureInterface) => {
  const [shouldTransition, setShouldTransition] = useState(true);
  const [loaded, setLoading] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [transitionTime, setTransitionTime] = useState(400);
  const [showSvg, setShowSvg] = useState(false);
  const renderStart = performance.now();

  const handleLoad = useCallback(() => {
    const timeNow = performance.now();
    const timeElapsed = timeNow - renderStart;
    log('timeElapsssszzed for load: ', `${Math.floor(timeElapsed)}ms`);
    if (timeElapsed < 300) setShouldTransition(false);
    const transitionTime = Math.max(200, 600 - timeElapsed);
    log('TransitionTime', transitionTime);
    setTransitionTime(transitionTime);
    setLoading(true);
  }, [renderStart]);

  useEffect(() => {
    const visible = setTimeout(() => {
      setHasBeenVisible(true);
    }, 300);

    const visibleSvg = setTimeout(() => {
      setShowSvg(true);
    }, 50);

    return () => {
      clearTimeout(visible);
      clearTimeout(visibleSvg);
    };
  }, []);

  return (
    <Wrapper
      style={{
        width,
        position: 'relative',
      }}
      {...etc}
    >
      <div
        className="image"
        style={{
          paddingTop: `${ratio * 100}%`,
          position: 'relative',
          backgroundColor: placeholderColor,
          overflow: 'hidden',
        }}
      >
        {post.svg && showSvg ? (
          <SVGWrapper
            dangerouslySetInnerHTML={{
              __html: post.svg.replace(
                '<svg',
                '<svg preserveAspectRatio="xMidYMid slice"', // deal with it
              ),
            }}
          />
        ) : null}

        {(shouldShowImage || loaded || hasBeenVisible) && !post.fake ? (
          <StyledPicture
            onLoad={handleLoad}
            as="picture"
            loaded={loaded}
            onContextMenu={handleContextMenu}
            shouldTransition={shouldTransition}
            transitionTime={transitionTime}
            data-test={post.key}
          >
            {type === 'original'
              ? getFullImageSrcSet({ post })
              : getSquareImageSrcSet({ post })}
          </StyledPicture>
        ) : null}
        {children}
      </div>
    </Wrapper>
  );
};

export default Picture;
