import React from 'react';
import { CellMeasurer } from 'react-virtualized';

import { API_IMAGES_PATH, SIZE_MAP } from '../../shared/constants';

import Picture from './Picture';

const RenderRow = props => {
  /* eslint-disable react/prop-types */
  const {
    index,
    key,
    style,
    parent,
    parent: {
      props: { posts, cache, shouldShowImages, showDescription, size },
    },
  } = props;
  const { width, height } = SIZE_MAP[size];
  const ratio = height
    ? height / width
    : posts[index].imageHeight / posts[index].imageWidth;

  const src = `${API_IMAGES_PATH}/${width}${height ? `-${height}` : ''}/${
    posts[index].key.split('/')[1]
  }.webp`;
  return posts[index] ? (
    <CellMeasurer key={key} cache={cache} parent={parent} index={index}>
      <div style={style}>
        <Picture
          width="100%"
          ratio={ratio}
          src={src}
          shouldShowImage={shouldShowImages}
          placeholderColor={posts[index].placeholderColor}
        />
        {posts[index].tags.map(({ name }) => name)}
        {showDescription ? posts[index].description : null}
      </div>
    </CellMeasurer>
  ) : null;
};

export default RenderRow;

/* <div onClick={() => setQuery({ order: 'asc' })}>sort wootdesc</div>
{posts.map(({ id, description, key, tags, width }) =>
  key ? (
    <Wrapper key={id} {...getProps(description, id)}>
      {width}
      <img
        alt={description}
        width="100%"
        data-test={key.split('/')[1]}
        src={`${API_IMAGES_PATH}/${SIZE_MAP[MEDIUM].width}/${
          key.split('/')[1]
        }.webp`}
      />
      {isEditing ? (
        <Field name={DESCRIPTION} component={InputField} />
      ) : (
        <div>{description || null}</div>
      )}

      {tags.map(({ name, id: tagId }) => (
        <Link key={tagId} to={`/tag/${name}`}>{`#${name}`}</Link>
      ))}
      {isAdmin(user) && !isEditing ? (
        <div onClick={() => setEditing(true)}>edit</div>
      ) : null}
      {isAdmin(user) && isEditing ? <Submit /> : null}
      {isAdmin(user) && isEditing ? (
        <div onClick={() => setEditing(false)}>unedit</div>
      ) : null}
      {isAdmin(user) && isEditing ? (
        <button type="button" onClick={del(id)}>
          del
        </button>
      ) : null}
    </Wrapper>
  ) : null,
)} */
