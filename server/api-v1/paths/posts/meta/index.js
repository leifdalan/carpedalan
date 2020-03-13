import get from './get';

// Arguments processed by swagger paths have to match dependencies BY NAME
export default function(db) {
  return {
    get: get(db),
  };
}
