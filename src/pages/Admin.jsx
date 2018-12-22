import React, { useEffect, useState } from 'react';
import { func, shape } from 'prop-types';
import request from 'superagent';

import { API_PATH } from '../../shared/constants';
import InputField from '../fields/InputField';
import Form from '../form/Form';
import Field from '../form/Field';
import Submit from '../form/Submit';
import log from '../utils/log';
import { FormData, FileReader } from '../utils/globals';

const FileInput = ({ input: { onChange }, localOnChange }) => {
  const handleChange = e => {
    onChange(e.target.files[0]);
    localOnChange(e.target.files[0]);
  };
  return <input type="file" onChange={handleChange} />;
};

FileInput.propTypes = {
  input: shape({
    onChange: func.isRequired,
  }).isRequired,
  localOnChange: func.isRequired,
};

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [tags, setTags] = useState([]);

  const submitToApi = async values => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => formData.append(key, values[key]));
      setSaving(true);
      await request
        .post(`${API_PATH}/posts`)
        .send(formData)
        .on('progress', e => {
          log.info('progress', e.percent);
        });
      setSaving(false);
    } catch (e) {
      throw e;
    }
  };

  const effect = async () => {
    try {
      setLoading(true);
      const response = await request.get('/api/tags');

      setTags(response.body);
    } catch (e) {
      log.error('loading failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    effect();
  }, []);

  if (loading) return 'loading';

  const handleChange = file => {
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Form onSubmit={submitToApi} initial={{ tags: [] }}>
        <Field
          name="photo"
          component={FileInput}
          localOnChange={handleChange}
        />
        <Field name="description" component={InputField} />
        {preview && <img width="199%" src={preview} />}
        <Submit
          component={({ submit, text }) => (
            <button type="button" onClick={submit}>
              {text}
            </button>
          )}
          text="submit"
        />
        <Field
          name="tags"
          component={({ input: { onChange, value } }) => {
            const handleClick = tagId => () => {
              onChange([...value, tagId]);
            };
            return tags.map(tag => (
              <div key={tag.id} onClick={handleClick(tag.id)}>
                {tag.name}
              </div>
            ));
          }}
          q
        />
      </Form>
    </>
  );
};

export default Admin;
