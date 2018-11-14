const API_PATH = '/api';
const IMAGES_PATH = '/images';
const API_IMAGES_PATH = `${API_PATH}${IMAGES_PATH}`;

const PHOTOS = 'photos';
// columns for photos
const APERTURE = 'aperture';
const CAMERA = 'camera';
const CREATEDAT = 'createdAt';
const DATE = 'date';
const DESCRIPTION = 'description';
const ETAG = 'etag';
const EXPOSURE = 'exposure';
const FOCALLENGTH = 'focalLength';
const HEIGHT = 'height';
const ID = 'id';
const ISO = 'ISO';
const KEY = 'key';
const ORIGINALURL = 'originalUrl';
const TIMESTAMP = 'timestamp';
const UPDATEDAT = 'updatedAt';
const STATUS = 'status';
const WIDTH = 'width';

const TAGS = 'tags';
// columns for tags
const NAME = 'name';

const PHOTOS_TAGS = 'photos_tags';
// columns for photos_tags
const PHOTO_ID = 'photoId';
const TAG_ID = 'tagId';

const ADMIN = 'write';
const READ_ONLY = 'read';

const ACTIVE = 'active';
const DELETED = 'deleted';

const isAdmin = user => user === ADMIN;

module.exports = {
  isAdmin,
  ADMIN,
  READ_ONLY,
  API_IMAGES_PATH,
  API_PATH,
  IMAGES_PATH,
  APERTURE,
  CAMERA,
  CREATEDAT,
  DATE,
  DESCRIPTION,
  ETAG,
  EXPOSURE,
  FOCALLENGTH,
  HEIGHT,
  ID,
  ISO,
  KEY,
  ORIGINALURL,
  STATUS,
  TAGS,
  TIMESTAMP,
  UPDATEDAT,
  WIDTH,
  ACTIVE,
  DELETED,
  PHOTOS,
  NAME,
  PHOTOS_TAGS,
  PHOTO_ID,
  TAG_ID,
};
