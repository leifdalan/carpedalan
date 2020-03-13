import { PostWithTagsI } from 'ApiClient';
/**
 * @TODO figure out this `any`..... Can't use union types
 */
export type RequestObject = any;

export type RetryTuple = [
  (args: RequestObject) => Promise<void>,
  RequestObject,
];

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

// export declare function ApiRequest(args: BodyOnly<object>): Promise<void>;
// export declare function ApiRequest(args: PathOnly<object>): Promise<void>;
// export declare function ApiRequest(
//   args: BodyAndPath<object, object>,
// ): Promise<void>;

// export declare function ApiRequest(args: undefined): Promise<void>;

// export type RetryTuple = [typeof ApiRequest, object];
