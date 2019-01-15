import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CellMeasurer } from 'react-virtualized';
import styled from 'styled-components';
import isNumber from 'lodash/isNumber';

import Dropdown from '../fields/Dropdown';
import InputField from '../fields/InputField';
import Field from '../form/Field';
import { SIZE_MAP } from '../../shared/constants';
import Submit from '../form/Submit';
import { BRAND_COLOR, getThemeValue, TITLE_FONT } from '../styles';
import Button from '../styles/Button';
import Flex from '../styles/FlexContainer';
import { formatDate, getImagePath, getImageRatio } from '../utils';

import Modal from './Modal';
import Picture from './Picture';

const Download = styled.a`
  color: ${getThemeValue(BRAND_COLOR)};
  font-family: ${getThemeValue(TITLE_FONT)};
  text-transform: uppercase;
  text-decoration: none;
`;

const Description = styled.div`
  padding: 1em;
  li {
    list-style: none;
    padding: 0;
    display: inline-block;
    margin-right: 0.25em;
  }
  ul {
    margin: 0;
    padding: 0;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${getThemeValue(BRAND_COLOR)};
`;

const StyledFlex = styled(Flex)`
  margin-bottom: 0.5em;
`;

const EditButton = styled(Button)`
  position: absolute;
  right: 1em;
  top: 1em;
  z-index: 1;
  opacity: 0.6;
`;

const RenderRow = props => {
  /* eslint-disable react/prop-types,no-nested-ternary */
  const {
    index,
    style,
    parent,
    parent: {
      props: {
        posts,
        cache,
        shouldShowImages,
        showDescription,
        size,
        isEditing,
        delPost,
        setEditing,
        isAdmin,
        tags,
        onDelete,
      },
    },
  } = props;
  const post = posts[index];

  if (!post) return null;

  const ratio = getImageRatio(post);

  const src = getImagePath({ post, size: SIZE_MAP[size] });

  const showEditButton =
    isAdmin && (isEditing === index || !isNumber(isEditing));

  return (
    <CellMeasurer key={index} cache={cache} parent={parent} index={index}>
      <div style={style}>
        {showEditButton ? (
          <EditButton
            onClick={() => setEditing(isNumber(isEditing) ? null : index)}
          >
            {isEditing === index ? 'Close' : 'Edit'}
          </EditButton>
        ) : null}

        <Picture
          width="100%"
          ratio={ratio}
          src={src}
          shouldShowImage={shouldShowImages}
          placeholderColor={posts[index].placeholderColor}
          alt={posts[index].description}
        />
        {isEditing === index ? (
          <Description>
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
            <Flex justifyContent="space-between">
              <Submit />
              <Button type="danger" onClick={delPost(posts[index].id)}>
                Delete
              </Button>
            </Flex>
          </Description>
        ) : showDescription ? (
          <Description>
            <StyledFlex justifyContent="space-between">
              <Download as="div">{formatDate(posts[index].timestamp)}</Download>
              <Download href={`/api/images/${posts[index].key}`}>
                Download
              </Download>
            </StyledFlex>
            {posts[index].description ? (
              <figcaption>{posts[index].description}</figcaption>
            ) : null}
            <ul>
              {posts[index].tags.map(({ name, id }) => (
                <li key={id}>
                  <StyledLink to={`/tag/${name}`}>{`#${name}`}</StyledLink>
                </li>
              ))}
            </ul>
          </Description>
        ) : null}
      </div>
    </CellMeasurer>
  );
};

export default RenderRow;
