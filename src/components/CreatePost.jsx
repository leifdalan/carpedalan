// import React, { useContext, useEffect, useState } from 'react';
// import { bool, number, shape, string } from 'prop-types';
// import request from 'superagent';

// import { API_PATH } from '../../shared/constants';
// import Form from '../form/Form';
// import { Posts } from '../providers/PostsProvider';
// import log from '../utils/log';
// import { FormData } from '../utils/globals';

// import CreatePostForm from './CreatPostForm';

// const CreatePost = ({ preview, fileInputRef, index, shouldSubmit }) => {
//   const { invalidateAll } = useContext(Posts);
//   const [submitting, setSubmitting] = useState(false);
//   const [submitSucceeded, setSubmitSucceeded] = useState(false);
//   const [submitFailed, setSubmitFailed] = useState(false);

//   useEffect(
//     () => {
//       if (shouldSubmit) {
//         submitToApi();
//       }

//       return null;
//     },
//     [shouldSubmit],
//   );

//   return (
//     <>
//       <CreatePostForm
//         preview={preview}
//         submitting={submitting}
//         submitFailed={submitFailed}
//         submitSucceeded={submitSucceeded}
//       />
//     </>
//   );
// };

// CreatePost.defaultProps = {
//   preview: null,
// };

// CreatePost.propTypes = {
//   preview: shape({
//     url: string.isRequired,
//     width: number.isRequired,
//     height: number.isRequired,
//   }),
//   fileInputRef: shape({}).isRequired,
//   index: number.isRequired,
//   shouldSubmit: bool.isRequired,
// };

// export default CreatePost;
