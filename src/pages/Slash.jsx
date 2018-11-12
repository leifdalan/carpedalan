import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import request from 'superagent';

import { API_IMAGES_PATH } from '../../shared/constants';
import log from '../utils/log';

export default function Slash() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  useEffect(async () => {
    try {
      setLoading(true);
      const response = await request.get('/api/posts');

      setPosts(response.body);
    } catch (e) {
      log.error('loading failed');
    } finally {
      setLoading(false);
    }
  }, []);
  if (loading) return 'loading';

  return posts.map(({ id, description, key, tags }) => (
    <Fragment key={id}>
      <img alt={description} src={`${API_IMAGES_PATH}/${key}`} />
      <div>{description}</div>
      {tags.map(({ name }) => (
        <Link to={`/tag/${name}`}>{`#${name}`}</Link>
      ))}
    </Fragment>
  ));
}
