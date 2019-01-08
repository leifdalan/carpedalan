import React, { useContext } from 'react';
import { any, func, shape } from 'prop-types';
import Select from 'react-select/lib/Creatable';

import { Tag } from '../providers/TagProvider';

export default function Dropdown({ input: { onChange, value }, ...etc }) {
  const { postNewTag, creatingTag } = useContext(Tag);
  const handleCreate = async thing => {
    const response = await postNewTag(thing);

    onChange([...value, { label: thing, value: response.id }]);
  };
  return (
    <Select
      onCreateOption={handleCreate}
      onChange={onChange}
      value={value}
      isLoading={creatingTag}
      {...etc}
    />
  );
}

Dropdown.propTypes = {
  input: shape({
    onChange: func.isRequired,
    value: any,
  }).isRequired,
};
