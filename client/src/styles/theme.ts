interface StyledProp {
  [index: string]: string;
}

export const MAIN = 'main';
export const TEXT = 'text';
export const SIDEBAR_COLOR = 'sidebarColor';
export const BRAND_COLOR = 'brandColor';
export const SECONDARY_COLOR = 'secondaryColor';
export const BODY_FONT = 'bodyFont';
export const TITLE_FONT = 'titleFont';
export const DANGER_COLOR = 'dangerColor';
export const NEUTRAL_COLOR = 'neutralColor';
export const getThemeValue = (value: string) => ({
  theme,
}: {
  theme: StyledProp;
}) => theme[value];
