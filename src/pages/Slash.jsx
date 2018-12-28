import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import request from 'superagent';
import { stringify } from 'qs';

import { User } from '..';

import {
  API_IMAGES_PATH,
  API_PATH,
  isAdmin,
  DESCRIPTION,
  SIZE_MAP,
  MEDIUM,
} from '../../shared/constants';
import InputField from '../fields/InputField';
import Field from '../form/Field';
import Form from '../form/Form';
import Submit from '../form/Submit';
import log from '../utils/log';

export default function Slash() {
  const { user } = useContext(User);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState(null);
  const [isEditing, setEditing] = useState(false);

  const effect = async () => {
    try {
      setLoading(true);
      const apiCall = request.get(
        `${API_PATH}/posts${query ? `?${stringify(query)}` : ''}`,
      );
      const response = await apiCall;
      setPosts(response.body);
    } catch (e) {
      log.error('loading failed');
    } finally {
      setLoading(false);
    }
    return null;
  };

  useEffect(
    () => {
      effect();
      return null;
    },
    [query],
  );

  if (loading) return 'loading';

  const Wrapper = isEditing ? Form : Fragment;

  const handleSubmit = id => async values => {
    const response = await request.patch(`${API_PATH}/posts/${id}`, values);
    const newPosts = posts.map(post =>
      post.id === id ? { ...response, tags: post.tags } : post,
    );

    setPosts(newPosts);
  };

  const del = id => async () => {
    await request.delete(`${API_PATH}/posts/${id}`);
  };

  const getProps = (description, id) =>
    isEditing
      ? { initial: { [DESCRIPTION]: description }, onSubmit: handleSubmit(id) }
      : {};
  return (
    <>
      <div onClick={() => setQuery({ order: 'asc' })}>sort wootdesc</div>
      {posts.map(({ id, description, key, tags, width }) =>
        key ? (
          <Wrapper key={id} {...getProps(description, id)}>
            {width}
            <img
              alt={description}
              width="100%"
              src={`${API_IMAGES_PATH}/${SIZE_MAP[MEDIUM].width}/${
                key.split('/')[1]
              }.webp`}
            />
            {isEditing ? (
              <Field name={DESCRIPTION} component={InputField} />
            ) : (
              <div>{description || null}</div>
            )}

            {tags.map(({ name, id: tagId }) => (
              <Link key={tagId} to={`/tag/${name}`}>{`#${name}`}</Link>
            ))}
            {isAdmin(user) && !isEditing ? (
              <div onClick={() => setEditing(true)}>edit</div>
            ) : null}
            {isAdmin(user) && isEditing ? <Submit /> : null}
            {isAdmin(user) && isEditing ? (
              <div onClick={() => setEditing(false)}>unedit</div>
            ) : null}
            {isAdmin(user) && isEditing ? (
              <button type="button" onClick={del(id)}>
                del
              </button>
            ) : null}
          </Wrapper>
        ) : null,
      )}
    </>
  );
}
