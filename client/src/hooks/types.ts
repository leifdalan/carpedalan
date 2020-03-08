import { PostWithTagsI } from 'ApiClient';

/**
 * "Fake" post that hold the fake flag
 *
 * @interface PostsWithTagsWithFakes
 * @extends {PostWithTagsI}
 */
export interface PostsWithTagsWithFakes extends Omit<PostWithTagsI, 'key'> {
  /**
   * Whether or not this post object respresents a "fake" one
   *
   * @type {boolean}
   * @memberof PostsWithTagsWithFakes
   */
  fake: boolean;
  /**
   * Placeholder background rgb value
   *
   * @example rgba(234, 123, 532, 0.4)
   * @type {string}
   * @memberof PostsWithTagsWithFakes
   */
  placeholder: string;
  key?: string;
}
