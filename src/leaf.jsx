import React, { useEffect, useState } from 'react';
import request from 'superagent';

import { API_PATH } from '../shared/constants';

import InputField from './fields/InputField';
import Form from './form/Form';
import Field from './form/Field';
import Submit from './form/Submit';
import log from './utils/log';
import { FormData } from './utils/globals';

const Leaf = () => {
  const submitToApi = async values => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => formData.append(key, values[key]));

      await request
        .post(`${API_PATH}/posts`)
        .send(formData)
        .on('progress', e => {
          log.info('progress', e.percent);
        });
    } catch (e) {
      throw e;
    }
  };

  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);

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

  // const addTag =
  if (loading) return 'loading';

  return (
    <>
      <Form onSubmit={submitToApi} initial={{ tags: [] }}>
        <Field
          name="photo"
          component={({ input: { onChange } }) => {
            const handleChange = e => {
              onChange(e.target.files[0]);
            };
            return <input type="file" onChange={handleChange} />;
          }}
        />
        <Field name="description" component={InputField} />

        <Submit
          component={({ submit, text }) => <div onClick={submit}>{text}</div>}
          text="submit div"
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

export default Leaf;
