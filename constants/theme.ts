/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

import { Palette } from './design';

const tintColorLight = Palette.primary;
const tintColorDark = Palette.primary;

export const Colors = {
  light: {
    text: Palette.ink,
    background: Palette.backgroundLight,
    surface: '#ffffff',
    muted: Palette.muted,
    border: Palette.softBorder,
    primary: Palette.primary,
    tint: tintColorLight,
    icon: Palette.muted,
    tabIconDefault: Palette.muted,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ecf0f2',
    background: Palette.backgroundDark,
    surface: '#2b3338',
    muted: '#9fb2bd',
    border: '#3b464d',
    primary: Palette.primary,
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
    display: 'PlayfairDisplay_600SemiBold',
    body: 'Manrope_400Regular',
    bodySemiBold: 'Manrope_600SemiBold',
    bodyBold: 'Manrope_700Bold',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
    display: 'PlayfairDisplay_600SemiBold',
    body: 'Manrope_400Regular',
    bodySemiBold: 'Manrope_600SemiBold',
    bodyBold: 'Manrope_700Bold',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    display: "'Playfair Display', Georgia, 'Times New Roman', serif",
    body: "'Manrope', 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    bodySemiBold: "'Manrope', 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    bodyBold: "'Manrope', 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  },
});
