import get from './get';

export default function(posts, redis) {
  return {
    get: get(posts, redis),
  };
}
