import React from 'react';

import InputField from '../fields/InputField';
import Field from '../form/Field';
import Submit from '../form/Submit';

const CreatePost = ({
  preview,
  tags,
  submitting,
  submitSucceeded,
  submitFailed,
}) => (
  <>
    {submitFailed ? 'Submit Failed' : null}
    {submitting ? 'Submitting' : null}
    {submitSucceeded ? (
      'Submit Succeeded'
    ) : (
      <>
        <Field name="description" component={InputField} />
        {preview ? <img alt="preview" width="100" src={preview} /> : null}
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
        />
      </>
    )}
  </>
);

export default CreatePost;
