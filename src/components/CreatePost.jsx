import React, { useContext, useEffect, useState } from 'react';
import { bool, number, shape, string } from 'prop-types';
import request from 'superagent';

import { API_PATH } from '../../shared/constants';
import Form from '../form/Form';
import { Posts } from '../providers/PostsProvider';
import log from '../utils/log';
import { FormData } from '../utils/globals';

import CreatePostForm from './CreatPostForm';

const CreatePost = ({ preview, fileInputRef, index, shouldSubmit }) => {
  const { invalidateAll } = useContext(Posts);
  const [submitting, setSubmitting] = useState(false);
  const [submitSucceeded, setSubmitSucceeded] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const submitToApi = async (values = {}) => {
    try {
      setSubmitting(true);
      const fileValue = fileInputRef.current.files[index];
      const formData = new FormData();
      Object.keys(values).forEach(key => formData.append(key, values[key]));
      formData.append('photo', fileValue);

      await request
        .post(`${API_PATH}/posts`)
        .send(formData)
        .on('progress', e => {
          log.info('progress', e.percent);
        });
      invalidateAll();
      setSubmitSucceeded(true);
    } catch (e) {
      setSubmitFailed(true);
      throw e;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(
    () => {
      if (shouldSubmit) {
        submitToApi();
      }

      return null;
    },
    [shouldSubmit],
  );

  return (
    <>
      <Form
        onSubmit={submitToApi}
        initial={{ tags: [] }}
        normalize={values => ({
          ...values,
          tags: values.tags.map(({ value }) => value),
        })}
      >
        <CreatePostForm
          preview={preview}
          submitting={submitting}
          submitFailed={submitFailed}
          submitSucceeded={submitSucceeded}
        />
      </Form>
    </>
  );
};

CreatePost.defaultProps = {
  preview: null,
};

CreatePost.propTypes = {
  preview: shape({
    url: string.isRequired,
    width: number.isRequired,
    height: number.isRequired,
  }),
  fileInputRef: shape({}).isRequired,
  index: number.isRequired,
  shouldSubmit: bool.isRequired,
};

export default CreatePost;
