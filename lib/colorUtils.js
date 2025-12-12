import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import a11yPlugin from 'colord/plugins/a11y';
import namesPlugin from 'colord/plugins/names';

extend([mixPlugin, a11yPlugin, namesPlugin]);

// --- Color Generators ---

export const generateAlternatives = (baseColor) => {
  const base = colord(baseColor);
  const hsl = base.toHsl();
  const colors = [];
  
  for (let i = 0; i < 10; i++) {
    const hueShift = (i - 4.5) * 10;
    const newHue = (hsl.h + hueShift + 360) % 360;
    colors.push(colord({ h: newHue, s: hsl.s, l: hsl.l }).toHex());
  }
  return colors;
};

export const generateShades = (baseColor) => {
  const base = colord(baseColor);
  const colors = [];
  for (let i = 0; i < 10; i++) {
    const ratio = (i + 1) * 0.1;
    colors.push(base.mix('#000000', ratio).toHex());
  }
  return colors;
};

export const generateTints = (baseColor) => {
  const base = colord(baseColor);
  const colors = [];
  for (let i = 0; i < 10; i++) {
    const ratio = (i + 1) * 0.1;
    colors.push(base.mix('#ffffff', ratio).toHex());
  }
  return colors;
};

export const generateTones = (baseColor) => {
  const base = colord(baseColor);
  const hsl = base.toHsl();
  const colors = [];
  for (let i = 0; i < 10; i++) {
    const saturation = hsl.s * (1 - (i + 1) * 0.1);
    colors.push(colord({ h: hsl.h, s: saturation, l: hsl.l }).toHex());
  }
  return colors;
};

export const generateHues = (baseColor) => {
  const base = colord(baseColor);
  const hsl = base.toHsl();
  const colors = [];
  for (let i = 0; i < 10; i++) {
    const hue = (hsl.h + (i * 36)) % 360;
    colors.push(colord({ h: hue, s: hsl.s, l: hsl.l }).toHex());
  }
  return colors;
};

export const getColors = (baseColor, tab) => {
  switch (tab) {
    case 'alternatives': return generateAlternatives(baseColor);
    case 'shades': return generateShades(baseColor);
    case 'tints': return generateTints(baseColor);
    case 'tones': return generateTones(baseColor);
    case 'hues': return generateHues(baseColor);
    default: return generateAlternatives(baseColor);
  }
};

// --- Utilities ---

export const getRandomColor = () => {
  return colord({
    h: Math.random() * 360,
    s: 70 + Math.random() * 30,
    l: 50 + Math.random() * 20
  }).toHex();
};

export const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);

export const adjustHue = (baseColor, amount) => {
  const base = colord(baseColor);
  const hsl = base.toHsl();
  const newHue = (hsl.h + amount + 360) % 360;
  return colord({ h: newHue, s: hsl.s, l: hsl.l }).toHex();
};


// --- Color Blindness Simulation Algorithm (LMS Daltonization) ---

const blinder = (R, G, B, type) => {
  // Linearize RGB
  let r = (R <= 0.04045) ? R / 12.92 : Math.pow((R + 0.055) / 1.055, 2.4);
  let g = (G <= 0.04045) ? G / 12.92 : Math.pow((G + 0.055) / 1.055, 2.4);
  let b = (B <= 0.04045) ? B / 12.92 : Math.pow((B + 0.055) / 1.055, 2.4);

  // Convert to LMS
  /* 
    Pake matriks simulasi sederhana yang approximate agar responsif.
    Ini adalah pendekatan matriks dari Color Blindness Simulation (Viénot, Brettel and Mollon 1999)
  */
  
  let finalR = r, finalG = g, finalB = b;

  if (type === 'protanopia') {
     // Red Blind
     finalR = 0.56667 * r + 0.43333 * g + 0.00000 * b;
     finalG = 0.55833 * r + 0.44167 * g + 0.00000 * b;
     finalB = 0.00000 * r + 0.24167 * g + 0.75833 * b;
  } 
  else if (type === 'deuteranopia') {
     // Green Blind
     finalR = 0.62500 * r + 0.37500 * g + 0.00000 * b;
     finalG = 0.70000 * r + 0.30000 * g + 0.00000 * b;
     finalB = 0.00000 * r + 0.30000 * g + 0.70000 * b;
  }
  else if (type === 'tritanopia') {
     // Blue Blind
     finalR = 0.95000 * r + 0.05000 * g + 0.00000 * b;
     finalG = 0.00000 * r + 0.43333 * g + 0.56667 * b;
     finalB = 0.00000 * r + 0.47500 * g + 0.52500 * b;
  }
  else if (type === 'achromatopsia') {
     // Monochromacy
     const gray = 0.299*r + 0.587*g + 0.114*b;
     finalR = gray;
     finalG = gray;
     finalB = gray;
  }

  // Gamma Correction
  const gamma = (val) => (val <= 0.0031308) ? 12.92 * val : 1.055 * Math.pow(val, 1/2.4) - 0.055;
  
  return colord({
     r: Math.min(255, Math.max(0, Math.round(gamma(finalR) * 255))),
     g: Math.min(255, Math.max(0, Math.round(gamma(finalG) * 255))),
     b: Math.min(255, Math.max(0, Math.round(gamma(finalB) * 255)))
  }).toHex();
}


export const simulateColorBlindness = (color, type) => {
  if (!type || type === 'none') return color;
  
  const rgb = colord(color).toRgb();
  // Normalize RGB to 0-1
  return blinder(rgb.r/255, rgb.g/255, rgb.b/255, type);
};
