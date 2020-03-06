import { Fragment, ElementType } from 'react';
import { Link } from 'react-router-dom';

import { PostsWithTagsWithFakes } from 'hooks/types';

interface UsePostLink {
  Element: ElementType;
  props:
    | {
        to: string;
      }
    | {};
}

const usePostLink = ({
  post,
  hasLink,
}: {
  post: PostsWithTagsWithFakes;
  hasLink: boolean;
}): UsePostLink => {
  const galleryLink = `gallery/${post.id ? post.id.split('-')[0] : ''}`;

  const Element = hasLink ? Link : Fragment;
  let props = {};

  if (hasLink) {
    props = {
      to: galleryLink,
    };
  }
  return { Element, props };
};

export default usePostLink;
