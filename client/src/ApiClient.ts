
  
import axios from 'axios';
import { stringify } from 'qs';

interface BodyOnly<T> {
  requestBody: T;
}

interface PathOnly<T> {
  requestParams: T;
}

interface BodyAndPath<T, U> {
  requestBody: T;
  requestParams: U;
}
export interface PostI {
  id?: string;
  rotate?: 0 | 90 | 180 | 270;
  /**
   * Integer unix epoch timestamp
   */
  timestamp?: number;
  /**
   * Date time from legacy tumblr images
   */
  date?: string;
  /**
   * Original URL from legacy tumblr images
   */
  originalUrl?: string;
  /**
   * Descrtipion/caption for the post
   */
  description?: string;
  key: string;
  status?: "active" | "deleted";
  createdAt?: string;
  updatedAt?: string;
  isPending?: boolean;
  tags?: string[];
  etag?: string;
  /**
   * exif data extracted
   */
  apertureValue?: string;
  /**
   * exif data brightnessValue
   */
  brightnessValue?: string;
  /**
   * exif data colorSpace
   */
  colorSpace?: string;
  /**
   * exif data contrast
   */
  contrast?: string;
  /**
   * exif data createDate
   */
  createDate?: string;
  /**
   * exif data customRendered
   */
  customRendered?: string;
  /**
   * exif data dateTimeOriginal
   */
  dateTimeOriginal?: string;
  /**
   * exif data digitalZoomRatio
   */
  digitalZoomRatio?: string;
  /**
   * exif data exifImageHeight
   */
  exifImageHeight?: string;
  /**
   * exif data exifImageWidth
   */
  exifImageWidth?: string;
  /**
   * exif data exposureCompensation
   */
  exposureCompensation?: string;
  /**
   * exif data exposureMode
   */
  exposureMode?: string;
  /**
   * exif data exposureProgram
   */
  exposureProgram?: string;
  /**
   * exif data exposureTime
   */
  exposureTime?: string;
  /**
   * exif data flash
   */
  flash?: string;
  /**
   * exif data fNumber
   */
  fNumber?: string;
  /**
   * exif data focalLength
   */
  focalLength?: string;
  /**
   * exif data focalLengthIn35mmFormat
   */
  focalLengthIn35mmFormat?: string;
  /**
   * exif data gpsAltitude
   */
  gpsAltitude?: string;
  /**
   * exif data gpsAltitudeRef
   */
  gpsAltitudeRef?: string;
  /**
   * exif data gpsDateStamp
   */
  gpsDateStamp?: string;
  /**
   * exif data gpsDOP
   */
  gpsDOP?: string;
  /**
   * exif data gpsLatitude
   */
  gpsLatitude?: string;
  /**
   * exif data gpsLatitudeRef
   */
  gpsLatitudeRef?: string;
  /**
   * exif data gpsLongitude
   */
  gpsLongitude?: string;
  /**
   * exif data gpsLongitudeRef
   */
  gpsLongitudeRef?: string;
  /**
   * exif data gpsTimeStamp
   */
  gpsTimeStamp?: string;
  /**
   * exif data gpsVersionID
   */
  gpsVersionID?: string;
  /**
   * exif data extracted for imageHeight
   */
  imageHeight?: string;
  /**
   * exif data extracted for imageWidth
   */
  imageWidth?: string;
  /**
   * exif data extracted for interopIndex
   */
  interopIndex?: string;
  /**
   * exif data extracted for ISO
   */
  ISO?: string;
  /**
   * exif data extracted for make
   */
  make?: string;
  /**
   * exif data extracted for maxApertureValue
   */
  maxApertureValue?: string;
  /**
   * exif data extracted for meteringMode
   */
  meteringMode?: string;
  /**
   * exif data extracted for model
   */
  model?: string;
  /**
   * exif data extracted for modifyDate
   */
  modifyDate?: string;
  /**
   * exif data extracted for orientation
   */
  orientation?: string;
  /**
   * exif data extracted for resolutionUnit
   */
  resolutionUnit?: string;
  /**
   * exif data extracted for saturation
   */
  saturation?: string;
  /**
   * exif data extracted for sceneCaptureType
   */
  sceneCaptureType?: string;
  /**
   * exif data extracted for sensingMethod
   */
  sensingMethod?: string;
  /**
   * exif data extracted for sharpness
   */
  sharpness?: string;
  /**
   * exif data extracted for shutterSpeedValue
   */
  shutterSpeedValue?: string;
  /**
   * exif data extracted for software
   */
  software?: string;
  /**
   * exif data extracted for subjectDistance
   */
  subjectDistance?: string;
  /**
   * exif data extracted for subjectDistanceRange
   */
  subjectDistanceRange?: string;
  /**
   * exif data extracted for subSecTime
   */
  subSecTime?: string;
  /**
   * exif data extracted for subSecTimeDigitized
   */
  subSecTimeDigitized?: string;
  /**
   * exif data extracted for subSecTimeOriginal
   */
  subSecTimeOriginal?: string;
  /**
   * exif data extracted for whiteBalance
   */
  whiteBalance?: string;
  /**
   * exif data extracted for xResolution
   */
  xResolution?: string;
  /**
   * exif data extracted for yCbCrPositioning
   */
  yCbCrPositioning?: string;
  /**
   * exif data extracted for yResolution
   */
  yResolution?: string;
}

export interface PostWithTagsI {
  id?: string;
  rotate?: 0 | 90 | 180 | 270;
  /**
   * Integer unix epoch timestamp
   */
  timestamp?: number;
  /**
   * Date time from legacy tumblr images
   */
  date?: string;
  /**
   * Original URL from legacy tumblr images
   */
  originalUrl?: string;
  /**
   * Descrtipion/caption for the post
   */
  description?: string;
  key: string;
  status?: "active" | "deleted";
  createdAt?: string;
  updatedAt?: string;
  isPending?: boolean;
  tags?: {
    /**
     * uuid of tag record
     */
    id?: string;
    /**
     * Name of tag
     */
    name?: string;
    [k: string]: any;
  }[];
  etag?: string;
  /**
   * exif data extracted
   */
  apertureValue?: string;
  /**
   * exif data brightnessValue
   */
  brightnessValue?: string;
  /**
   * exif data colorSpace
   */
  colorSpace?: string;
  /**
   * exif data contrast
   */
  contrast?: string;
  /**
   * exif data createDate
   */
  createDate?: string;
  /**
   * exif data customRendered
   */
  customRendered?: string;
  /**
   * exif data dateTimeOriginal
   */
  dateTimeOriginal?: string;
  /**
   * exif data digitalZoomRatio
   */
  digitalZoomRatio?: string;
  /**
   * exif data exifImageHeight
   */
  exifImageHeight?: string;
  /**
   * exif data exifImageWidth
   */
  exifImageWidth?: string;
  /**
   * exif data exposureCompensation
   */
  exposureCompensation?: string;
  /**
   * exif data exposureMode
   */
  exposureMode?: string;
  /**
   * exif data exposureProgram
   */
  exposureProgram?: string;
  /**
   * exif data exposureTime
   */
  exposureTime?: string;
  /**
   * exif data flash
   */
  flash?: string;
  /**
   * exif data fNumber
   */
  fNumber?: string;
  /**
   * exif data focalLength
   */
  focalLength?: string;
  /**
   * exif data focalLengthIn35mmFormat
   */
  focalLengthIn35mmFormat?: string;
  /**
   * exif data gpsAltitude
   */
  gpsAltitude?: string;
  /**
   * exif data gpsAltitudeRef
   */
  gpsAltitudeRef?: string;
  /**
   * exif data gpsDateStamp
   */
  gpsDateStamp?: string;
  /**
   * exif data gpsDOP
   */
  gpsDOP?: string;
  /**
   * exif data gpsLatitude
   */
  gpsLatitude?: string;
  /**
   * exif data gpsLatitudeRef
   */
  gpsLatitudeRef?: string;
  /**
   * exif data gpsLongitude
   */
  gpsLongitude?: string;
  /**
   * exif data gpsLongitudeRef
   */
  gpsLongitudeRef?: string;
  /**
   * exif data gpsTimeStamp
   */
  gpsTimeStamp?: string;
  /**
   * exif data gpsVersionID
   */
  gpsVersionID?: string;
  /**
   * exif data extracted for imageHeight
   */
  imageHeight?: string;
  /**
   * exif data extracted for imageWidth
   */
  imageWidth?: string;
  /**
   * exif data extracted for interopIndex
   */
  interopIndex?: string;
  /**
   * exif data extracted for ISO
   */
  ISO?: string;
  /**
   * exif data extracted for make
   */
  make?: string;
  /**
   * exif data extracted for maxApertureValue
   */
  maxApertureValue?: string;
  /**
   * exif data extracted for meteringMode
   */
  meteringMode?: string;
  /**
   * exif data extracted for model
   */
  model?: string;
  /**
   * exif data extracted for modifyDate
   */
  modifyDate?: string;
  /**
   * exif data extracted for orientation
   */
  orientation?: string;
  /**
   * exif data extracted for resolutionUnit
   */
  resolutionUnit?: string;
  /**
   * exif data extracted for saturation
   */
  saturation?: string;
  /**
   * exif data extracted for sceneCaptureType
   */
  sceneCaptureType?: string;
  /**
   * exif data extracted for sensingMethod
   */
  sensingMethod?: string;
  /**
   * exif data extracted for sharpness
   */
  sharpness?: string;
  /**
   * exif data extracted for shutterSpeedValue
   */
  shutterSpeedValue?: string;
  /**
   * exif data extracted for software
   */
  software?: string;
  /**
   * exif data extracted for subjectDistance
   */
  subjectDistance?: string;
  /**
   * exif data extracted for subjectDistanceRange
   */
  subjectDistanceRange?: string;
  /**
   * exif data extracted for subSecTime
   */
  subSecTime?: string;
  /**
   * exif data extracted for subSecTimeDigitized
   */
  subSecTimeDigitized?: string;
  /**
   * exif data extracted for subSecTimeOriginal
   */
  subSecTimeOriginal?: string;
  /**
   * exif data extracted for whiteBalance
   */
  whiteBalance?: string;
  /**
   * exif data extracted for xResolution
   */
  xResolution?: string;
  /**
   * exif data extracted for yCbCrPositioning
   */
  yCbCrPositioning?: string;
  /**
   * exif data extracted for yResolution
   */
  yResolution?: string;
  svg?: string;
}

