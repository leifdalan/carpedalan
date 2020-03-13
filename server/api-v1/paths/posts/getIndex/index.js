import getIndex from './getIndex';

// Arguments processed by swagger paths have to match dependencies BY NAME
export default function(posts) {
  return {
    get: getIndex(posts),
  };
}
