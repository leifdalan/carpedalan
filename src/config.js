import { window } from './utils/globals';

export const { CDN_DOMAIN } = process.env; // eslint-disable-line import/prefer-default-export

export const { cdn, ci, nodeEnv, status } = window.__META__; // eslint-disable-line no-underscore-dangle
