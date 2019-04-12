import React, { useContext } from 'react';
import { any, func, shape } from 'prop-types';
import Select from 'react-select/lib/Creatable';
import styled from 'styled-components';
import { components } from 'react-select';

import { Tag } from '../providers/TagProvider';

const Wrapper = styled.div`
  margin: 1em 0;
`;

export default function Dropdown({ input: { onChange, value } = {}, ...etc }) {
  const { postNewTag, creatingTag, tags } = useContext(Tag);
  const handleCreate = async thing => {
    const response = await postNewTag(thing);
    onChange([...value, { label: thing, value: response.id }]);
  };
  return (
    <Wrapper data-test={etc['data-test']}>
      <Select
        onCreateOption={handleCreate}
        onChange={onChange}
        value={value}
        options={tags.map(tag => ({
          value: tag.id,
          label: tag.name,
        }))}
        components={{
          Option: props => (
            // eslint-disable-next-line
            <div data-test={props.data.label}>
              <components.Option {...props} />
            </div>
          ),
        }}
        isLoading={creatingTag}
        {...etc}
      />
    </Wrapper>
  );
}

Dropdown.propTypes = {
  input: shape({
    onChange: func.isRequired,
    value: any,
  }).isRequired,
};
