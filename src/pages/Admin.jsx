import React, { useContext, useEffect, useRef, useState } from 'react';
import exifReader from 'exifreader';

import CreatePost from '../components/CreatePost';
import { Tag } from '../providers/TagProvider';

const Admin = () => {
  const { loadingTags, loadTags } = useContext(Tag);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [submit, setSubmitAll] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    loadTags();
  }, []);
  if (loadingTags) return 'loading';

  const handleChange = async e => {
    setFiles(e.target.files);

    const newPreviewsPromises = Array.from(e.target.files).map(
      file =>
        new Promise(resolve => {
          const reader = new FileReader();
          const url = URL.createObjectURL(file);
          reader.onload = function() {
            const arrayBuffer = this.result;
            const data = exifReader.load(arrayBuffer);
            const orientation =
              data.Orientation.value === 6 ? 'portrait' : 'landscape';
            resolve({ url, orientation });
          };
          reader.readAsArrayBuffer(file);
        }),
    );
    const newPreviews = await Promise.all(newPreviewsPromises);
    setPreviews(newPreviews);
  };

  return (
    <>
      <input
        data-test="multiUploader"
        type="file"
        ref={fileInputRef}
        multiple
        onChange={handleChange}
      />
      {Array.from(files).map((file, index) => (
        <CreatePost
          index={index}
          key={file.name}
          fileInputRef={fileInputRef}
          preview={previews[index]}
          shouldSubmit={submit}
        />
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
    </>
  );
};

export default Admin;
