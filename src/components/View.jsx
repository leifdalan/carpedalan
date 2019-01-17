import React, { useContext, useState } from 'react';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { Route } from 'react-router-dom';
import styled from 'styled-components';

import { User } from '..';

import isNumber from 'lodash/isNumber';

import { WRITE_USER } from '../../server/constants';
import Form from '../form/Form';
import { Posts } from '../providers/PostsProvider';
import Menu from '../styles/Menu';
import Title from '../styles/Title';
import log from '../utils/log';

import Gallery from './Gallery';
import GridView from './GridView';
import Feed from './Feed';

const SVG = styled.svg`
  margin: 2em auto;
  text {
    font-family: england;
  }
`;

export default function View({
  posts,
  cache,
  fetchData,
  meta,
  title,
  fancy,
  match,
}) {
  const { patchPost } = useContext(Posts);
  const { user } = useContext(User);
  const [isEditing, setEditing] = useState(null);
  const [isGridView, setGridView] = useState(false);

  const isAdmin = user === WRITE_USER;

  const handlePatchPost = id => async values => {
    await patchPost(id)(values);
    try {
      // const editing = isEditing;
      setEditing(null);
      cache.clearAll();
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
          tags: (posts[isEditing].tags || []).map(tag => ({
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
    <>
      <Wrap {...props}>
        {fancy ? (
          <SVG viewBox="0 0 88 20">
            <text x="2" y="17">
              {title}
            </text>
          </SVG>
        ) : (
          <Title center size="large">
            {title}
          </Title>
        )}
        <Menu
          size="small"
          side="right"
          onClick={() => setGridView(!isGridView)}
        >
          {isGridView ? 'List' : 'Grid'}
        </Menu>
        {isGridView ? (
          <GridView
            fetchData={fetchData}
            data={posts}
            meta={meta}
            type="main"
            match={match}
          />
        ) : (
          <Feed
            isEditing={isEditing}
            setEditing={setEditing}
            posts={posts}
            meta={meta}
            fetchData={fetchData}
            match={match}
          />
        )}
      </Wrap>
      <Route
        render={rrProps => (
          <Gallery {...rrProps} data={posts} onClose={() => {}} />
        )}
        path="*/gallery/:id"
      />
    </>
  );
}

View.defaultProps = {
  fancy: false,
};

View.propTypes = {
  posts: arrayOf(shape({})).isRequired,
  cache: shape({}).isRequired,
  match: shape({}).isRequired,
  meta: shape({
    count: number,
  }).isRequired,
  fetchData: func.isRequired,
  title: string.isRequired,
  fancy: bool,
};
