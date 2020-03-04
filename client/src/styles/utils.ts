import { format, fromUnixTime } from 'date-fns';
import { createGlobalStyle } from 'styled-components';

// and extend them!

interface StyledProp {
  [index: string]: string;
}

export const formatDate = (timestamp: number): string =>
  format(fromUnixTime(timestamp), 'MMM d yyyy');

export const MAIN = 'main';
export const TEXT = 'text';
export const SIDEBAR_COLOR = 'sidebarColor';
export const BRAND_COLOR = 'brandColor';
export const SECONDARY_COLOR = 'secondaryColor';
export const BODY_FONT = 'bodyFont';
export const TITLE_FONT = 'titleFont';
export const DANGER_COLOR = 'dangerColor';
export const NEUTRAL_COLOR = 'neutralColor';
export const cdn = process.env.ASSET_CDN_DOMAIN;

export interface DefaultTheme {
  /**
   *
   * Main color.
   * @type {string}
   * @memberof DefaultTheme
   */
  [MAIN]: string;
  [TEXT]: string;
  [SIDEBAR_COLOR]: string;
  [BRAND_COLOR]: string;
  [SECONDARY_COLOR]: string;
  [BODY_FONT]: string;
  [TITLE_FONT]: string;
  [DANGER_COLOR]: string;
  [NEUTRAL_COLOR]: string;
}

/**
 * Utility to be used in styled component interpolations to grab a specific
 * theme value
 * @example
 * ```
const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${getThemeValue('neutralColor')};
`;
```
 *
 * @export
 * @param {keyof DefaultTheme} value
 */
export function getThemeValue(value: keyof DefaultTheme) {
  return function({ theme }: { theme: DefaultTheme }): string {
    return theme[value];
  };
}

/**
 * Function to be used in styled-component interpolations. 
 * @example
 * ```
interface IStyled {
  width?: {
    something: number;
  };
}

const Styledz = styled.div<IStyled>`
  width: ${`${prop('width')}as`}px;
`;
```
 *
 * @export
 * @template T
 * @param {keyof T} value
 * @returns
 */
export function prop<T>(value: keyof T) {
  return function(props: T) {
    return props[value];
  };
}

export function propTrueFalse<T>(
  value: keyof T,
  truthy: string | number,
  falsey: string | number,
) {
  return function(props: T) {
    return props[value] ? truthy : falsey;
  };
}

export const GlobalStyleComponent = createGlobalStyle`
  
  @font-face {
    font-family: 'lobster';
    src: url('//${cdn}/lobster.woff2') format('woff2'),
         url('//${cdn}/lobster.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }

  
  @font-face {
    font-family: 'montserratregular';
    src: url('//${cdn}/montserrat-regular-webfont.woff2') format('woff2'),
         url('//${cdn}/montserrat-regular-webfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'SourceSans';
    src: url('//${cdn}/source-sans-variable.woff2') format('woff2-variations');
  }

  html {
  box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }

  body, html, #root {
    background: ${getThemeValue(MAIN)}; 
    color: ${getThemeValue(TEXT)};
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    font-family: ${getThemeValue(BODY_FONT)};
    font-variation-settings: 'wght' 387, 'wdth' 90;
  }

  #root {
    margin-top: 0;
  }  
  #modal {
    display: none;
  }

  body.show-modal {
    overflow: hidden;
  }

  .show-modal #modal {
    z-index: 1;
    height: 100%;
    width: 100%;
    display: block;
  }
`;

const dark = {
  [BODY_FONT]: `Arial, Helvetica, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
  [MAIN]: 'black',
  [TEXT]: 'white',
  [SIDEBAR_COLOR]: 'rgba(247, 205, 219, 0.8)',
  [BRAND_COLOR]: 'rgb(0, 72, 206)',
  [SECONDARY_COLOR]: '#ff8c0e',
  [TITLE_FONT]: 'montserratregular, Helvetica, sans-serif',
};

const lite = {
  [BODY_FONT]: `Arial, Helvetica, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
  [MAIN]: 'white',
  [TEXT]: '#443',
  [SIDEBAR_COLOR]: 'rgba(247, 205, 219, 0.8)',
  [BRAND_COLOR]: 'rgb(0, 72, 206)',
  [SECONDARY_COLOR]: '#ff8c0e',
  [DANGER_COLOR]: 'rgb(222, 50, 82)',
  [NEUTRAL_COLOR]: 'rgb(100, 100, 100)',
  [TITLE_FONT]: 'montserratregular, Helvetica, sans-serif',
};

export const themes = {
  dark,
  lite,
};