/**
 * Tag entity
 */
export interface TagI {
  /**
   * uuid of tag record
   */
  id?: string;
  /**
   * Name of tag
   */
  name?: string;
  [k: string]: any;
}

export interface ErrorI {
  /**
   * HTTP status code of response
   */
  status?: number;
  /**
   * Human readable explanation of error
   */
  message?: string;
  /**
   * Array of errors that provide explanation
   */
  errors?: {
    /**
     * Coded error type
     */
    type?: string;
    /**
     * Path of field or property that is in question
     */
    path?: string;
    /**
     * Human readable error message
     */
    message?: string;
    [k: string]: any;
  }[];
  [k: string]: any;
}

export interface PostListI {
  /**
   * Array of posts
   */
  data: {
    id?: string;
    rotate?: 0 | 90 | 180 | 270;
    /**
     * Integer unix epoch timestamp
     */
    timestamp?: number;
    /**
     * Date time from legacy tumblr images
     */
    date?: string;
    /**
     * Original URL from legacy tumblr images
     */
    originalUrl?: string;
    /**
     * Descrtipion/caption for the post
     */
    description?: string;
    key: string;
    status?: "active" | "deleted";
    createdAt?: string;
    updatedAt?: string;
    isPending?: boolean;
    tags?: {
      /**
       * uuid of tag record
       */
      id?: string;
      /**
       * Name of tag
       */
      name?: string;
      [k: string]: any;
    }[];
    etag?: string;
    /**
     * exif data extracted
     */
    apertureValue?: string;
    /**
     * exif data brightnessValue
     */
    brightnessValue?: string;
    /**
     * exif data colorSpace
     */
    colorSpace?: string;
    /**
     * exif data contrast
     */
    contrast?: string;
    /**
     * exif data createDate
     */
    createDate?: string;
    /**
     * exif data customRendered
     */
    customRendered?: string;
    /**
     * exif data dateTimeOriginal
     */
    dateTimeOriginal?: string;
    /**
     * exif data digitalZoomRatio
     */
    digitalZoomRatio?: string;
    /**
     * exif data exifImageHeight
     */
    exifImageHeight?: string;
    /**
     * exif data exifImageWidth
     */
    exifImageWidth?: string;
    /**
     * exif data exposureCompensation
     */
    exposureCompensation?: string;
    /**
     * exif data exposureMode
     */
    exposureMode?: string;
    /**
     * exif data exposureProgram
     */
    exposureProgram?: string;
    /**
     * exif data exposureTime
     */
    exposureTime?: string;
    /**
     * exif data flash
     */
    flash?: string;
    /**
     * exif data fNumber
     */
    fNumber?: string;
    /**
     * exif data focalLength
     */
    focalLength?: string;
    /**
     * exif data focalLengthIn35mmFormat
     */
    focalLengthIn35mmFormat?: string;
    /**
     * exif data gpsAltitude
     */
    gpsAltitude?: string;
    /**
     * exif data gpsAltitudeRef
     */
    gpsAltitudeRef?: string;
    /**
     * exif data gpsDateStamp
     */
    gpsDateStamp?: string;
    /**
     * exif data gpsDOP
     */
    gpsDOP?: string;
    /**
     * exif data gpsLatitude
     */
    gpsLatitude?: string;
    /**
     * exif data gpsLatitudeRef
     */
    gpsLatitudeRef?: string;
    /**
     * exif data gpsLongitude
     */
    gpsLongitude?: string;
    /**
     * exif data gpsLongitudeRef
     */
    gpsLongitudeRef?: string;
    /**
     * exif data gpsTimeStamp
     */
    gpsTimeStamp?: string;
    /**
     * exif data gpsVersionID
     */
    gpsVersionID?: string;
    /**
     * exif data extracted for imageHeight
     */
    imageHeight?: string;
    /**
     * exif data extracted for imageWidth
     */
    imageWidth?: string;
    /**
     * exif data extracted for interopIndex
     */
    interopIndex?: string;
    /**
     * exif data extracted for ISO
     */
    ISO?: string;
    /**
     * exif data extracted for make
     */
    make?: string;
    /**
     * exif data extracted for maxApertureValue
     */
    maxApertureValue?: string;
    /**
     * exif data extracted for meteringMode
     */
    meteringMode?: string;
    /**
     * exif data extracted for model
     */
    model?: string;
    /**
     * exif data extracted for modifyDate
     */
    modifyDate?: string;
    /**
     * exif data extracted for orientation
     */
    orientation?: string;
    /**
     * exif data extracted for resolutionUnit
     */
    resolutionUnit?: string;
    /**
     * exif data extracted for saturation
     */
    saturation?: string;
    /**
     * exif data extracted for sceneCaptureType
     */
    sceneCaptureType?: string;
    /**
     * exif data extracted for sensingMethod
     */
    sensingMethod?: string;
    /**
     * exif data extracted for sharpness
     */
    sharpness?: string;
    /**
     * exif data extracted for shutterSpeedValue
     */
    shutterSpeedValue?: string;
    /**
     * exif data extracted for software
     */
    software?: string;
    /**
     * exif data extracted for subjectDistance
     */
    subjectDistance?: string;
    /**
     * exif data extracted for subjectDistanceRange
     */
    subjectDistanceRange?: string;
    /**
     * exif data extracted for subSecTime
     */
    subSecTime?: string;
    /**
     * exif data extracted for subSecTimeDigitized
     */
    subSecTimeDigitized?: string;
    /**
     * exif data extracted for subSecTimeOriginal
     */
    subSecTimeOriginal?: string;
    /**
     * exif data extracted for whiteBalance
     */
    whiteBalance?: string;
    /**
     * exif data extracted for xResolution
     */
    xResolution?: string;
    /**
     * exif data extracted for yCbCrPositioning
     */
    yCbCrPositioning?: string;
    /**
     * exif data extracted for yResolution
     */
    yResolution?: string;
    svg?: string;
  }[];
  /**
   * Meta data about list and collection
   */
  meta: {
    /**
     * Total number in collection
     */
    count: number;
    /**
     * Current page
     */
    page: number;
    /**
     * Total number of pages
     */
    pages: number;
    [k: string]: any;
  };
  [k: string]: any;
}

