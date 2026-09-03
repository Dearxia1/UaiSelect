const ACCENT_VAR = '--uaiselect-accent';
const ACCENT_FG_VAR = '--uaiselect-accent-fg';
const BG_VAR = '--uaiselect-bg';

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return null;
  const r = parseInt(match[1], 16) / 255;
  const g = parseInt(match[2], 16) / 255;
  const b = parseInt(match[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
    case g: h = (b - r) / d + 2; break;
    default: h = (r - g) / d + 4; break;
  }
  return { h: h * 60, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  const sN = clamp(s, 0, 100) / 100;
  const lN = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const hh = ((h % 360) + 360) % 360 / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let [r, g, b] = [0, 0, 0];
  if (hh < 1) [r, g, b] = [c, x, 0];
  else if (hh < 2) [r, g, b] = [x, c, 0];
  else if (hh < 3) [r, g, b] = [0, c, x];
  else if (hh < 4) [r, g, b] = [0, x, c];
  else if (hh < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = lN - c / 2;
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getContrastColor(hex: string): '#000000' | '#ffffff' {
  const hsl = hexToHsl(hex);
  if (!hsl) return '#000000';
  const { h, s, l } = hsl;
  const rgb = hslToHex(h, s, l);
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(rgb)!;
  const [r, g, b] = [match[1], match[2], match[3]].map((c) => parseInt(c, 16) / 255);
  const [lr, lg, lb] = [r, g, b].map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const luminance = 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Applies the user's chosen accent color as a CSS custom property on the
 * document root, so every accent-tinted control (buttons, active toggles,
 * logo) picks it up without re-rendering. A contrasting foreground color
 * is derived automatically for legible text/icons on top of it.
 */
export function applyAccentTheme(color?: string): void {
  const accent = color || '#ffffff';
  document.documentElement.style.setProperty(ACCENT_VAR, accent);
  document.documentElement.style.setProperty(ACCENT_FG_VAR, getContrastColor(accent));
}

/**
 * Derives a full contrast-aware palette (elevated surfaces, borders and a
 * text scale) from a single background color and applies it as CSS custom
 * properties on the document root. Direction (lighten vs. darken) and text
 * polarity automatically flip based on the background's own lightness, so
 * a dark navy and a pale pink both produce a legible, cohesive panel
 * instead of a fixed set of hardcoded grays.
 */
export function applyBackgroundTheme(color?: string): void {
  const bg = color || '#000000';
  document.documentElement.style.setProperty(BG_VAR, bg);

  const hsl = hexToHsl(bg) || { h: 0, s: 0, l: 0 };
  const { h, l } = hsl;
  const s = hsl.s;
  const isDark = l < 50;
  const dir = isDark ? 1 : -1;
  const surfaceSat = Math.min(s, 22);
  const borderSat = Math.min(s, 18);
  const textSat = Math.min(s, 10);

  const surface = (delta: number) => hslToHex(h, surfaceSat, clamp(l + dir * delta, 0, 100));
  const border = (delta: number) => hslToHex(h, borderSat, clamp(l + dir * delta, 0, 100));
  const text = (deltaFromExtreme: number) => {
    const target = isDark
      ? clamp(96 - deltaFromExtreme, 15, 98)
      : clamp(4 + deltaFromExtreme, 2, 90);
    return hslToHex(h, textSat, target);
  };

  const tokens: Record<string, string> = {
    '--uaiselect-surface-1': surface(5),
    '--uaiselect-surface-2': surface(12),
    '--uaiselect-surface-3': surface(20),
    '--uaiselect-border-1': border(9),
    '--uaiselect-border-2': border(15),
    '--uaiselect-border-3': border(24),
    '--uaiselect-text-1': text(0),
    '--uaiselect-text-2': text(6),
    '--uaiselect-text-3': text(14),
    '--uaiselect-text-4': text(30),
    '--uaiselect-text-5': text(48),
    '--uaiselect-text-6': text(60),
    '--uaiselect-text-7': text(68),
  };

  for (const [key, value] of Object.entries(tokens)) {
    document.documentElement.style.setProperty(key, value);
  }
}
