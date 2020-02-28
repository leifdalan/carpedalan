import get from './get';
import post from './post';

// Arguments processed by swagger paths have to match dependencies BY NAME
export default function(posts, redis) {
  return {
    get: get(posts, redis),
    post: post(posts, redis),
  };
}
