import React, { useContext, useEffect, useRef, useState } from 'react';
import { func, number, shape, string } from 'prop-types';
import styled, { css } from 'styled-components';

import InputField from '../fields/InputField';
import Drowpdown from '../fields/Dropdown';
import { Posts } from '../providers/PostsProvider';
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

const CreatePost = ({ preview, index, savingState, onChange }) => {
  const { tags } = useContext(Tag);
  const { progressMap } = useContext(Posts);
  const [description, setDescription] = useState('');
  const [tagInput, setTags] = useState([]);
  const ref = useRef();

  useEffect(
    () => {
      onChange({ tag: tagInput, description }, index);
    },
    [tagInput, description, ref],
  );

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
        <InputField
          name="description"
          placeholder="Description"
          input={{
            onChange: setDescription,
            value: description,
          }}
        />
        <Drowpdown
          name="tags"
          options={tags.map(tag => ({
            value: tag.id,
            label: tag.name,
          }))}
          isMulti
          placeholder="Type or click for tags"
          input={{
            onChange: setTags,
            value: tagInput,
          }}
        />
        <div>
          {savingState.state === 'queued' ? 'queued' : null}
          {progressMap[index] ? <div>{progressMap[index]}</div> : null}

          {savingState.state === 'rejected'
            ? `Submit failed ${index} ${savingState.value}`
            : null}
          {savingState.state === 'fulfilled'
            ? `Submit succeeded ${index}`
            : null}

          {savingState.state === 'pending' ? `Submitting ${index}` : null}
        </div>
      </>
    </>
  );
};

CreatePost.defaultProps = {
  preview: null,
  savingState: {},
};

CreatePost.propTypes = {
  preview: shape({
    url: string.isRequired,
    width: number.isRequired,
    height: number.isRequired,
  }),
  index: number.isRequired,
  savingState: shape({
    state: string.isRequired,
    value: shape({ id: string.isRequired }),
  }),
  onChange: func.isRequired,
};
export default CreatePost;
