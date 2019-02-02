import React, { useContext, useState } from 'react';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { Link, Route } from 'react-router-dom';
import styled from 'styled-components';

import { User } from '..';

import isNumber from 'lodash/isNumber';

import { WRITE_USER } from '../../server/constants';
import Form from '../form/Form';
import { Posts } from '../providers/PostsProvider';
import { getThemeValue, TEXT, prop } from '../styles';
import Menu from '../styles/Menu';
import Title from '../styles/Title';
import Wrapper from '../styles/Wrapper';
import log from '../utils/log';

import Gallery from './Gallery';
import GridView from './GridView';
import Feed from './Feed';

/* eslint-disable */
const StyledTitle = styled(Title)`
  font-family: lobster;
  font-size: ${prop('fontSize')};
  text-align: center;
  text-transform: lowercase;
  margin-top: 2em;
  letter-spacing: 2px;
`;
/* eslint-enable */
const SVG = styled.svg`
  margin: 2em auto;
  text {
    font-family: lobster;
    fill: #444;
  }
`;

const StyledMenu = styled(Menu)`
  a {
    color: ${getThemeValue(TEXT)};
    text-decoration: none;
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
  location,
  history,
}) {
  const { patchPost } = useContext(Posts);
  const { user } = useContext(User);
  const [isEditing, setEditing] = useState(null);

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

  const isGridView = location.hash === '#grid';

  let fontSize = '52px';
  if (title.length > 20) {
    fontSize = '36px';
  }
  if (title.length > 25) {
    fontSize = '24px';
  }

  return (
    <>
      <Wrap {...props}>
        <Wrapper>
          {fancy ? (
            <SVG viewBox="0 0 88 20">
              <text x="4" y="17">
                {title}
              </text>
            </SVG>
          ) : (
            <>
              <StyledTitle fontSize={fontSize}>{title}</StyledTitle>
            </>
          )}
        </Wrapper>
        <StyledMenu size="small" side="right">
          <Link
            replace
            to={{
              pathname: `${match.url}`,
              hash: isGridView ? '' : '#grid',
            }}
          >
            {isGridView ? 'List' : 'Grid'}
          </Link>
        </StyledMenu>
        {isGridView ? (
          <GridView
            fetchData={fetchData}
            data={posts}
            meta={meta}
            type="main"
            match={match}
            location={location}
            history={history}
          />
        ) : (
          <Feed
            isEditing={isEditing}
            setEditing={setEditing}
            posts={posts}
            meta={meta}
            fetchData={fetchData}
            match={match}
            location={location}
            history={history}
          />
        )}
      </Wrap>
      <Route
        render={rrProps => (
          <Gallery
            {...rrProps}
            data={posts}
            onClose={() =>
              history.push({
                pathname: match.url || '/',
                hash: location.hash,
              })
            }
          />
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
  history: shape({}).isRequired,
  location: shape({}).isRequired,
  meta: shape({
    count: number,
  }).isRequired,
  fetchData: func.isRequired,
  title: string.isRequired,
  fancy: bool,
};
