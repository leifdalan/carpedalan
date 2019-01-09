import React, { useContext, useRef, useState } from 'react';
import exifReader from 'exifreader';
import styled from 'styled-components';
import camelCase from 'lodash/camelCase';
import omit from 'lodash/omit';

import CreatPostForm from '../components/CreatPostForm';
import Form from '../form/Form';
import { Posts } from '../providers/PostsProvider';
import { BRAND_COLOR, getThemeValue } from '../styles';
import Button from '../styles/Button';
import FlexContainer from '../styles/FlexContainer';
import Title from '../styles/Title';
import Wrapper from '../styles/Wrapper';
import log from '../utils/log';

const Input = styled.input`
  display: none;
`;

const Flex = styled(FlexContainer)`
  width: 100%;
  height: 100%;
  background: ${getThemeValue(BRAND_COLOR)};
`;

const StyledButton = styled(Button)`
  position: fixed;
  bottom: 2em;
  right: 2em;
`;

const HR = styled.hr`
  margin: 3em 0;
`;

const Admin = () => {
  const { createPost } = useContext(Posts);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [submit, setSubmitAll] = useState(false);
  const fileInputRef = useRef();

  const handleChange = async e => {
    setFiles(e.target.files);

    const newPreviewsPromises = Array.from(e.target.files).map(
      file =>
        new Promise(resolve => {
          const reader = new FileReader();
          const url = URL.createObjectURL(file);
          reader.onload = function() {
            try {
              const arrayBuffer = this.result;
              const data = exifReader.load(arrayBuffer);
              const orientation =
                data.Orientation.value === 6 ? 'portrait' : 'landscape';

              const exifData = Object.keys(data).reduce(
                (acc, key) => ({
                  ...acc,
                  [camelCase(key)]: data[key].value,
                }),
                {},
              );

              resolve({
                url,
                orientation,
                height: data.ImageLength.value,
                width: data.ImageWidth.value,
                exifData: omit(exifData, 'makerNote'),
              });
            } catch (er) {
              resolve({ url, orientation: 'landscape' });
            }
          };
          reader.readAsArrayBuffer(file);
        }),
    );
    const newPreviews = await Promise.all(newPreviewsPromises);
    setPreviews(newPreviews);
  };

  const submitToApi = index => async (values = {}) => {
    try {
      const fileValue = fileInputRef.current.files[index];
      const formData = new FormData();
      Object.keys(values).forEach(key => formData.append(key, values[key]));
      formData.append('photo', fileValue);
      await createPost(formData);
    } catch (e) {
      log.error(e);
    }
  };

  return (
    <>
      <Input
        id="multiUploader"
        data-test="multiUploader"
        type="file"
        ref={fileInputRef}
        multiple
        onChange={handleChange}
      />

      {!files.length ? (
        <Flex as="label" htmlFor="multiUploader">
          <Title>Click to Upload</Title>
        </Flex>
      ) : (
        <Wrapper>
          {Array.from(files).map((file, index) => (
            <>
              <Form
                key={file.name}
                shouldSubmit={submit}
                onSubmit={submitToApi(index)}
                initial={{ tags: [] }}
                normalize={values => ({
                  ...values,
                  ...previews[index].exifData,
                  tags: values.tags.map(({ value }) => value),
                })}
              >
                <CreatPostForm
                  index={index}
                  fileInputRef={fileInputRef}
                  preview={previews[index]}
                />
              </Form>
              <HR />
            </>
          ))}
          <StyledButton
            type="button"
            data-test="submitAll"
            onClick={e => {
              e.preventDefault();
              setSubmitAll(true);
            }}
          >
            Submit All
          </StyledButton>
        </Wrapper>
      )}
    </>
  );
};

export default Admin;
