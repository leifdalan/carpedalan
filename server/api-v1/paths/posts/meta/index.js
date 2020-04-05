import get from './get';

// Arguments processed by swagger paths have to match dependencies BY NAME
export default function(db, redis) {
  return {
    get: get(db, redis),
  };
}
