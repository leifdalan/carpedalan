import React, { useEffect, useState, useRef } from 'react';
import request from 'superagent';

import log from '../utils/log';
import CreatePost from '../components/CreatePost';

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [tags, setTags] = useState([]);
  const [submit, setSubmitAll] = useState(false);
  const fileInputRef = useRef();

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
  if (loading) return 'loading';

  const handleChange = e => {
    setFiles(Array.from(e.target.files));

    const newPreviews = Array.from(e.target.files).map(file =>
      URL.createObjectURL(file),
    );
    setPreviews(newPreviews);
  };

  return (
    <>
      <input type="file" ref={fileInputRef} multiple onChange={handleChange} />
      {files.map((file, index) => (
        <CreatePost
          index={index}
          key={file.name}
          fileInputRef={fileInputRef}
          preview={previews[index]}
          tags={tags}
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
