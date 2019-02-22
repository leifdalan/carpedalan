import get from './get';
import post from './post';

export default function(posts) {
  console.error('args', posts);

  return {
    get: get(posts),
    post: post(posts),
  };
}