export interface PostPatchI {
  id?: string;
  rotate?: 0 | 90 | 180 | 270;
  /**
   * Integer unix epoch timestamp
   */
  timestamp?: number;
  /**
   * Date time from legacy tumblr images
   */
  date?: string;
  /**
   * Original URL from legacy tumblr images
   */
  originalUrl?: string;
  /**
   * Descrtipion/caption for the post
   */
  description?: string;
  key?: string;
  status?: "active" | "deleted";
  createdAt?: string;
  updatedAt?: string;
  isPending?: boolean;
  tags?: string[];
  etag?: string;
  /**
   * exif data extracted
   */
  apertureValue?: string;
  /**
   * exif data brightnessValue
   */
  brightnessValue?: string;
  /**
   * exif data colorSpace
   */
  colorSpace?: string;
  /**
   * exif data contrast
   */
  contrast?: string;
  /**
   * exif data createDate
   */
  createDate?: string;
  /**
   * exif data customRendered
   */
  customRendered?: string;
  /**
   * exif data dateTimeOriginal
   */
  dateTimeOriginal?: string;
  /**
   * exif data digitalZoomRatio
   */
  digitalZoomRatio?: string;
  /**
   * exif data exifImageHeight
   */
  exifImageHeight?: string;
  /**
   * exif data exifImageWidth
   */
  exifImageWidth?: string;
  /**
   * exif data exposureCompensation
   */
  exposureCompensation?: string;
  /**
   * exif data exposureMode
   */
  exposureMode?: string;
  /**
   * exif data exposureProgram
   */
  exposureProgram?: string;
  /**
   * exif data exposureTime
   */
  exposureTime?: string;
  /**
   * exif data flash
   */
  flash?: string;
  /**
   * exif data fNumber
   */
  fNumber?: string;
  /**
   * exif data focalLength
   */
  focalLength?: string;
  /**
   * exif data focalLengthIn35mmFormat
   */
  focalLengthIn35mmFormat?: string;
  /**
   * exif data gpsAltitude
   */
  gpsAltitude?: string;
  /**
   * exif data gpsAltitudeRef
   */
  gpsAltitudeRef?: string;
  /**
   * exif data gpsDateStamp
   */
  gpsDateStamp?: string;
  /**
   * exif data gpsDOP
   */
  gpsDOP?: string;
  /**
   * exif data gpsLatitude
   */
  gpsLatitude?: string;
  /**
   * exif data gpsLatitudeRef
   */
  gpsLatitudeRef?: string;
  /**
   * exif data gpsLongitude
   */
  gpsLongitude?: string;
  /**
   * exif data gpsLongitudeRef
   */
  gpsLongitudeRef?: string;
  /**
   * exif data gpsTimeStamp
   */
  gpsTimeStamp?: string;
  /**
   * exif data gpsVersionID
   */
  gpsVersionID?: string;
  /**
   * exif data extracted for imageHeight
   */
  imageHeight?: string;
  /**
   * exif data extracted for imageWidth
   */
  imageWidth?: string;
  /**
   * exif data extracted for interopIndex
   */
  interopIndex?: string;
  /**
   * exif data extracted for ISO
   */
  ISO?: string;
  /**
   * exif data extracted for make
   */
  make?: string;
  /**
   * exif data extracted for maxApertureValue
   */
  maxApertureValue?: string;
  /**
   * exif data extracted for meteringMode
   */
  meteringMode?: string;
  /**
   * exif data extracted for model
   */
  model?: string;
  /**
   * exif data extracted for modifyDate
   */
  modifyDate?: string;
  /**
   * exif data extracted for orientation
   */
  orientation?: string;
  /**
   * exif data extracted for resolutionUnit
   */
  resolutionUnit?: string;
  /**
   * exif data extracted for saturation
   */
  saturation?: string;
  /**
   * exif data extracted for sceneCaptureType
   */
  sceneCaptureType?: string;
  /**
   * exif data extracted for sensingMethod
   */
  sensingMethod?: string;
  /**
   * exif data extracted for sharpness
   */
  sharpness?: string;
  /**
   * exif data extracted for shutterSpeedValue
   */
  shutterSpeedValue?: string;
  /**
   * exif data extracted for software
   */
  software?: string;
  /**
   * exif data extracted for subjectDistance
   */
  subjectDistance?: string;
  /**
   * exif data extracted for subjectDistanceRange
   */
  subjectDistanceRange?: string;
  /**
   * exif data extracted for subSecTime
   */
  subSecTime?: string;
  /**
   * exif data extracted for subSecTimeDigitized
   */
  subSecTimeDigitized?: string;
  /**
   * exif data extracted for subSecTimeOriginal
   */
  subSecTimeOriginal?: string;
  /**
   * exif data extracted for whiteBalance
   */
  whiteBalance?: string;
  /**
   * exif data extracted for xResolution
   */
  xResolution?: string;
  /**
   * exif data extracted for yCbCrPositioning
   */
  yCbCrPositioning?: string;
  /**
   * exif data extracted for yResolution
   */
  yResolution?: string;
}

/**
 * Result of logging in
 */
export interface SetUserResponseBodyI {
  /**
   * Role of user
   */
  user?: string;
  /**
   * Number of requests
   */
  requests?: number;
  [k: string]: any;
}

export interface SetUserRequestBodyI {
  /**
   * How many times the user has requested a login
   */
  requests?: number;
}

export interface UploadResponseBodyI {
  upload_url?: string;
  params?: {
    /**
     * Key the file was uploaded to
     */
    key?: string;
    /**
     * ACL of the object uploaded
     */
    acl?: string;
    /**
     * Internal service code requested
     */
    success_action_status?: string;
    /**
     * Policy required in the header for the multipart file upload
     */
    policy?: string;
    /**
     * Meta data about the signed upload policy
     */
    "x-amz-algorithm"?: string;
    /**
     * Meta data about the signed upload policy
     */
    "x-amz-credential"?: string;
    /**
     * Meta data about the signed upload policy
     */
    "x-amz-date"?: string;
    /**
     * Meta data about the signed upload policy
     */
    "x-amz-signature"?: string;
    [k: string]: any;
  };
  [k: string]: any;
}

export interface UploadQueryI {
  name: string;
}

/**
 * An array of tag objects
 */
export type GetTagsResponseBodyI = {
  /**
   * Name of tag
   */
  name?: string;
  /**
   * uuid of tag
   */
  id?: string;
  /**
   * Number of associations currently with tag
   */
  count?: number;
  [k: string]: any;
}[];

/**
 * Tag entity
 */
export interface PostTagsResponseBodyI {
  /**
   * uuid of tag record
   */
  id?: string;
  /**
   * Name of tag
   */
  name?: string;
  [k: string]: any;
}

export interface PostTagsRequestBodyI {
  /**
   * Name of the new tag
   */
  name: string;
}

export interface RefreshResponseBodyI {
  /**
   * Acknoweldgement that the user has been refreshed
   */
  refreshed?: boolean;
  [k: string]: any;
}

/**
 * Result of getIndex call
 */
export interface GetPostsIndexResponseBodyI {
  /**
   * Index of photo
   */
  index?: number;
  [k: string]: any;
}

export interface GetPostsIndexQueryI {
  /**
   * Timestamp of the desired post
   */
  timestamp: string;
}

export interface DeleteBulkPostsRequestBodyI {
  /**
   * Array of ids to delete
   */
  ids: string[];
  [k: string]: any;
}

/**
 * Object containing bulk patch request
 */
export interface PostPostsRequestBodyI {
  /**
   * Array of post ids affected by request
   */
  ids: string[];
  /**
   * array of ids to ADD to all post ids
   */
  tags?: string[];
  /**
   * Descrtiption to update for all post ids
   */
  description?: string;
  [k: string]: any;
}

