import axios from 'axios';
import debug from 'debug';
import { stringify } from 'qs';
import { useContext, useEffect, useState } from 'react';

import usePrevious from 'hooks/usePrevious';
import { DataContext } from 'providers/Data';

import { PostsWithTagsWithFakes } from './types';
import useApi from './useApi';

const DEFAULT_PAGE_SIZE = 100;

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
  [page: number]: Components.Schemas.PostWithTags[];
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
 *  Return value for custom hook UsePost
 *
 * @interface UsePost
 */
export interface UsePost {
  loading: boolean;
  error: Components.Schemas.Error | null;
  request: (arg: Paths.GetPosts.QueryParameters) => Promise<void>;
  posts: PostsWithTagsWithFakes[];
  response: Components.Schemas.PostList | undefined;
}

/**
 * Post getter API function.
 *
 * @param {Paths.GetPosts.QueryParameters} {
 *   fields = ['key', 'imageHeight', 'imageWidth', 'status'],
 *   order = 'asc',
 *   page = 1,
 *   isPending = false,
 * }
 * @returns {Promise<Paths.GetPosts.Responses.$200>}
 */
const getPosts = async ({
  fields = [
    'key',
    'imageHeight',
    'imageWidth',
    'status',
    'orientation',
    'description',
  ],
  order = 'desc',
  page = 1,
  isPending = false,
}: Paths.GetPosts.QueryParameters): Promise<Paths.GetPosts.Responses.$200> => {
  try {
    log('Getting posts...', { page });
    const queryParams: Paths.GetPosts.QueryParameters = {
      fields,
      page,
      order,
      isPending,
    };
    const response = await axios.get(`/v1/posts?${stringify(queryParams)}`);
    const { data } = response;
    return data;
  } catch (e) {
    if (e.response) throw e.response.data as Components.Schemas.Error;
    throw e as Components.Schemas.Error;
  }
};

/**
 * Custom hook for retrieving posts and managing a list of them.
 * Will return a "fake" list of posts filled in with actual API calls
 * that have occured.
 *
 * @returns {UsePost}
 */
const usePosts = (): UsePost => {
  const { setPosts, data } = useContext(DataContext);

  const { request, response, loading, error } = useApi(getPosts);
  const [postsByPage, setPostsByPage] = useState<PostsByPage>({});
  const [total, setTotal] = useState<number>(0);
  const [allPosts, setAllPosts] = useState<PostsWithTagsWithFakes[]>([]);
  const previousResponse = usePrevious(response);
  useEffect(() => {
    if (response && response !== previousResponse) {
      const newPostsByPage = {
        ...postsByPage,
        [response.meta.page]: response.data,
      };

      setPostsByPage(newPostsByPage);
      if (!total) {
        setTotal(response.meta.count);
      }
      let newAllPosts = [];
      if (!allPosts.length) {
        /**
         * If there are no posts, lets fill an array of length "count" with "fake"
         * posts so that the list viewer can create a reasonably accurate scrollbar
         */
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
  }, [allPosts, postsByPage, previousResponse, response, setPosts, total]);

  return { response, loading, error, request, posts: data.posts };
};

export default usePosts;
