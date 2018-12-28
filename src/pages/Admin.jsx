import React, { useContext, useEffect, useRef, useState } from 'react';

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

  const handleChange = e => {
    setFiles(Array.from(e.target.files));

    const newPreviews = Array.from(e.target.files).map(file =>
      URL.createObjectURL(file),
    );
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
      {files.map((file, index) => (
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
