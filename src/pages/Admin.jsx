import React, { useContext, useRef, useState } from 'react';
import exifReader from 'exifreader';

import CreatPostForm from '../components/CreatPostForm';
import Form from '../form/Form';
import { Posts } from '../providers/PostsProvider';
import Wrapper from '../styles/Wrapper';
import log from '../utils/log';

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
              resolve({
                url,
                orientation,
                height: data.ImageLength.value,
                width: data.ImageWidth.value,
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
    <Wrapper>
      <input
        data-test="multiUploader"
        type="file"
        ref={fileInputRef}
        multiple
        onChange={handleChange}
      />
      {Array.from(files).map((file, index) => (
        <Form
          key={file.name}
          shouldSubmit={submit}
          onSubmit={submitToApi(index)}
          initial={{ tags: [] }}
          normalize={values => ({
            ...values,
            tags: values.tags.map(({ value }) => value),
          })}
        >
          <CreatPostForm
            index={index}
            fileInputRef={fileInputRef}
            preview={previews[index]}
          />
        </Form>
      ))}
      <button
        type="button"
        data-test="submitAll"
        onClick={e => {
          e.preventDefault();
          setSubmitAll(true);
        }}
      >
        Submit All
      </button>
    </Wrapper>
  );
};

export default Admin;
