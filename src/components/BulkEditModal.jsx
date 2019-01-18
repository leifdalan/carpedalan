import React, { useContext } from 'react';
import { func, shape } from 'prop-types';

import Dropdown from '../fields/Dropdown';
import InputField from '../fields/InputField';
import Field from '../form/Field';
import Form from '../form/Form';
import Submit from '../form/Submit';
import { Tag } from '../providers/TagProvider';
import { Posts } from '../providers/PostsProvider';
import Button from '../styles/Button';

import Dialog from './Dialog';

export default function BulkEditModal({ ids, showBulkModal }) {
  const { tags } = useContext(Tag);
  const { bulkEdit } = useContext(Posts);
  const handleSubmit = async values => {
    const idArray = Object.keys(ids).reduce(
      (acc, id) => [...acc, ...(id ? [ids[id]] : [])],
      [],
    );
    await bulkEdit({ ids: idArray, ...values });
    showBulkModal(false);
  };
  return (
    <Dialog>
      <Form
        onSubmit={handleSubmit}
        initial={{ tags: [] }}
        normalize={values => ({
          ...values,
          tags: values.tags.map(({ value }) => value),
        })}
      >
        <Field name="description" component={InputField} />
        <Field
          name="tags"
          component={Dropdown}
          options={tags.map(tag => ({
            value: tag.id,
            label: tag.name,
          }))}
          isMulti
        />
        <Submit />
        <Button onClick={() => showBulkModal(false)}>Cancel</Button>
      </Form>
    </Dialog>
  );
}

BulkEditModal.propTypes = {
  showBulkModal: func.isRequired,
  ids: shape({}).isRequired,
};
