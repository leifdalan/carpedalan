import debug from 'debug';
import { useEffect, useState, useCallback } from 'react';

import { client, PostWithTagsI, GetPostMetaResponseBodyI } from 'ApiClient';
import { defaultPostsPerPage } from 'config';

import { PostsWithTagsWithFakes } from './types';
import useApi from './useApi';

const DEFAULT_PAGE_SIZE = defaultPostsPerPage;

const log = debug('hooks:usePosts');

/**
 * Get a random rgb color used for background of images before they load
 *
 * @returns {string}
 */
export function getBg(): string {
  const x = Math.floor(Math.random() * 256);
  const y = Math.floor(Math.random() * 256);
  const z = Math.floor(Math.random() * 256);
  return `rgba(${x},${y},${z}, 0.4)`;
}

/* eslint-disable no-underscore-dangle */
const globalMeta: GetPostMetaResponseBodyI = window.__META__.posts;

/**
 * Dictionary of api calls keyed by page number
 *
 * @interface PostsByPage
 */
interface PostsByPage {
  [page: number]: PostWithTagsI[];
}

export function getFakePosts(numberOfPosts: number) {
  return [
    ...Array(numberOfPosts)
      .fill(1)
      .keys(),
  ].map(
    (num): PostsWithTagsWithFakes => ({
      key: `${num}`,
      fake: true,
      imageHeight: `100`,
      imageWidth: '100',
      placeholder: getBg(),
    }),
  );
}
const allFakes = getFakePosts(globalMeta.count);

let globalPosts: PostsWithTagsWithFakes[] = allFakes;
let postsByPage: PostsByPage = {};
type SetPost = (posts: PostsWithTagsWithFakes[]) => void;
let postSetters: SetPost[] = [];

const globalSetPosts = (newPosts: PostsWithTagsWithFakes[]) => {
  postSetters.forEach(setter => {
    globalPosts = newPosts;
    setter(globalPosts);
  });
};
/**
 * Converts existing post list by page into an array, assuming
 * the fake post array has been filled with all fakes.
 *
 * @returns {PostsWithTagsWithFakes[]}
 */
function makePostsListWithFakes(): PostsWithTagsWithFakes[] {
  return globalPosts.map((post, idx) => {
    const possiblePage = Math.floor(idx / DEFAULT_PAGE_SIZE) + 1;

    if (postsByPage[possiblePage]) {
      return {
        ...post,
        ...postsByPage[possiblePage][
          idx - DEFAULT_PAGE_SIZE * (possiblePage - 1)
        ],
        fake: false,
      };
    }
    // otherwise, return fake post
    return post;
  });
}

/**
 * Custom hook for retrieving posts and managing a list of them.
 * Will return a "fake" list of posts filled in with actual API calls
 * that have occured.
 *
 * @returns {UsePost}
 */

const pagesRequested = new Set<number>();

function usePosts() {
  const [posts, setPosts] = useState(globalPosts);

  if (!postSetters.includes(setPosts)) {
    postSetters.push(setPosts);
  }

  useEffect(() => {
    return () => {
      postSetters = postSetters.filter(setter => setter !== setPosts);
    };
  }, [setPosts]);

  const { request: apiRequest, response, loading, error } = useApi(
    client.getPosts,
  );

  const request = useCallback(
    async (args: Parameters<typeof apiRequest>[0]) => {
      const pageRequested = args.requestBody.page || -1;
      if (!pagesRequested.has(pageRequested)) {
        pagesRequested.add(pageRequested);
        try {
          await apiRequest(args);
        } catch (e) {
          pagesRequested.delete(pageRequested);
          throw e;
        }
      }
      return Promise.resolve();
    },
    [apiRequest],
  );

  useEffect(() => {
    if (response) {
      postsByPage = {
        ...postsByPage,
        [response.meta.page]: response.data,
      };
      const newPosts = makePostsListWithFakes();
      globalSetPosts(newPosts);
    }
  }, [response]);

  return {
    response,
    loading,
    error,
    request,
    posts,
    meta: globalMeta,
    allFakes,
  };
}

export default usePosts;
