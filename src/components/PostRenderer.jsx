import React from 'react';
import { CellMeasurer } from 'react-virtualized';

import Dropdown from '../fields/Dropdown';
import InputField from '../fields/InputField';
import Field from '../form/Field';
import Form from '../form/Form';
import { API_IMAGES_PATH, SIZE_MAP } from '../../shared/constants';
import Submit from '../form/Submit';
import Button from '../styles/Button';

import Picture from './Picture';

const RenderRow = props => {
  /* eslint-disable react/prop-types */
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
        patchPost,
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

  return posts[index] ? (
    <CellMeasurer
      key={posts[index].id}
      cache={cache}
      parent={parent}
      index={index}
    >
      <div style={style}>
        <Picture
          width="100%"
          ratio={ratio}
          src={src}
          shouldShowImage={shouldShowImages}
          placeholderColor={posts[index].placeholderColor}
        />
        {isAdmin ? (
          <Button onClick={() => setEditing(true)}>Edit</Button>
        ) : null}
        {isEditing ? (
          <>
            <Form
              onSubmit={patchPost(posts[index].id)}
              initial={{
                description: posts[index].description,
                tags: posts[index].tags.map(tag => ({
                  value: tag.id,
                  label: tag.name,
                })),
              }}
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
            </Form>
            <Button onClick={delPost(posts[index].id)}>Deklete</Button>
          </>
        ) : (
          <>
            {posts[index].tags.map(({ name }) => name)}
            {showDescription ? posts[index].description : null}
          </>
        )}
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