export interface GetPostsResponseBodyI {
  /**
   * Array of posts
   */
  data: {
    id?: string;
    rotate?: 0 | 90 | 180 | 270;
    /**
     * Integer unix epoch timestamp
     */
    timestamp?: number;
    /**
     * Date time from legacy tumblr images
     */
    date?: string;
    /**
     * Original URL from legacy tumblr images
     */
    originalUrl?: string;
    /**
     * Descrtipion/caption for the post
     */
    description?: string;
    key: string;
    status?: "active" | "deleted";
    createdAt?: string;
    updatedAt?: string;
    isPending?: boolean;
    tags?: {
      /**
       * uuid of tag record
       */
      id?: string;
      /**
       * Name of tag
       */
      name?: string;
      [k: string]: any;
    }[];
    etag?: string;
    /**
     * exif data extracted
     */
    apertureValue?: string;
    /**
     * exif data brightnessValue
     */
    brightnessValue?: string;
    /**
     * exif data colorSpace
     */
    colorSpace?: string;
    /**
     * exif data contrast
     */
    contrast?: string;
    /**
     * exif data createDate
     */
    createDate?: string;
    /**
     * exif data customRendered
     */
    customRendered?: string;
    /**
     * exif data dateTimeOriginal
     */
    dateTimeOriginal?: string;
    /**
     * exif data digitalZoomRatio
     */
    digitalZoomRatio?: string;
    /**
     * exif data exifImageHeight
     */
    exifImageHeight?: string;
    /**
     * exif data exifImageWidth
     */
    exifImageWidth?: string;
    /**
     * exif data exposureCompensation
     */
    exposureCompensation?: string;
    /**
     * exif data exposureMode
     */
    exposureMode?: string;
    /**
     * exif data exposureProgram
     */
    exposureProgram?: string;
    /**
     * exif data exposureTime
     */
    exposureTime?: string;
    /**
     * exif data flash
     */
    flash?: string;
    /**
     * exif data fNumber
     */
    fNumber?: string;
    /**
     * exif data focalLength
     */
    focalLength?: string;
    /**
     * exif data focalLengthIn35mmFormat
     */
    focalLengthIn35mmFormat?: string;
    /**
     * exif data gpsAltitude
     */
    gpsAltitude?: string;
    /**
     * exif data gpsAltitudeRef
     */
    gpsAltitudeRef?: string;
    /**
     * exif data gpsDateStamp
     */
    gpsDateStamp?: string;
    /**
     * exif data gpsDOP
     */
    gpsDOP?: string;
    /**
     * exif data gpsLatitude
     */
    gpsLatitude?: string;
    /**
     * exif data gpsLatitudeRef
     */
    gpsLatitudeRef?: string;
    /**
     * exif data gpsLongitude
     */
    gpsLongitude?: string;
    /**
     * exif data gpsLongitudeRef
     */
    gpsLongitudeRef?: string;
    /**
     * exif data gpsTimeStamp
     */
    gpsTimeStamp?: string;
    /**
     * exif data gpsVersionID
     */
    gpsVersionID?: string;
    /**
     * exif data extracted for imageHeight
     */
    imageHeight?: string;
    /**
     * exif data extracted for imageWidth
     */
    imageWidth?: string;
    /**
     * exif data extracted for interopIndex
     */
    interopIndex?: string;
    /**
     * exif data extracted for ISO
     */
    ISO?: string;
    /**
     * exif data extracted for make
     */
    make?: string;
    /**
     * exif data extracted for maxApertureValue
     */
    maxApertureValue?: string;
    /**
     * exif data extracted for meteringMode
     */
    meteringMode?: string;
    /**
     * exif data extracted for model
     */
    model?: string;
    /**
     * exif data extracted for modifyDate
     */
    modifyDate?: string;
    /**
     * exif data extracted for orientation
     */
    orientation?: string;
    /**
     * exif data extracted for resolutionUnit
     */
    resolutionUnit?: string;
    /**
     * exif data extracted for saturation
     */
    saturation?: string;
    /**
     * exif data extracted for sceneCaptureType
     */
    sceneCaptureType?: string;
    /**
     * exif data extracted for sensingMethod
     */
    sensingMethod?: string;
    /**
     * exif data extracted for sharpness
     */
    sharpness?: string;
    /**
     * exif data extracted for shutterSpeedValue
     */
    shutterSpeedValue?: string;
    /**
     * exif data extracted for software
     */
    software?: string;
    /**
     * exif data extracted for subjectDistance
     */
    subjectDistance?: string;
    /**
     * exif data extracted for subjectDistanceRange
     */
    subjectDistanceRange?: string;
    /**
     * exif data extracted for subSecTime
     */
    subSecTime?: string;
    /**
     * exif data extracted for subSecTimeDigitized
     */
    subSecTimeDigitized?: string;
    /**
     * exif data extracted for subSecTimeOriginal
     */
    subSecTimeOriginal?: string;
    /**
     * exif data extracted for whiteBalance
     */
    whiteBalance?: string;
    /**
     * exif data extracted for xResolution
     */
    xResolution?: string;
    /**
     * exif data extracted for yCbCrPositioning
     */
    yCbCrPositioning?: string;
    /**
     * exif data extracted for yResolution
     */
    yResolution?: string;
    svg?: string;
  }[];
  /**
   * Meta data about list and collection
   */
  meta: {
    /**
     * Total number in collection
     */
    count: number;
    /**
     * Current page
     */
    page: number;
    /**
     * Total number of pages
     */
    pages: number;
    [k: string]: any;
  };
  [k: string]: any;
}

export interface GetPostsQueryI {
  /**
   * Order of query of posts
   */
  order?: "asc" | "desc";
  page?: number;
  isPending?: boolean;
  fields?: (
    | "id"
    | "timestamp"
    | "date"
    | "originalUrl"
    | "description"
    | "etag"
    | "key"
    | "createdAt"
    | "updatedAt"
    | "status"
    | "apertureValue"
    | "brightnessValue"
    | "colorSpace"
    | "contrast"
    | "createDate"
    | "customRendered"
    | "dateTimeOriginal"
    | "digitalZoomRatio"
    | "exifImageHeight"
    | "exifImageWidth"
    | "exposureCompensation"
    | "exposureMode"
    | "exposureProgram"
    | "exposureTime"
    | "flash"
    | "fNumber"
    | "focalLength"
    | "focalLengthIn35mmFormat"
    | "gpsAltitude"
    | "gpsAltitudeRef"
    | "gpsDateStamp"
    | "gpsDOP"
    | "gpsLatitude"
    | "gpsLatitudeRef"
    | "gpsLongitude"
    | "gpsLongitudeRef"
    | "gpsTimeStamp"
    | "gpsVersionID"
    | "imageHeight"
    | "imageWidth"
    | "interopIndex"
    | "ISO"
    | "make"
    | "maxApertureValue"
    | "meteringMode"
    | "model"
    | "modifyDate"
    | "orientation"
    | "resolutionUnit"
    | "saturation"
    | "sceneCaptureType"
    | "sensingMethod"
    | "sharpness"
    | "shutterSpeedValue"
    | "software"
    | "subjectDistance"
    | "subjectDistanceRange"
    | "subSecTime"
    | "subSecTimeDigitized"
    | "subSecTimeOriginal"
    | "whiteBalance"
    | "xResolution"
    | "yCbCrPositioning"
    | "yResolution"
  )[];
}

export interface CreatePostResponseBodyI {
  id?: string;
  rotate?: 0 | 90 | 180 | 270;
  /**
   * Integer unix epoch timestamp
   */
  timestamp?: number;
  /**
   * Date time from legacy tumblr images
   */
  date?: string;
  /**
   * Original URL from legacy tumblr images
   */
  originalUrl?: string;
  /**
   * Descrtipion/caption for the post
   */
  description?: string;
  key: string;
  status?: "active" | "deleted";
  createdAt?: string;
  updatedAt?: string;
  isPending?: boolean;
  tags?: string[];
  etag?: string;
  /**
   * exif data extracted
   */
  apertureValue?: string;
  /**
   * exif data brightnessValue
   */
  brightnessValue?: string;
  /**
   * exif data colorSpace
   */
  colorSpace?: string;
  /**
   * exif data contrast
   */
  contrast?: string;
  /**
   * exif data createDate
   */
  createDate?: string;
  /**
   * exif data customRendered
   */
  customRendered?: string;
  /**
   * exif data dateTimeOriginal
   */
  dateTimeOriginal?: string;
  /**
   * exif data digitalZoomRatio
   */
  digitalZoomRatio?: string;
  /**
   * exif data exifImageHeight
   */
  exifImageHeight?: string;
  /**
   * exif data exifImageWidth
   */
  exifImageWidth?: string;
  /**
   * exif data exposureCompensation
   */
  exposureCompensation?: string;
  /**
   * exif data exposureMode
   */
  exposureMode?: string;
  /**
   * exif data exposureProgram
   */
  exposureProgram?: string;
  /**
   * exif data exposureTime
   */
  exposureTime?: string;
  /**
   * exif data flash
   */
  flash?: string;
  /**
   * exif data fNumber
   */
  fNumber?: string;
  /**
   * exif data focalLength
   */
  focalLength?: string;
  /**
   * exif data focalLengthIn35mmFormat
   */
  focalLengthIn35mmFormat?: string;
  /**
   * exif data gpsAltitude
   */
  gpsAltitude?: string;
  /**
   * exif data gpsAltitudeRef
   */
  gpsAltitudeRef?: string;
  /**
   * exif data gpsDateStamp
   */
  gpsDateStamp?: string;
  /**
   * exif data gpsDOP
   */
  gpsDOP?: string;
  /**
   * exif data gpsLatitude
   */
  gpsLatitude?: string;
  /**
   * exif data gpsLatitudeRef
   */
  gpsLatitudeRef?: string;
  /**
   * exif data gpsLongitude
   */
  gpsLongitude?: string;
  /**
   * exif data gpsLongitudeRef
   */
  gpsLongitudeRef?: string;
  /**
   * exif data gpsTimeStamp
   */
  gpsTimeStamp?: string;
  /**
   * exif data gpsVersionID
   */
  gpsVersionID?: string;
  /**
   * exif data extracted for imageHeight
   */
  imageHeight?: string;
  /**
   * exif data extracted for imageWidth
   */
  imageWidth?: string;
  /**
   * exif data extracted for interopIndex
   */
  interopIndex?: string;
  /**
   * exif data extracted for ISO
   */
  ISO?: string;
  /**
   * exif data extracted for make
   */
  make?: string;
  /**
   * exif data extracted for maxApertureValue
   */
  maxApertureValue?: string;
  /**
   * exif data extracted for meteringMode
   */
  meteringMode?: string;
  /**
   * exif data extracted for model
   */
  model?: string;
  /**
   * exif data extracted for modifyDate
   */
  modifyDate?: string;
  /**
   * exif data extracted for orientation
   */
  orientation?: string;
  /**
   * exif data extracted for resolutionUnit
   */
  resolutionUnit?: string;
  /**
   * exif data extracted for saturation
   */
  saturation?: string;
  /**
   * exif data extracted for sceneCaptureType
   */
  sceneCaptureType?: string;
  /**
   * exif data extracted for sensingMethod
   */
  sensingMethod?: string;
  /**
   * exif data extracted for sharpness
   */
  sharpness?: string;
  /**
   * exif data extracted for shutterSpeedValue
   */
  shutterSpeedValue?: string;
  /**
   * exif data extracted for software
   */
  software?: string;
  /**
   * exif data extracted for subjectDistance
   */
  subjectDistance?: string;
  /**
   * exif data extracted for subjectDistanceRange
   */
  subjectDistanceRange?: string;
  /**
   * exif data extracted for subSecTime
   */
  subSecTime?: string;
  /**
   * exif data extracted for subSecTimeDigitized
   */
  subSecTimeDigitized?: string;
  /**
   * exif data extracted for subSecTimeOriginal
   */
  subSecTimeOriginal?: string;
  /**
   * exif data extracted for whiteBalance
   */
  whiteBalance?: string;
  /**
   * exif data extracted for xResolution
   */
  xResolution?: string;
  /**
   * exif data extracted for yCbCrPositioning
   */
  yCbCrPositioning?: string;
  /**
   * exif data extracted for yResolution
   */
  yResolution?: string;
}

