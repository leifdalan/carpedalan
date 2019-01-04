import { createGlobalStyle } from 'styled-components';

export const MAIN = 'main';
export const TEXT = 'text';
export const getThemeValue = value => ({ theme }) => theme[value];

export const GlobalStyleComponent = createGlobalStyle`
  
  @font-face {
    font-family: 'england';
    src: url('https://cdn.carpedalan.com/england-webfont.woff2') format('woff2'),
         url('https://cdn.carpedalan.com/england-webfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'montserratregular';
    src: url('https://cdn.carpedalan.com/montserrat-regular-webfont.woff2') format('woff2'),
         url('https://cdn.carpedalan.com/montserrat-regular-webfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

  body {
    background: ${getThemeValue(MAIN)}; 
    color: ${getThemeValue(TEXT)};
    width: 100%;
    padding: 0;
    margin: 0;
  }
  
  h1 {
    font-family: 'montserratregular';
  }
  
`;

const dark = {
  [MAIN]: 'black',
  [TEXT]: 'white',
};

const lite = {
  [MAIN]: 'white',
  [TEXT]: 'black',
};

export const themes = {
  dark,
  lite,
};
