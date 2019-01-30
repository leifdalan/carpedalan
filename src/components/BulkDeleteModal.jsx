import React, { useContext } from 'react';
import { func, shape } from 'prop-types';

import { Posts } from '../providers/PostsProvider';
import Button from '../styles/Button';
import FlexContainer from '../styles/FlexContainer';
import Title from '../styles/Title';

import Dialog from './Dialog';

export default function BulkEditModal({ ids, showBulkModal }) {
  const { bulkDelete } = useContext(Posts);
  const idArray = Object.keys(ids).reduce(
    (acc, id) => [...acc, ...(id ? [ids[id]] : [])],
    [],
  );

  const handleSubmit = async () => {
    await bulkDelete({
      ids: idArray,
    });
    showBulkModal(false);
  };
  return (
    <Dialog type="wide">
      <Title style={{ textAlign: 'center' }}>Are you sure? </Title>
      <FlexContainer justifyContent="space-between">
        <Button type="danger" onClick={handleSubmit}>
          {`Delete (${idArray.length})`}
        </Button>
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
