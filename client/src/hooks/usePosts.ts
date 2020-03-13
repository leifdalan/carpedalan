import debug from 'debug';
import { useContext, useEffect, useState, useCallback } from 'react';

import { client, PostWithTagsI } from 'ApiClient';
import { defaultPostsPerPage } from 'config';
import usePrevious from 'hooks/usePrevious';
import { DataContext } from 'providers/Data';

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

/**
 * Dictionary of api calls keyed by page number
 *
 * @interface PostsByPage
 */
interface PostsByPage {
  [page: number]: PostWithTagsI[];
}

/**
 * Converts existing post list by page into an array, assuming
 * the fake post array has been filled with all fakes.
 *
 * @param {PostsWithTagsWithFakes[]} existingPostList
 * @param {PostsByPage} postsByPage
 * @returns {PostsWithTagsWithFakes[]}
 */
function makePostsListWithFakes(
  existingPostList: PostsWithTagsWithFakes[],
  postsByPage: PostsByPage,
): PostsWithTagsWithFakes[] {
  return existingPostList.map((post, idx) => {
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

let postsByPage: PostsByPage = {};
const pagesRequested = new Set<number>();
function usePosts() {
  const { setPosts, data } = useContext(DataContext);

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

  const {
    request: metaRequest,
    response: metaResponse,
    loading: metaLoading,
  } = useApi(client.getPostMeta);

  const [total, setTotal] = useState<number>(0);
  const [allPosts, setAllPosts] = useState<PostsWithTagsWithFakes[]>([]);
  const previousResponse = usePrevious(response);

  useEffect(() => {
    if (metaResponse) {
      const allPostsWithTagsWithFakess = [
        ...Array(metaResponse.count).keys(),
      ].map(
        (num): PostsWithTagsWithFakes => ({
          key: `${num}`,
          fake: true,
          imageHeight: `${metaResponse.averageRatio * 100}`,
          imageWidth: '100',
          placeholder: getBg(),
        }),
      );
      setAllPosts(allPostsWithTagsWithFakess);
      log('setAllPosts');
      setPosts(allPostsWithTagsWithFakess);
      if (metaResponse?.count) {
        setTotal(metaResponse.count);
      }
    }
  }, [metaRequest, metaResponse, setPosts]);

  useEffect(() => {
    log('response', response, allPosts.length);
    if (response && response !== previousResponse) {
      const newPostsByPage = {
        ...postsByPage,
        [response.meta.page]: response.data,
      };

      postsByPage = newPostsByPage;
      if (!total) {
        setTotal(response.meta.count);
      }
      let newAllPosts = [];
      if (!allPosts.length) {
        /**
         * If there are no posts, lets fill an array of length "count" with "fake"
         * posts so that the list viewer can create a reasonably accurate scrollbar
         */
        log('making new');
        const allPostsWithTagsWithFakess = [
          ...Array(response.meta.count).keys(),
        ].map(
          (num): PostsWithTagsWithFakes => ({
            key: `${num}`,
            fake: true,
            imageHeight: '100',
            imageWidth: '100',
            placeholder: getBg(),
          }),
        );
        newAllPosts = makePostsListWithFakes(
          allPostsWithTagsWithFakess,
          newPostsByPage,
        );
      } else {
        newAllPosts = makePostsListWithFakes(allPosts, newPostsByPage);
      }
      log('setting new posts');
      setAllPosts(newAllPosts);
      setPosts(newAllPosts);
    }
  }, [allPosts, previousResponse, response, setPosts, total]);

  return {
    response,
    loading,
    error,
    request,
    posts: data.posts,
    metaRequest,
    metaResponse,
    metaLoading,
  };
}

export default usePosts;
