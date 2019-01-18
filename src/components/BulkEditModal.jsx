import React, { useContext, useState } from 'react';
import { func, shape } from 'prop-types';

import Dropdown from '../fields/Dropdown';
import InputField from '../fields/InputField';
import { Tag } from '../providers/TagProvider';
import { Posts } from '../providers/PostsProvider';
import Button from '../styles/Button';
import FlexContainer from '../styles/FlexContainer';

import Dialog from './Dialog';

export default function BulkEditModal({ ids, showBulkModal }) {
  const { tags } = useContext(Tag);
  const { bulkEdit } = useContext(Posts);
  const [description, setDescription] = useState('');
  const [inputTags, setTags] = useState([]);
  const idArray = Object.keys(ids).reduce(
    (acc, id) => [...acc, ...(id ? [ids[id]] : [])],
    [],
  );

  const handleSubmit = async () => {
    await bulkEdit({
      ids: idArray,
      description,
      tags: inputTags.map(({ value }) => value),
    });
    showBulkModal(false);
  };
  return (
    <Dialog type="wide">
      <InputField input={{ onChange: setDescription, value: description }} />
      <Dropdown
        name="tags"
        component={Dropdown}
        options={tags.map(tag => ({
          value: tag.id,
          label: tag.name,
        }))}
        input={{
          onChange: setTags,
          value: inputTags,
        }}
        isMulti
      />
      <FlexContainer justifyContent="space-between">
        <Button onClick={handleSubmit}>{`Edit (${idArray.length})`}</Button>
        <Button type="neutral" onClick={() => showBulkModal(false)}>
          Cancel
        </Button>
      </FlexContainer>
    </Dialog>
  );
}

BulkEditModal.propTypes = {
  showBulkModal: func.isRequired,
  ids: shape({}).isRequired,
};
