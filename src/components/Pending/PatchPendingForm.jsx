import React, { useContext, useEffect, useState } from 'react';
import getUnixTime from 'date-fns/getUnixTime';
import { shape, string } from 'prop-types';
import styled from 'styled-components';
import DayPicker from 'react-day-picker';

import { cdn } from '../../config';
import { Posts } from '../../providers/PostsProvider';
import { prop } from '../../styles';
import Button from '../../styles/Button';
import { Image } from '../../utils/globals';
import { ACTIVE } from '../../../shared/constants';

const Frame = styled.figure`
  width: 50%;
  transform: rotate(${prop('transform')}deg);
  transform-origin: 50% 50%;
  img {
    width: 100%;
    height: 100%;
  }
`;

export default function PatchPendingForm({ record }) {
  const [image, setImage] = useState(null);
  const [imageSizes, setImageSizes] = useState({ height: 0, width: 0 });
  const [transform, settransform] = useState(0);
  const [day, setDay] = useState(Date.now());

  const { patchPost } = useContext(Posts);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      if (!image) setImage(img);
    };
    img.src = `https://${cdn}/${record.key}`;
    return () => {};
  }, []);

  useEffect(() => {
    if (image) setImageSizes({ height: image.height, width: image.width });
  }, [image]);

  function rotate() {
    settransform(transform + 90);
  }

  async function submit() {
    const timestamp = getUnixTime(day);
    await patchPost(record.id)({
      rotate: transform,
      timestamp,
      isPending: false,
      status: ACTIVE,
      [transform % 180 ? 'imageHeight' : 'imageWidth']: imageSizes.height,
      [transform % 180 ? 'imageWidth' : 'imageHeight']: imageSizes.width,
      orientation: null,
      key: record.key,
    });
  }

  return (
    <>
      <Frame transform={transform}>
        {image ? <img alt="pending" src={image.src} /> : null}
      </Frame>

      <DayPicker onDayClick={setDay} />
      <Button onClick={rotate}>Rotate</Button>
      <Button type="submit" onClick={submit}>
        Submit
      </Button>
    </>
  );
}

PatchPendingForm.propTypes = {
  record: shape({ id: string }).isRequired,
};
