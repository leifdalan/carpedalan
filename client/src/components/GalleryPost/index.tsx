import debug from 'debug';
import React, { useCallback, useState, useMemo } from 'react';
import { useLocation, useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import { useSwipeable, SwipeCallback } from 'react-swipeable';
import styled from 'styled-components';

import Picture from 'components/Picture';
import { PostsWithTagsWithFakes } from 'hooks/types';
import usePostLink from 'hooks/usePostLink';
import useWindow from 'hooks/useWindow';
import FlexContainer, { FlexEnums } from 'styles/FlexContainer';
import {
  BRAND_COLOR,
  formatDate,
  getThemeValue,
  TITLE_FONT,
  prop,
} from 'styles/utils';
import { getImageRatio, getOriginalImagePath } from 'utils';

const log = debug('components:Gallery');

const TRANSITION_TIME = 200;
const TRANSITION_TIME_MS = `${TRANSITION_TIME}ms`;

const NextPrev = styled.article`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
  flex-direction: column;
`;

const Description = styled.div`
  li {
    list-style: none;
    padding: 0;
    display: inline-block;
    margin-right: 0.25em;
  }
  ul {
    margin: 0;
    padding: 0;
  }
  a {
    color: ${getThemeValue('brandColor')};
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${getThemeValue('neutralColor')};
`;

const Download = styled.a`
  color: ${getThemeValue(BRAND_COLOR)};
  font-family: ${getThemeValue(TITLE_FONT)};
  text-transform: uppercase;
  text-decoration: none;
`;

const Header = styled(FlexContainer)<{ width?: string }>`
  background-color: rgba(255, 235, 250, 0.5);
  align-items: center;
  padding: 1em;
  width: ${prop('width')};
  align-self: center;
`;

const Article = styled.article`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  align-items: center;
`;

interface PostI {
  post: PostsWithTagsWithFakes;
  isSquare?: boolean;
  width?: string;
  safeRef?: React.MutableRefObject<HTMLElement | null>;
  hasLink: boolean;
  posts: PostsWithTagsWithFakes[];
}

const PostBody = ({
  post,
  isSquare = false,
  width = '100%',
  safeRef,
  hasLink,
}: Omit<PostI, 'posts'>) => {
  const { Element, props } = usePostLink({ post, hasLink });
  return (
    <>
      <Header
        width={width}
        ref={safeRef}
        as="header"
        justifyContent={FlexEnums.spaceBetween}
      >
        <Download data-test="date" as="div">
          {post.timestamp ? formatDate(post.timestamp) : null}
        </Download>
        <Download data-test="download" href={getOriginalImagePath({ post })}>
          Download
        </Download>
      </Header>
      <Element {...props}>
        <Picture
          width={width}
          ratio={isSquare ? 1 : getImageRatio(post)}
          post={post}
          shouldShowImage
          placeholderColor={post.placeholder}
          alt={post.description}
          type={isSquare ? 'square' : 'original'}
        />
      </Element>
      {post.description || post.tags?.length ? (
        <Header
          width={width}
          as="header"
          justifyContent={FlexEnums.spaceBetween}
        >
          <Description>
            {post.description ? (
              <figcaption data-test="description">
                {post.description}
              </figcaption>
            ) : null}
            {post.tags?.length ? (
              <ul>
                {post.tags.map(({ name }) => (
                  <li data-test="tags" key={name}>
                    <StyledLink to={`/tag/${name}`}>{`#${name}`}</StyledLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </Description>
        </Header>
      ) : null}
    </>
  );
};

const Post = ({
  post,
  isSquare = false,
  width = '100%',
  safeRef,
  hasLink,
  posts,
}: PostI) => {
  const { width: windowWidth } = useWindow();
  const navigate = useNavigate();
  /**
   * @TODO get this any after react router updates
   */
  const params = useParams() as any;
  const [swipe, setSwipe] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const location = useLocation();

  const [previousPost, nextPost] = useMemo(() => {
    const postIndex = posts.findIndex(({ id }) => id === post.id);
    log('post index', postIndex);
    return [posts[postIndex - 1], posts[postIndex + 1]];
  }, [post.id, posts]);

  const handleSwiping = useCallback<SwipeCallback>(
    eventData => {
      if (!previousPost && eventData.deltaX < 0) {
        setSwipe(eventData.deltaX / 4);
      } else if (!nextPost && eventData.deltaX > 0) {
        setSwipe(eventData.deltaX / 4);
      } else {
        setSwipe(eventData.deltaX);
      }

      if (!isSwiping) setIsSwiping(true);
    },
    [isSwiping, nextPost, previousPost],
  );

  const handleSwiped = useCallback<SwipeCallback>(
    eventData => {
      setIsSwiping(false);
      log('DElta', eventData.deltaX);
      if (
        nextPost &&
        eventData.deltaX > 0 &&
        (eventData.deltaX > 100 || eventData.velocity > 0.5)
      ) {
        setSwipe(windowWidth);
        const galleryLink = location.pathname.replace(
          `${params?.postId.split('-')[0]}`,
          nextPost?.id?.split('-')[0] ?? '',
        );
        setTimeout(() => {
          navigate(`${galleryLink}${location.hash}`);
          setIsSwiping(true);
          setSwipe(0);
        }, TRANSITION_TIME);
      } else if (
        previousPost &&
        eventData.deltaX < 0 &&
        (eventData.deltaX < -100 || eventData.velocity > 0.5)
      ) {
        setSwipe(-windowWidth);
        const galleryLink = location.pathname.replace(
          `${params?.postId.split('-')[0]}`,
          previousPost?.id?.split('-')[0] ?? '',
        );
        setTimeout(() => {
          navigate(`${galleryLink}${location.hash}`);
          setIsSwiping(true);
          setSwipe(0);
        }, TRANSITION_TIME);
      } else {
        setSwipe(0);
      }

      log('done swiping');
    },
    [
      location.hash,
      location.pathname,
      navigate,
      nextPost,
      params,
      previousPost,
      windowWidth,
    ],
  );

  const handlers = useSwipeable({
    onSwiping: handleSwiping,
    trackMouse: true,
    onSwiped: handleSwiped,
    preventDefaultTouchmoveEvent: true,
  });

  const percentage = Math.abs(swipe / windowWidth);

  return (
    <>
      {previousPost && swipe < 0 ? (
        <NextPrev
          style={{
            transform: `scale(${0.5 + percentage * 0.5})`,
            opacity: percentage,
            ...(!isSwiping
              ? { transition: `transform ${TRANSITION_TIME_MS} ease-out` }
              : {}),
          }}
        >
          <PostBody
            post={previousPost}
            hasLink={hasLink}
            isSquare={isSquare}
            width={width}
          />
        </NextPrev>
      ) : null}
      <Article
        {...handlers}
        style={{
          transform: `translate(${-swipe}px)`,
          opacity: 1 - percentage,
          ...(!isSwiping
            ? {
                opacity: 1 - percentage,
                transition: `transform ${TRANSITION_TIME_MS} ease-out, opacity ${TRANSITION_TIME_MS} ease-out`,
              }
            : {}),
        }}
      >
        <PostBody
          post={post}
          hasLink={hasLink}
          isSquare={isSquare}
          width={width}
          safeRef={safeRef}
        />
      </Article>
      {nextPost && swipe > 0 ? (
        <NextPrev
          style={{
            transform: `scale(${0.5 + percentage * 0.5})`,
            opacity: percentage,
            ...(!isSwiping
              ? { transition: `transform ${TRANSITION_TIME_MS} ease-out` }
              : {}),
          }}
        >
          <PostBody
            post={nextPost}
            hasLink={hasLink}
            isSquare={isSquare}
            width={width}
          />
        </NextPrev>
      ) : null}
    </>
  );
};

export default Post;
