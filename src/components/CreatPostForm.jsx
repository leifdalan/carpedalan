import React, { useContext } from 'react';
import { number, shape, string } from 'prop-types';
import styled, { css } from 'styled-components';

import InputField from '../fields/InputField';
import Drowpdown from '../fields/Dropdown';
import Field from '../form/Field';
import { FormContext } from '../form/Form';
import { Tag } from '../providers/TagProvider';
import log from '../utils/log';

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

const CreatePost = ({ preview, index }) => {
  const { tags } = useContext(Tag);
  const {
    meta,
    meta: { submitting, submitSucceeded, submitFailed },
  } = useContext(FormContext);
  log.error('meta', meta, index);

  return (
    <>
      <>
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
          name="description"
          component={InputField}
          placeholder="Description"
        />
        <Field
          name="tags"
          component={Drowpdown}
          options={tags.map(tag => ({
            value: tag.id,
            label: tag.name,
          }))}
          isMulti
          placeholder="Type or click for tags"
        />
        <div>
          {submitFailed ? 'Submit Failed' : null}
          {submitSucceeded ? `Submit succeeded ${index}` : null}

          {submitting ? `Submitting ${index}` : null}
        </div>
      </>
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
  index: number.isRequired,
};
export default CreatePost;
