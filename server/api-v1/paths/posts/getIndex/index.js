import getIndex from './getIndex';

// Arguments processed by swagger paths have to match dependencies BY NAME
export default function(db) {
  return {
    get: getIndex(db),
  };
}
