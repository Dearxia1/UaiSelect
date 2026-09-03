const ACCENT_VAR = '--uaiselect-accent';
const ACCENT_FG_VAR = '--uaiselect-accent-fg';

function getContrastColor(hex: string): '#000000' | '#ffffff' {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return '#000000';
  const [r, g, b] = [match[1], match[2], match[3]].map((c) => parseInt(c, 16) / 255);
  const [lr, lg, lb] = [r, g, b].map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const luminance = 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Applies the user's chosen accent color as CSS custom properties on the
 * document root, so every accent-tinted control (buttons, active toggles,
 * logo) picks it up without re-rendering.
 */
export function applyAccentTheme(color?: string): void {
  const accent = color || '#ffffff';
  document.documentElement.style.setProperty(ACCENT_VAR, accent);
  document.documentElement.style.setProperty(ACCENT_FG_VAR, getContrastColor(accent));
}
