import get from './get';
import patch from './patch';

export default function(posts) {
  return {
    get: get(posts),
    patch: patch(posts),
  };
}
