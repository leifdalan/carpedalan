import React from 'react';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import { Link } from 'react-router-dom';
import { CellMeasurer } from 'react-virtualized';
import styled from 'styled-components';
import isNumber from 'lodash/isNumber';

import Dropdown from '../fields/Dropdown';
import InputField from '../fields/InputField';
import Field from '../form/Field';
import { API_IMAGES_PATH, SIZE_MAP } from '../../shared/constants';
import Submit from '../form/Submit';
import { BRAND_COLOR, getThemeValue, TITLE_FONT } from '../styles';
import Button from '../styles/Button';
import Flex from '../styles/FlexContainer';

import Picture from './Picture';

const Download = styled.a`
  color: ${getThemeValue(BRAND_COLOR)};
  font-family: ${getThemeValue(TITLE_FONT)};
  text-transform: uppercase;
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
      },
    },
  } = props;

  const { width, height } = SIZE_MAP[size];
  let ratio = height
    ? height / width
    : posts[index].imageHeight / posts[index].imageWidth;

  if (Number(posts[index].orientation) === 6) ratio = 1 / ratio;

  const src = `${API_IMAGES_PATH}/${width}${height ? `-${height}` : ''}/${
    posts[index].key.split('/')[1]
  }.webp`;

  const showEditButton =
    isAdmin && (isEditing === index || !isNumber(isEditing));

  return posts[index] ? (
    <CellMeasurer
      key={posts[index].id}
      cache={cache}
      parent={parent}
      index={index}
    >
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
              <Download>
                {format(fromUnixTime(posts[index].timestamp), 'MMM d YYYY', {
                  awareOfUnicodeTokens: true,
                })}
              </Download>
              {/* <Download>Download</Download> */}
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
  ) : null;
};

export default RenderRow;