export interface CreatePostRequestBodyI {
  id?: string;
  rotate?: 0 | 90 | 180 | 270;
  /**
   * Integer unix epoch timestamp
   */
  timestamp?: number;
  /**
   * Date time from legacy tumblr images
   */
  date?: string;
  /**
   * Original URL from legacy tumblr images
   */
  originalUrl?: string;
  /**
   * Descrtipion/caption for the post
   */
  description?: string;
  key: string;
  status?: "active" | "deleted";
  createdAt?: string;
  updatedAt?: string;
  isPending?: boolean;
  tags?: string[];
  etag?: string;
  /**
   * exif data extracted
   */
  apertureValue?: string;
  /**
   * exif data brightnessValue
   */
  brightnessValue?: string;
  /**
   * exif data colorSpace
   */
  colorSpace?: string;
  /**
   * exif data contrast
   */
  contrast?: string;
  /**
   * exif data createDate
   */
  createDate?: string;
  /**
   * exif data customRendered
   */
  customRendered?: string;
  /**
   * exif data dateTimeOriginal
   */
  dateTimeOriginal?: string;
  /**
   * exif data digitalZoomRatio
   */
  digitalZoomRatio?: string;
  /**
   * exif data exifImageHeight
   */
  exifImageHeight?: string;
  /**
   * exif data exifImageWidth
   */
  exifImageWidth?: string;
  /**
   * exif data exposureCompensation
   */
  exposureCompensation?: string;
  /**
   * exif data exposureMode
   */
  exposureMode?: string;
  /**
   * exif data exposureProgram
   */
  exposureProgram?: string;
  /**
   * exif data exposureTime
   */
  exposureTime?: string;
  /**
   * exif data flash
   */
  flash?: string;
  /**
   * exif data fNumber
   */
  fNumber?: string;
  /**
   * exif data focalLength
   */
  focalLength?: string;
  /**
   * exif data focalLengthIn35mmFormat
   */
  focalLengthIn35mmFormat?: string;
  /**
   * exif data gpsAltitude
   */
  gpsAltitude?: string;
  /**
   * exif data gpsAltitudeRef
   */
  gpsAltitudeRef?: string;
  /**
   * exif data gpsDateStamp
   */
  gpsDateStamp?: string;
  /**
   * exif data gpsDOP
   */
  gpsDOP?: string;
  /**
   * exif data gpsLatitude
   */
  gpsLatitude?: string;
  /**
   * exif data gpsLatitudeRef
   */
  gpsLatitudeRef?: string;
  /**
   * exif data gpsLongitude
   */
  gpsLongitude?: string;
  /**
   * exif data gpsLongitudeRef
   */
  gpsLongitudeRef?: string;
  /**
   * exif data gpsTimeStamp
   */
  gpsTimeStamp?: string;
  /**
   * exif data gpsVersionID
   */
  gpsVersionID?: string;
  /**
   * exif data extracted for imageHeight
   */
  imageHeight?: string;
  /**
   * exif data extracted for imageWidth
   */
  imageWidth?: string;
  /**
   * exif data extracted for interopIndex
   */
  interopIndex?: string;
  /**
   * exif data extracted for ISO
   */
  ISO?: string;
  /**
   * exif data extracted for make
   */
  make?: string;
  /**
   * exif data extracted for maxApertureValue
   */
  maxApertureValue?: string;
  /**
   * exif data extracted for meteringMode
   */
  meteringMode?: string;
  /**
   * exif data extracted for model
   */
  model?: string;
  /**
   * exif data extracted for modifyDate
   */
  modifyDate?: string;
  /**
   * exif data extracted for orientation
   */
  orientation?: string;
  /**
   * exif data extracted for resolutionUnit
   */
  resolutionUnit?: string;
  /**
   * exif data extracted for saturation
   */
  saturation?: string;
  /**
   * exif data extracted for sceneCaptureType
   */
  sceneCaptureType?: string;
  /**
   * exif data extracted for sensingMethod
   */
  sensingMethod?: string;
  /**
   * exif data extracted for sharpness
   */
  sharpness?: string;
  /**
   * exif data extracted for shutterSpeedValue
   */
  shutterSpeedValue?: string;
  /**
   * exif data extracted for software
   */
  software?: string;
  /**
   * exif data extracted for subjectDistance
   */
  subjectDistance?: string;
  /**
   * exif data extracted for subjectDistanceRange
   */
  subjectDistanceRange?: string;
  /**
   * exif data extracted for subSecTime
   */
  subSecTime?: string;
  /**
   * exif data extracted for subSecTimeDigitized
   */
  subSecTimeDigitized?: string;
  /**
   * exif data extracted for subSecTimeOriginal
   */
  subSecTimeOriginal?: string;
  /**
   * exif data extracted for whiteBalance
   */
  whiteBalance?: string;
  /**
   * exif data extracted for xResolution
   */
  xResolution?: string;
  /**
   * exif data extracted for yCbCrPositioning
   */
  yCbCrPositioning?: string;
  /**
   * exif data extracted for yResolution
   */
  yResolution?: string;
}

/**
 * Result of logging in
 */
export interface LoginResponseBodyI {
  /**
   * Role of user
   */
  user?: "read" | "write";
  [k: string]: any;
}

/**
 * Object with password property
 */
export interface LoginRequestBodyI {
  /**
   * password
   */
  password: string;
}

/**
 * Payload for invitation
 */
export interface InvitationRequestBodyI {
  /**
   * Fist Name
   */
  firstName?: string;
  /**
   * Last Name
   */
  lastName?: string;
  /**
   * E-mail
   */
  email: string;
  [k: string]: any;
}

