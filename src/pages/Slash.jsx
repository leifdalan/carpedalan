import React, { useContext, useRef, useState } from 'react';

import { User } from '..';

import isNumber from 'lodash/isNumber';

import { WRITE_USER } from '../../server/constants';
import Feed from '../components/Feed';
import Form from '../form/Form';
import { Posts } from '../providers/PostsProvider';
import log from '../utils/log';

export default function Slash() {
  const { posts, cache, patchPost } = useContext(Posts);
  const { user } = useContext(User);

  const [isEditing, setEditing] = useState(null);

  const listRef = useRef(null);

  const isAdmin = user === WRITE_USER;

  const handlePatchPost = id => async values => {
    await patchPost(id)(values);
    try {
      const editing = isEditing;
      setEditing(false);
      cache.clear(editing);
      listRef.current.recomputeRowHeights(editing);
      listRef.current.scrollToRow(editing);
    } catch (e) {
      log.error(e);
    }
  };

  let Wrap = 'div';
  let props = {};

  if (isAdmin) {
    Wrap = Form;
    if (isNumber(isEditing)) {
      props = {
        onSubmit: handlePatchPost(posts[isEditing].id),
        initial: {
          description: posts[isEditing].description,
          tags: posts[isEditing].tags.map(tag => ({
            value: tag.id,
            label: tag.name,
          })),
        },
        normalize: values => ({
          ...values,
          tags: values.tags.map(({ value }) => value),
        }),
      };
    }
  }
  return (
    <Wrap {...props}>
      <Feed isEditing={isEditing} setEditing={setEditing} />
    </Wrap>
  );
}
