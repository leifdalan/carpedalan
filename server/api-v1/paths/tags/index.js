import get from './get';
import post from './post';

export default function(tags, redis) {
  return {
    get: get(tags, redis),
    post: post(tags),
  };
}