export interface GetPostsByTagResponseBodyI {
  /**
   * Array of posts
   */
  data: {
    id?: string;
    rotate?: 0 | 90 | 180 | 270;
    /**
     * Integer unix epoch timestamp
     */
    timestamp?: number;
    /**
     * Date time from legacy tumblr images
     */
    date?: string;
    /**
     * Original URL from legacy tumblr images
     */
    originalUrl?: string;
    /**
     * Descrtipion/caption for the post
     */
    description?: string;
    key: string;
    status?: "active" | "deleted";
    createdAt?: string;
    updatedAt?: string;
    isPending?: boolean;
    tags?: {
      /**
       * uuid of tag record
       */
      id?: string;
      /**
       * Name of tag
       */
      name?: string;
      [k: string]: any;
    }[];
    etag?: string;
    /**
     * exif data extracted
     */
    apertureValue?: string;
    /**
     * exif data brightnessValue
     */
    brightnessValue?: string;
    /**
     * exif data colorSpace
     */
    colorSpace?: string;
    /**
     * exif data contrast
     */
    contrast?: string;
    /**
     * exif data createDate
     */
    createDate?: string;
    /**
     * exif data customRendered
     */
    customRendered?: string;
    /**
     * exif data dateTimeOriginal
     */
    dateTimeOriginal?: string;
    /**
     * exif data digitalZoomRatio
     */
    digitalZoomRatio?: string;
    /**
     * exif data exifImageHeight
     */
    exifImageHeight?: string;
    /**
     * exif data exifImageWidth
     */
    exifImageWidth?: string;
    /**
     * exif data exposureCompensation
     */
    exposureCompensation?: string;
    /**
     * exif data exposureMode
     */
    exposureMode?: string;
    /**
     * exif data exposureProgram
     */
    exposureProgram?: string;
    /**
     * exif data exposureTime
     */
    exposureTime?: string;
    /**
     * exif data flash
     */
    flash?: string;
    /**
     * exif data fNumber
     */
    fNumber?: string;
    /**
     * exif data focalLength
     */
    focalLength?: string;
    /**
     * exif data focalLengthIn35mmFormat
     */
    focalLengthIn35mmFormat?: string;
    /**
     * exif data gpsAltitude
     */
    gpsAltitude?: string;
    /**
     * exif data gpsAltitudeRef
     */
    gpsAltitudeRef?: string;
    /**
     * exif data gpsDateStamp
     */
    gpsDateStamp?: string;
    /**
     * exif data gpsDOP
     */
    gpsDOP?: string;
    /**
     * exif data gpsLatitude
     */
    gpsLatitude?: string;
    /**
     * exif data gpsLatitudeRef
     */
    gpsLatitudeRef?: string;
    /**
     * exif data gpsLongitude
     */
    gpsLongitude?: string;
    /**
     * exif data gpsLongitudeRef
     */
    gpsLongitudeRef?: string;
    /**
     * exif data gpsTimeStamp
     */
    gpsTimeStamp?: string;
    /**
     * exif data gpsVersionID
     */
    gpsVersionID?: string;
    /**
     * exif data extracted for imageHeight
     */
    imageHeight?: string;
    /**
     * exif data extracted for imageWidth
     */
    imageWidth?: string;
    /**
     * exif data extracted for interopIndex
     */
    interopIndex?: string;
    /**
     * exif data extracted for ISO
     */
    ISO?: string;
    /**
     * exif data extracted for make
     */
    make?: string;
    /**
     * exif data extracted for maxApertureValue
     */
    maxApertureValue?: string;
    /**
     * exif data extracted for meteringMode
     */
    meteringMode?: string;
    /**
     * exif data extracted for model
     */
    model?: string;
    /**
     * exif data extracted for modifyDate
     */
    modifyDate?: string;
    /**
     * exif data extracted for orientation
     */
    orientation?: string;
    /**
     * exif data extracted for resolutionUnit
     */
    resolutionUnit?: string;
    /**
     * exif data extracted for saturation
     */
    saturation?: string;
    /**
     * exif data extracted for sceneCaptureType
     */
    sceneCaptureType?: string;
    /**
     * exif data extracted for sensingMethod
     */
    sensingMethod?: string;
    /**
     * exif data extracted for sharpness
     */
    sharpness?: string;
    /**
     * exif data extracted for shutterSpeedValue
     */
    shutterSpeedValue?: string;
    /**
     * exif data extracted for software
     */
    software?: string;
    /**
     * exif data extracted for subjectDistance
     */
    subjectDistance?: string;
    /**
     * exif data extracted for subjectDistanceRange
     */
    subjectDistanceRange?: string;
    /**
     * exif data extracted for subSecTime
     */
    subSecTime?: string;
    /**
     * exif data extracted for subSecTimeDigitized
     */
    subSecTimeDigitized?: string;
    /**
     * exif data extracted for subSecTimeOriginal
     */
    subSecTimeOriginal?: string;
    /**
     * exif data extracted for whiteBalance
     */
    whiteBalance?: string;
    /**
     * exif data extracted for xResolution
     */
    xResolution?: string;
    /**
     * exif data extracted for yCbCrPositioning
     */
    yCbCrPositioning?: string;
    /**
     * exif data extracted for yResolution
     */
    yResolution?: string;
    svg?: string;
  }[];
  /**
   * Meta data about list and collection
   */
  meta: {
    /**
     * Total number in collection
     */
    count: number;
    /**
     * Current page
     */
    page: number;
    /**
     * Total number of pages
     */
    pages: number;
    [k: string]: any;
  };
  [k: string]: any;
}

export interface GetPostsByTagPathI {
  /**
   * uuid of tag that all posts are associated with
   */
  tagId: string;
}

export interface GetPostResponseBodyI {
  id?: string;
  rotate?: 0 | 90 | 180 | 270;
  /**
   * Integer unix epoch timestamp
   */
  timestamp?: number;
  /**
   * Date time from legacy tumblr images
   */
  date?: string;
  /**
   * Original URL from legacy tumblr images
   */
  originalUrl?: string;
  /**
   * Descrtipion/caption for the post
   */
  description?: string;
  key: string;
  status?: "active" | "deleted";
  createdAt?: string;
  updatedAt?: string;
  isPending?: boolean;
  tags?: {
    /**
     * uuid of tag record
     */
    id?: string;
    /**
     * Name of tag
     */
    name?: string;
    [k: string]: any;
  }[];
  etag?: string;
  /**
   * exif data extracted
   */
  apertureValue?: string;
  /**
   * exif data brightnessValue
   */
  brightnessValue?: string;
  /**
   * exif data colorSpace
   */
  colorSpace?: string;
  /**
   * exif data contrast
   */
  contrast?: string;
  /**
   * exif data createDate
   */
  createDate?: string;
  /**
   * exif data customRendered
   */
  customRendered?: string;
  /**
   * exif data dateTimeOriginal
   */
  dateTimeOriginal?: string;
  /**
   * exif data digitalZoomRatio
   */
  digitalZoomRatio?: string;
  /**
   * exif data exifImageHeight
   */
  exifImageHeight?: string;
  /**
   * exif data exifImageWidth
   */
  exifImageWidth?: string;
  /**
   * exif data exposureCompensation
   */
  exposureCompensation?: string;
  /**
   * exif data exposureMode
   */
  exposureMode?: string;
  /**
   * exif data exposureProgram
   */
  exposureProgram?: string;
  /**
   * exif data exposureTime
   */
  exposureTime?: string;
  /**
   * exif data flash
   */
  flash?: string;
  /**
   * exif data fNumber
   */
  fNumber?: string;
  /**
   * exif data focalLength
   */
  focalLength?: string;
  /**
   * exif data focalLengthIn35mmFormat
   */
  focalLengthIn35mmFormat?: string;
  /**
   * exif data gpsAltitude
   */
  gpsAltitude?: string;
  /**
   * exif data gpsAltitudeRef
   */
  gpsAltitudeRef?: string;
  /**
   * exif data gpsDateStamp
   */
  gpsDateStamp?: string;
  /**
   * exif data gpsDOP
   */
  gpsDOP?: string;
  /**
   * exif data gpsLatitude
   */
  gpsLatitude?: string;
  /**
   * exif data gpsLatitudeRef
   */
  gpsLatitudeRef?: string;
  /**
   * exif data gpsLongitude
   */
  gpsLongitude?: string;
  /**
   * exif data gpsLongitudeRef
   */
  gpsLongitudeRef?: string;
  /**
   * exif data gpsTimeStamp
   */
  gpsTimeStamp?: string;
  /**
   * exif data gpsVersionID
   */
  gpsVersionID?: string;
  /**
   * exif data extracted for imageHeight
   */
  imageHeight?: string;
  /**
   * exif data extracted for imageWidth
   */
  imageWidth?: string;
  /**
   * exif data extracted for interopIndex
   */
  interopIndex?: string;
  /**
   * exif data extracted for ISO
   */
  ISO?: string;
  /**
   * exif data extracted for make
   */
  make?: string;
  /**
   * exif data extracted for maxApertureValue
   */
  maxApertureValue?: string;
  /**
   * exif data extracted for meteringMode
   */
  meteringMode?: string;
  /**
   * exif data extracted for model
   */
  model?: string;
  /**
   * exif data extracted for modifyDate
   */
  modifyDate?: string;
  /**
   * exif data extracted for orientation
   */
  orientation?: string;
  /**
   * exif data extracted for resolutionUnit
   */
  resolutionUnit?: string;
  /**
   * exif data extracted for saturation
   */
  saturation?: string;
  /**
   * exif data extracted for sceneCaptureType
   */
  sceneCaptureType?: string;
  /**
   * exif data extracted for sensingMethod
   */
  sensingMethod?: string;
  /**
   * exif data extracted for sharpness
   */
  sharpness?: string;
  /**
   * exif data extracted for shutterSpeedValue
   */
  shutterSpeedValue?: string;
  /**
   * exif data extracted for software
   */
  software?: string;
  /**
   * exif data extracted for subjectDistance
   */
  subjectDistance?: string;
  /**
   * exif data extracted for subjectDistanceRange
   */
  subjectDistanceRange?: string;
  /**
   * exif data extracted for subSecTime
   */
  subSecTime?: string;
  /**
   * exif data extracted for subSecTimeDigitized
   */
  subSecTimeDigitized?: string;
  /**
   * exif data extracted for subSecTimeOriginal
   */
  subSecTimeOriginal?: string;
  /**
   * exif data extracted for whiteBalance
   */
  whiteBalance?: string;
  /**
   * exif data extracted for xResolution
   */
  xResolution?: string;
  /**
   * exif data extracted for yCbCrPositioning
   */
  yCbCrPositioning?: string;
  /**
   * exif data extracted for yResolution
   */
  yResolution?: string;
  svg?: string;
}

