import { createGlobalStyle } from 'styled-components';

export const MAIN = 'main';
export const TEXT = 'text';
export const SIDEBAR_COLOR = 'sidebarColor';
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

  body, html, #root {
    background: ${getThemeValue(MAIN)}; 
    color: ${getThemeValue(TEXT)};
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }
  #root {
    margin-top: 0;
  }  
`;

const dark = {
  [MAIN]: 'black',
  [TEXT]: 'white',
  [SIDEBAR_COLOR]: 'rgba(0, 255, 231, 0.8)',
};

const lite = {
  [MAIN]: 'white',
  [TEXT]: 'black',
  [SIDEBAR_COLOR]: 'rgba(0, 255, 231, 0.8)',
};

export const themes = {
  dark,
  lite,
};
