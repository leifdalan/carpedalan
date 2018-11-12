import React, { Fragment, useEffect, useState } from 'react';
import { shape } from 'prop-types';
import request from 'superagent';

import { API_PATH, API_IMAGES_PATH } from '../../shared/constants';
import log from '../utils/log';

export default function Tag(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  useEffect(async () => {
    setLoading(true);
    try {
      const response = await request(
        `${API_PATH}/tag/${props.match.params.tag}`,
      );
      setData(response.body);
      log.info(response);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);
  if (error) return 'error';
  if (loading) return 'loading';
  return data.map(({ id, description, key }) => (
    <Fragment key={id}>
      <img alt={description} src={`${API_IMAGES_PATH}/${key}`} />
      <div>{description}</div>
    </Fragment>
  ));
}

Tag.propTypes = {
  match: shape({}).isRequired,
};