export interface GetPostPathI {
  /**
   * uuid of post record to retrieve
   */
  id: string;
}

export interface PatchPostResponseBodyI {
  id?: string;
  rotate?: 0 | 90 | 180 | 270;
  /**
   * Integer unix epoch timestamp
   */
  timestamp?: number;
  /**
   * Date time from legacy tumblr images
   */
  date?: string;
  /**
   * Original URL from legacy tumblr images
   */
  originalUrl?: string;
  /**
   * Descrtipion/caption for the post
   */
  description?: string;
  key: string;
  status?: "active" | "deleted";
  createdAt?: string;
  updatedAt?: string;
  isPending?: boolean;
  tags?: {
    /**
     * uuid of tag record
     */
    id?: string;
    /**
     * Name of tag
     */
    name?: string;
    [k: string]: any;
  }[];
  etag?: string;
  /**
   * exif data extracted
   */
  apertureValue?: string;
  /**
   * exif data brightnessValue
   */
  brightnessValue?: string;
  /**
   * exif data colorSpace
   */
  colorSpace?: string;
  /**
   * exif data contrast
   */
  contrast?: string;
  /**
   * exif data createDate
   */
  createDate?: string;
  /**
   * exif data customRendered
   */
  customRendered?: string;
  /**
   * exif data dateTimeOriginal
   */
  dateTimeOriginal?: string;
  /**
   * exif data digitalZoomRatio
   */
  digitalZoomRatio?: string;
  /**
   * exif data exifImageHeight
   */
  exifImageHeight?: string;
  /**
   * exif data exifImageWidth
   */
  exifImageWidth?: string;
  /**
   * exif data exposureCompensation
   */
  exposureCompensation?: string;
  /**
   * exif data exposureMode
   */
  exposureMode?: string;
  /**
   * exif data exposureProgram
   */
  exposureProgram?: string;
  /**
   * exif data exposureTime
   */
  exposureTime?: string;
  /**
   * exif data flash
   */
  flash?: string;
  /**
   * exif data fNumber
   */
  fNumber?: string;
  /**
   * exif data focalLength
   */
  focalLength?: string;
  /**
   * exif data focalLengthIn35mmFormat
   */
  focalLengthIn35mmFormat?: string;
  /**
   * exif data gpsAltitude
   */
  gpsAltitude?: string;
  /**
   * exif data gpsAltitudeRef
   */
  gpsAltitudeRef?: string;
  /**
   * exif data gpsDateStamp
   */
  gpsDateStamp?: string;
  /**
   * exif data gpsDOP
   */
  gpsDOP?: string;
  /**
   * exif data gpsLatitude
   */
  gpsLatitude?: string;
  /**
   * exif data gpsLatitudeRef
   */
  gpsLatitudeRef?: string;
  /**
   * exif data gpsLongitude
   */
  gpsLongitude?: string;
  /**
   * exif data gpsLongitudeRef
   */
  gpsLongitudeRef?: string;
  /**
   * exif data gpsTimeStamp
   */
  gpsTimeStamp?: string;
  /**
   * exif data gpsVersionID
   */
  gpsVersionID?: string;
  /**
   * exif data extracted for imageHeight
   */
  imageHeight?: string;
  /**
   * exif data extracted for imageWidth
   */
  imageWidth?: string;
  /**
   * exif data extracted for interopIndex
   */
  interopIndex?: string;
  /**
   * exif data extracted for ISO
   */
  ISO?: string;
  /**
   * exif data extracted for make
   */
  make?: string;
  /**
   * exif data extracted for maxApertureValue
   */
  maxApertureValue?: string;
  /**
   * exif data extracted for meteringMode
   */
  meteringMode?: string;
  /**
   * exif data extracted for model
   */
  model?: string;
  /**
   * exif data extracted for modifyDate
   */
  modifyDate?: string;
  /**
   * exif data extracted for orientation
   */
  orientation?: string;
  /**
   * exif data extracted for resolutionUnit
   */
  resolutionUnit?: string;
  /**
   * exif data extracted for saturation
   */
  saturation?: string;
  /**
   * exif data extracted for sceneCaptureType
   */
  sceneCaptureType?: string;
  /**
   * exif data extracted for sensingMethod
   */
  sensingMethod?: string;
  /**
   * exif data extracted for sharpness
   */
  sharpness?: string;
  /**
   * exif data extracted for shutterSpeedValue
   */
  shutterSpeedValue?: string;
  /**
   * exif data extracted for software
   */
  software?: string;
  /**
   * exif data extracted for subjectDistance
   */
  subjectDistance?: string;
  /**
   * exif data extracted for subjectDistanceRange
   */
  subjectDistanceRange?: string;
  /**
   * exif data extracted for subSecTime
   */
  subSecTime?: string;
  /**
   * exif data extracted for subSecTimeDigitized
   */
  subSecTimeDigitized?: string;
  /**
   * exif data extracted for subSecTimeOriginal
   */
  subSecTimeOriginal?: string;
  /**
   * exif data extracted for whiteBalance
   */
  whiteBalance?: string;
  /**
   * exif data extracted for xResolution
   */
  xResolution?: string;
  /**
   * exif data extracted for yCbCrPositioning
   */
  yCbCrPositioning?: string;
  /**
   * exif data extracted for yResolution
   */
  yResolution?: string;
  svg?: string;
}

