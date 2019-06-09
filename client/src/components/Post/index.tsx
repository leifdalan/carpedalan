import Picture from 'components/Picture';
import { PostsWithTagsWithFakes } from 'hooks/usePosts';
import * as React from 'react';
import { getImageRatio } from 'utils';

const Row = ({
  post,
  isSquare = false,
}: {
  post: PostsWithTagsWithFakes;
  isSquare?: boolean;
}) => {
  return (
    <Picture
      width="100%"
      ratio={isSquare ? 1 : getImageRatio(post)}
      post={post}
      shouldShowImage={true}
      placeholderColor={post.placeholder}
      alt={post.description}
      type={isSquare ? 'square' : 'original'}
    />
  );
};

export default Row;
