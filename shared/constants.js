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
const SQIP = 'sqip';
const EXIFPROPS = {
  ApertureValue: 'apertureValue',
  BrightnessValue: 'brightnessValue',
  ColorSpace: 'colorSpace',
  Contrast: 'contrast',
  CreateDate: 'createDate',
  CustomRendered: 'customRendered',
  DateTimeOriginal: 'dateTimeOriginal',
  DigitalZoomRatio: 'digitalZoomRatio',
  ExifImageHeight: 'exifImageHeight',
  ExifImageWidth: 'exifImageWidth',
  ExposureCompensation: 'exposureCompensation',
  ExposureMode: 'exposureMode',
  ExposureProgram: 'exposureProgram',
  ExposureTime: 'exposureTime',
  Flash: 'flash',
  FNumber: 'fNumber',
  FocalLength: 'focalLength',
  FocalLengthIn35mmFormat: 'focalLengthIn35mmFormat',
  GPSAltitude: 'gpsAltitude',
  GPSAltitudeRef: 'gpsAltitudeRef',
  GPSDateStamp: 'gpsDateStamp',
  GPSDOP: 'gpsDOP',
  GPSLatitude: 'gpsLatitude',
  GPSLatitudeRef: 'gpsLatitudeRef',
  GPSLongitude: 'gpsLongitude',
  GPSLongitudeRef: 'gpsLongitudeRef',
  GPSTimeStamp: 'gpsTimeStamp',
  GPSVersionID: 'gpsVersionID',
  ImageHeight: 'imageHeight',
  ImageWidth: 'imageWidth',
  InteropIndex: 'interopIndex',
  ISO: 'ISO',
  Make: 'make',
  MaxApertureValue: 'maxApertureValue',
  MeteringMode: 'meteringMode',
  Model: 'model',
  ModifyDate: 'modifyDate',
  Orientation: 'orientation',
  ResolutionUnit: 'resolutionUnit',
  Saturation: 'saturation',
  SceneCaptureType: 'sceneCaptureType',
  SensingMethod: 'sensingMethod',
  Sharpness: 'sharpness',
  ShutterSpeedValue: 'shutterSpeedValue',
  Software: 'software',
  SubjectDistance: 'subjectDistance',
  SubjectDistanceRange: 'subjectDistanceRange',
  SubSecTime: 'subSecTime',
  SubSecTimeDigitized: 'subSecTimeDigitized',
  SubSecTimeOriginal: 'subSecTimeOriginal',
  WhiteBalance: 'whiteBalance',
  XResolution: 'xResolution',
  YCbCrPositioning: 'yCbCrPositioning',
  YResolution: 'yResolution',
};

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

const SIZES = [
  {
    width: 250,
  },
  {
    width: 768,
  },
  {
    width: 1536,
  },
  {
    width: 250,
    height: 250,
  },
];

const SMALL = 'small';
const MEDIUM = 'medium';
const HIRES = 'hires';
const THUMB = 'thumb';

const SIZE_MAP = {
  [SMALL]: SIZES[0],
  [MEDIUM]: SIZES[1],
  [HIRES]: SIZES[2],
  [THUMB]: SIZES[3],
};

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
  SIZES,
  SIZE_MAP,
  SMALL,
  MEDIUM,
  HIRES,
  THUMB,
  EXIFPROPS,
  SQIP,
};