export interface PatchPostRequestBodyI {
  id?: string;
  rotate?: 0 | 90 | 180 | 270;
  /**
   * Integer unix epoch timestamp
   */
  timestamp?: number;
  /**
   * Date time from legacy tumblr images
   */
  date?: string;
  /**
   * Original URL from legacy tumblr images
   */
  originalUrl?: string;
  /**
   * Descrtipion/caption for the post
   */
  description?: string;
  key?: string;
  status?: "active" | "deleted";
  createdAt?: string;
  updatedAt?: string;
  isPending?: boolean;
  tags?: string[];
  etag?: string;
  /**
   * exif data extracted
   */
  apertureValue?: string;
  /**
   * exif data brightnessValue
   */
  brightnessValue?: string;
  /**
   * exif data colorSpace
   */
  colorSpace?: string;
  /**
   * exif data contrast
   */
  contrast?: string;
  /**
   * exif data createDate
   */
  createDate?: string;
  /**
   * exif data customRendered
   */
  customRendered?: string;
  /**
   * exif data dateTimeOriginal
   */
  dateTimeOriginal?: string;
  /**
   * exif data digitalZoomRatio
   */
  digitalZoomRatio?: string;
  /**
   * exif data exifImageHeight
   */
  exifImageHeight?: string;
  /**
   * exif data exifImageWidth
   */
  exifImageWidth?: string;
  /**
   * exif data exposureCompensation
   */
  exposureCompensation?: string;
  /**
   * exif data exposureMode
   */
  exposureMode?: string;
  /**
   * exif data exposureProgram
   */
  exposureProgram?: string;
  /**
   * exif data exposureTime
   */
  exposureTime?: string;
  /**
   * exif data flash
   */
  flash?: string;
  /**
   * exif data fNumber
   */
  fNumber?: string;
  /**
   * exif data focalLength
   */
  focalLength?: string;
  /**
   * exif data focalLengthIn35mmFormat
   */
  focalLengthIn35mmFormat?: string;
  /**
   * exif data gpsAltitude
   */
  gpsAltitude?: string;
  /**
   * exif data gpsAltitudeRef
   */
  gpsAltitudeRef?: string;
  /**
   * exif data gpsDateStamp
   */
  gpsDateStamp?: string;
  /**
   * exif data gpsDOP
   */
  gpsDOP?: string;
  /**
   * exif data gpsLatitude
   */
  gpsLatitude?: string;
  /**
   * exif data gpsLatitudeRef
   */
  gpsLatitudeRef?: string;
  /**
   * exif data gpsLongitude
   */
  gpsLongitude?: string;
  /**
   * exif data gpsLongitudeRef
   */
  gpsLongitudeRef?: string;
  /**
   * exif data gpsTimeStamp
   */
  gpsTimeStamp?: string;
  /**
   * exif data gpsVersionID
   */
  gpsVersionID?: string;
  /**
   * exif data extracted for imageHeight
   */
  imageHeight?: string;
  /**
   * exif data extracted for imageWidth
   */
  imageWidth?: string;
  /**
   * exif data extracted for interopIndex
   */
  interopIndex?: string;
  /**
   * exif data extracted for ISO
   */
  ISO?: string;
  /**
   * exif data extracted for make
   */
  make?: string;
  /**
   * exif data extracted for maxApertureValue
   */
  maxApertureValue?: string;
  /**
   * exif data extracted for meteringMode
   */
  meteringMode?: string;
  /**
   * exif data extracted for model
   */
  model?: string;
  /**
   * exif data extracted for modifyDate
   */
  modifyDate?: string;
  /**
   * exif data extracted for orientation
   */
  orientation?: string;
  /**
   * exif data extracted for resolutionUnit
   */
  resolutionUnit?: string;
  /**
   * exif data extracted for saturation
   */
  saturation?: string;
  /**
   * exif data extracted for sceneCaptureType
   */
  sceneCaptureType?: string;
  /**
   * exif data extracted for sensingMethod
   */
  sensingMethod?: string;
  /**
   * exif data extracted for sharpness
   */
  sharpness?: string;
  /**
   * exif data extracted for shutterSpeedValue
   */
  shutterSpeedValue?: string;
  /**
   * exif data extracted for software
   */
  software?: string;
  /**
   * exif data extracted for subjectDistance
   */
  subjectDistance?: string;
  /**
   * exif data extracted for subjectDistanceRange
   */
  subjectDistanceRange?: string;
  /**
   * exif data extracted for subSecTime
   */
  subSecTime?: string;
  /**
   * exif data extracted for subSecTimeDigitized
   */
  subSecTimeDigitized?: string;
  /**
   * exif data extracted for subSecTimeOriginal
   */
  subSecTimeOriginal?: string;
  /**
   * exif data extracted for whiteBalance
   */
  whiteBalance?: string;
  /**
   * exif data extracted for xResolution
   */
  xResolution?: string;
  /**
   * exif data extracted for yCbCrPositioning
   */
  yCbCrPositioning?: string;
  /**
   * exif data extracted for yResolution
   */
  yResolution?: string;
}

export interface PatchPostPathI {
  id: string;
}

export interface DelPostPathI {
  /**
   * uuid of post
   */
  id: string;
}


export default class ApiClient {
  
  /**
   * Setting a property on the user session cookie tokenz
   *
   * @returns {Promise<SetUserResponseBodyI | ErrorI>}
   */      
  public async setUser({ requestBody }: BodyOnly<SetUserRequestBodyI>) {
    try {
      
      const { data } = await axios.post<SetUserResponseBodyI>(`/v1/user/`, requestBody);
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }


  /**
   * Get signed upload url
   *
   * @returns {Promise<UploadResponseBodyI | ErrorI>}
   */      
  public async upload({ requestBody }: BodyOnly<UploadQueryI>) {
    try {
      
      const { data } = await axios.get<UploadResponseBodyI>(`/v1/upload?${stringify(requestBody)}`);
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }


  /**
   * Get Tags
   *
   * @returns {Promise<GetTagsResponseBodyI | ErrorI>}
   */      
  public async getTags() {
    try {
      
      const { data } = await axios.get<GetTagsResponseBodyI>(`/v1/tags/`);
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }


  /**
   * Create tag
   *
   * @returns {Promise<PostTagsResponseBodyI | ErrorI>}
   */      
  public async postTags({ requestBody }: BodyOnly<PostTagsRequestBodyI>) {
    try {
      
      const { data } = await axios.post<PostTagsResponseBodyI>(`/v1/tags/`, requestBody);
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }


  /**
   * User refreshed cookie
   *
   * @returns {Promise<RefreshResponseBodyI | ErrorI>}
   */      
  public async refresh() {
    try {
      
      const { data } = await axios.post<RefreshResponseBodyI>(`/v1/refresh/`);
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }


  /**
   * Gets the index of a post by timestamp
   *
   * @returns {Promise<GetPostsIndexResponseBodyI | ErrorI>}
   */      
  public async getPostsIndex({ requestBody }: BodyOnly<GetPostsIndexQueryI>) {
    try {
      
      const { data } = await axios.get<GetPostsIndexResponseBodyI>(`/v1/posts/getIndex?${stringify(requestBody)}`);
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }


  /**
   * Delete bulk posts
   *
   * @returns {Promise<void | ErrorI>}
   */      
  public async deleteBulkPosts({ requestBody }: BodyOnly<DeleteBulkPostsRequestBodyI>) {
    try {
      
      const { data } = await axios.delete<void>(`/v1/posts/bulk/`);
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }


  /**
   * Get Posts
   *
   * @returns {Promise<void | ErrorI>}
   */      
  public async postPosts({ requestBody }: BodyOnly<PostPostsRequestBodyI>) {
    try {
      
      const { data } = await axios.patch<void>(`/v1/posts/bulk/`, requestBody);
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }


  /**
   * Get Posts
   *
   * @returns {Promise<GetPostsResponseBodyI | ErrorI>}
   */      
  public async getPosts({ requestBody }: BodyOnly<GetPostsQueryI>) {
    try {
      
      const { data } = await axios.get<GetPostsResponseBodyI>(`/v1/posts?${stringify(requestBody)}`);
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }


  /**
   * Create Post
   *
   * @returns {Promise<CreatePostResponseBodyI | ErrorI>}
   */      
  public async createPost({ requestBody }: BodyOnly<CreatePostRequestBodyI>) {
    try {
      
      const { data } = await axios.post<CreatePostResponseBodyI>(`/v1/posts/`, requestBody);
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }


  /**
   * Log user logout
   *
   * @returns {Promise<void | ErrorI>}
   */      
  public async logout() {
    try {
      
      const { data } = await axios.post<void>(`/v1/logout/`);
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }


  /**
   * Log user in
   *
   * @returns {Promise<LoginResponseBodyI | ErrorI>}
   */      
  public async login({ requestBody }: BodyOnly<LoginRequestBodyI>) {
    try {
      
      const { data } = await axios.post<LoginResponseBodyI>(`/v1/login/`, requestBody);
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }


  /**
   * User requested an invite
   *
   * @returns {Promise<void | ErrorI>}
   */      
  public async invitation({ requestBody }: BodyOnly<InvitationRequestBodyI>) {
    try {
      
      const { data } = await axios.post<void>(`/v1/invitation/`, requestBody);
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }


  /**
   * Get Posts associated with a tag
   *
   * @returns {Promise<GetPostsByTagResponseBodyI | ErrorI>}
   */      
  public async getPostsByTag({ requestParams }: PathOnly<GetPostsByTagPathI>) {
    try {
      const { tagId } = requestParams;
      const { data } = await axios.get<GetPostsByTagResponseBodyI>(`/v1/tags/${tagId}/posts/`);
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }


  /**
   * Get Post
   *
   * @returns {Promise<GetPostResponseBodyI | ErrorI>}
   */      
  public async getPost({ requestParams }: PathOnly<GetPostPathI>) {
    try {
      const { id } = requestParams;
      const { data } = await axios.get<GetPostResponseBodyI>(`/v1/posts/${id}/`);
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }


  /**
   * Patch Posts
   *
   * @returns {Promise<PatchPostResponseBodyI | ErrorI>}
   */      
  public async patchPost({ requestBody, requestParams }: BodyAndPath<PatchPostRequestBodyI, PatchPostPathI>) {
    try {
      const { id } = requestParams;
      const { data } = await axios.patch<PatchPostResponseBodyI>(`/v1/posts/${id}/`, requestBody);
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }


  /**
   * Delete Post
   *
   * @returns {Promise<void | ErrorI>}
   */      
  public async delPost({ requestParams }: PathOnly<DelPostPathI>) {
    try {
      const { id } = requestParams;
      const { data } = await axios.delete<void>(`/v1/posts/${id}/`);
      return data;
    } catch(e) {
      throw e?.response?.data as ErrorI;
    }
    
  }

}

export const client = new ApiClient();

