import React, { useContext } from 'react';
import { bool, number, shape, string } from 'prop-types';
import styled, { css } from 'styled-components';

import InputField from '../fields/InputField';
import Drowpdown from '../fields/Dropdown';
import Field from '../form/Field';
import Submit from '../form/Submit';
import { Tag } from '../providers/TagProvider';

import Picture from './Picture';

const Img = styled.div`
  ${props =>
    props.orientation === 'portrait'
      ? css`
          padding-top: 100%;
          position: relative;
          > div {
            position: absolute;
            top: 0;
            left: 0;
            transform-origin: 37.5%;
            transform: rotate(90deg);
          }
        `
      : null}
`;

const CreatePost = ({ preview, submitting, submitSucceeded, submitFailed }) => {
  const { tags } = useContext(Tag);

  return (
    <>
      {submitFailed ? 'Submit Failed' : null}
      {submitting ? 'Submitting' : null}
      {submitSucceeded ? (
        'Submit Succeeded'
      ) : (
        <>
          <Field name="description" component={InputField} />
          {preview ? (
            <Img orientation={preview.orientation}>
              <Picture
                alt="preview"
                width="100%"
                src={preview.url}
                placeholderColor="white"
                shouldShowImage
                ratio={preview.height / preview.width}
              />
            </Img>
          ) : null}

          <Field
            name="tags"
            component={Drowpdown}
            options={tags.map(tag => ({
              value: tag.id,
              label: tag.name,
            }))}
            isMulti
          />
          <Submit
            component={({ submit, text }) => (
              <button type="button" onClick={submit}>
                {text}
              </button>
            )}
            text="Save"
          />
        </>
      )}
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
  submitting: bool.isRequired,
  submitSucceeded: bool.isRequired,
  submitFailed: bool.isRequired,
};
export default CreatePost;
