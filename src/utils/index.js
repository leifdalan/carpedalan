import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';

import { API_IMAGES_PATH } from '../../shared/constants';

export const formatDate = timestamp =>
  format(fromUnixTime(timestamp), 'MMM d YYYY', {
    awareOfUnicodeTokens: true,
  });

export const getImagePath = ({ post, size }) => {
  const { width, height } = size;
  return post.fake
    ? ''
    : `${API_IMAGES_PATH}/${width}${height ? `-${height}` : ''}/${
        post.key.split('/')[1]
      }.webp`;
};
