import React, { useContext, useEffect, useState } from 'react';
import getUnixTime from 'date-fns/getUnixTime';
import { shape, string } from 'prop-types';
import styled from 'styled-components';
import DayPicker from 'react-day-picker';

import { cdn } from '../../config';
import { Posts } from '../../providers/PostsProvider';
import { getThemeValue, prop, TEXT } from '../../styles';
import Button from '../../styles/Button';
import { Image } from '../../utils/globals';
import { ACTIVE } from '../../../shared/constants';

const Frame = styled.figure`
  margin: 0;
  width: 50%;
  transform: rotate(${prop('transform')}deg);
  transform-origin: 50% 50%;
  img {
    width: 100%;
    height: 100%;
  }
`;

const Wrapper = styled.div`
  padding-bottom: 2em;
  margin-bottom: 2em;
  border-bottom: 1px solid ${getThemeValue(TEXT)};
  .DayPicker-Month {
    margin: 1em 0;
  }
`;

export default function PatchPendingForm({ record }) {
  const [image, setImage] = useState(null);
  const [imageSizes, setImageSizes] = useState({ height: 0, width: 0 });
  const [transform, settransform] = useState(0);

  const [day, setDay] = useState(
    record.timestamp ? new Date(record.timestamp * 1000) : new Date(),
  );

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
    let dimensions = {};
    if (!record.imageHeight) {
      dimensions = {
        [transform % 180 ? 'imageHeight' : 'imageWidth']: `${
          imageSizes.height
        }`,
        [transform % 180 ? 'imageWidth' : 'imageHeight']: `${imageSizes.width}`,
      };
    }
    await patchPost(record.id)({
      rotate: transform,
      timestamp,
      isPending: false,
      status: ACTIVE,
      key: record.key,
      ...dimensions,
    });
  }

  return (
    <Wrapper>
      <div>
        <Frame data-test={record.key} transform={transform}>
          {image ? <img alt="pending" src={image.src} /> : null}
        </Frame>
        <Button type="neutral" onClick={rotate}>
          Rotate
        </Button>
      </div>

      {record.timestamp
        ? null
        : "This post doesn't have a valid date. Pick one!"}
      <DayPicker
        initialMonth={day}
        selectedDays={day}
        onDayClick={dayEvent => setDay(dayEvent)}
      />
      <div>
        <Button type="submit" onClick={submit}>
          Submit
        </Button>
      </div>
    </Wrapper>
  );
}

PatchPendingForm.propTypes = {
  record: shape({ id: string }).isRequired,
};
