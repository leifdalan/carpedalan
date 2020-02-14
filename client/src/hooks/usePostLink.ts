import { Fragment, ElementType } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { PostsWithTagsWithFakes } from 'hooks/types';

interface UsePostLink {
  Element: ElementType;
  props:
    | {
        to: string;
      }
    | {};
}

const usePostLink = (post: PostsWithTagsWithFakes): UsePostLink => {
  const location = useLocation();
  const galleryLinkPrefix = location.pathname.endsWith('/')
    ? location.pathname
    : `${location.pathname}/`;

  const galleryLink = `${galleryLinkPrefix}gallery/${
    post.id ? post.id.split('-')[0] : ''
  }`;

  const isGallery = location.pathname.includes('gallery');
  const Element = isGallery ? Fragment : Link;
  let props = {};

  if (!isGallery) {
    props = {
      to: galleryLink,
    };
  }
  return { Element, props };
};

export default usePostLink;
