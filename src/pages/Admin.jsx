import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import exifReader from 'exifreader';
import styled from 'styled-components';
import camelCase from 'lodash/camelCase';
import omit from 'lodash/omit';

import CreatPostForm from '../components/CreatPostForm';
import { Posts } from '../providers/PostsProvider';
import { BRAND_COLOR, getThemeValue } from '../styles';
import Button from '../styles/Button';
import FlexContainer from '../styles/FlexContainer';
import Title from '../styles/Title';
import Wrapper from '../styles/Wrapper';

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
  const [savingState, setSavingState] = useState({});
  const [submit, setSubmitAll] = useState(false);
  const [formMap, setFormMap] = useState(false);
  const fileInputRef = useRef();
  const submitAll = async () => {
    let innerSavingState = {};
    await Object.keys(formMap).reduce(async (promiseChain, index) => {
      let chainedResponses = [];
      try {
        chainedResponses = await promiseChain;
        innerSavingState = {
          ...innerSavingState,
          [index]: {
            state: 'pending',
          },
        };
        const fileValue = fileInputRef.current.files[index];
        const formData = new FormData();
        Object.keys(formMap[index]).forEach(key =>
          formData.append(key, formMap[index][key]),
        );
        if (formMap[index].description === 'fail') throw Error('failure');
        formData.append('photo', fileValue);
        setSavingState(innerSavingState);
        const response = await createPost(formData, index);
        innerSavingState = {
          ...innerSavingState,
          [index]: {
            state: 'fulfilled',
            value: response,
          },
        };
        return [...chainedResponses, response];
      } catch (e) {
        innerSavingState = {
          ...innerSavingState,
          [index]: {
            state: 'rejected',
            value: e,
          },
        };
        return [...chainedResponses, e];
      } finally {
        setSavingState(innerSavingState);
      }
    }, Promise.resolve([]));
    setSubmitAll(false);
  };

  useEffect(
    () => {
      if (submit) submitAll();
      return null;
    },
    [submit],
  );

  useEffect(
    () => {
      const newForms = Array.from(files).reduce(
        (acc, _, index) => ({
          ...acc,
          [index]: {
            tag: [],
            description: '',
          },
        }),
        {},
      );
      setFormMap(newForms);
    },

    [files],
  );
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

  const handleFormChange = (values, index) => {
    setFormMap({ ...formMap, [index]: values });
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
            <Fragment key={file.name}>
              <CreatPostForm
                key={file.name}
                index={index}
                fileInputRef={fileInputRef}
                preview={previews[index]}
                savingState={savingState[index]}
                onChange={handleFormChange}
              />
              <HR />
            </Fragment>
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
