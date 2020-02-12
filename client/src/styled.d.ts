import 'styled-components';
import {
  MAIN,
  TEXT,
  SIDEBAR_COLOR,
  BRAND_COLOR,
  SECONDARY_COLOR,
  BODY_FONT,
  TITLE_FONT,
  DANGER_COLOR,
  NEUTRAL_COLOR,
} from 'styles/utils';

// and extend them!
declare module 'styled-components' {
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
}
