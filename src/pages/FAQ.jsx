import React from 'react';
import { shape } from 'prop-types';
import styled from 'styled-components';

import Dialog from '../components/Dialog';
import Title from '../styles/Title';

const FancyTitle = styled(Title)`
  font-family: lobster;
  text-transform: none;
  letter-spacing: 1px;
  font-size: 50px;
  margin-top: 1em;
  margin-bottom: 0.5em;
`;

const Signature = styled.span`
  font-family: lobster;
`;

const StyledTitle = styled(Title)`
  margin-bottom: 0;
`;

export default function FAQ({ history }) {
  return (
    <Dialog onClose={() => history.push('/')} type="copy">
      {/* eslint-disable react/jsx-one-expression-per-line */}
      <FancyTitle center>Carpe Dalan</FancyTitle>
      <p>
        Welcome to our family! <em>What is this website?</em>
      </p>
      <p>
        Before Vega was born, Leif and I had some tough talks about her and our
        future privacy. Faced with several online options, we decided to curate
        a private photo collection that we had complete control over instead of
        broadcasting our family across email and social media to reach our
        people. This website represents our humble attempt to preserve our
        family&#39;s privacy while still sharing our special moments with people
        we love and trust.
      </p>
      <p>We hope you enjoy this content as much we as we enjoy creating it!</p>
      <p style={{ whiteSpace: 'pre-line', textAlign: 'right' }}>
        {`XOXO - 
`}
        <Signature>The Dalans</Signature>
      </p>
      <StyledTitle as="h3" size="small">
        Downloading
      </StyledTitle>
      <p>
        You are welcome to download images for personal use, however we ask that
        you refrain from posting anything on social media and use discretion
        when sharing by email/ text/ IM.
      </p>
      <StyledTitle as="h3" size="small">
        Printing
      </StyledTitle>
      <p>
        Clicking the download button on an image will save a full resolution
        copy of that image to your device. If you want to print physical copies
        of images, we highly recommend using{' '}
        <a href="https://www.mpix.com/products/prints">MPIX</a>.
        <p>
          This service is popular with professional photographers for everything
          from school portraits to wedding photography. In our experience, print
          services with quick turnarounds such as Walgreens, Costco and
          Shutterfly produce significantly lower quality images regardless of
          the resolution of the digital file.
        </p>
      </p>
      <StyledTitle as="h3" size="small">
        Sharing
      </StyledTitle>
      <p>
        The best way to share images by email/ text/ IM is by sharing the link.
        This simplifies things for you, introduces the viewer to our website,
        and allows us to maintain control over who is accessing our content.
        Please know that shared links will prompt the viewer to enter or request
        a password to view the content.
      </p>
      <StyledTitle as="h3" size="small">
        Need Help?
      </StyledTitle>
      <p>
        Have a question about the website or how to navigate it?{' '}
        <a href="mailto:leifdalan@gmail.com">Just email us.</a>
      </p>
    </Dialog>
  );
}

FAQ.propTypes = {
  history: shape({}).isRequired,
};
