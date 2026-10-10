export const THEMES = [
  {
    id: 'dark',
    name: 'Dark Mode',
    badge: 'Obsidian Night',
    type: 'dark',
    description: 'High-contrast obsidian black with razor-sharp electric teal accents & cyber hairlines.',
    preview: {
      bg: '#090B0F',
      card: '#141922',
      border: '#253044',
      accent: '#14B8A6',
      text: '#F8FAFC',
      subtext: '#94A3B8'
    }
  },
  {
    id: 'light',
    name: 'Light Mode',
    badge: 'Crisp White',
    type: 'light',
    description: 'Pristine pure white canvas with clean slate typography and subtle hairlines.',
    preview: {
      bg: '#FFFFFF',
      card: '#FFFFFF',
      border: '#E2E8F0',
      accent: '#0D9488',
      text: '#0F172A',
      subtext: '#64748B'
    }
  }
];

export const ACCENTS = [
  { id: 'teal', name: 'Electric Teal', color: '#14B8A6' },
  { id: 'indigo', name: 'Cyber Indigo', color: '#6366F1' },
  { id: 'amber', name: 'Sunset Amber', color: '#F59E0B' },
  { id: 'emerald', name: 'Emerald Glass', color: '#10B981' },
  { id: 'rose', name: 'Editorial Rose', color: '#F43F5E' },
];

export const DENSITIES = [
  { id: 'comfortable', name: 'Comfortable', desc: 'Roomy spacing & relaxed human-friendly breathing room' },
  { id: 'compact', name: 'Power Compact', desc: 'High information density, condensed rows & quick triage' }
];

export const TYPOGRAPHIES = [
  { id: 'sans', name: 'Modern Sans', font: 'Plus Jakarta Sans / Inter', sample: 'Clean, structured SaaS' },
  { id: 'editorial', name: 'Editorial Humanist', font: 'Newsreader Serif + Sans', sample: 'Crafted typography with character' }
];

export const DEFAULT_DISPLAY_PREFERENCES = {
  theme: 'dark',
  accent: 'teal',
  density: 'comfortable',
  typography: 'sans'
};

export function getStoredPreferences() {
  try {
    const raw = localStorage.getItem('jobproof_display_preferences');
    let theme = 'dark';
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.theme === 'light' || parsed.theme === 'editorial') {
        theme = 'light';
      }
      return { ...DEFAULT_DISPLAY_PREFERENCES, ...parsed, theme };
    }
    // Backward compatibility with legacy jobproof_theme key
    const legacyTheme = localStorage.getItem('jobproof_theme');
    if (legacyTheme === 'light' || legacyTheme === 'editorial') {
      return { ...DEFAULT_DISPLAY_PREFERENCES, theme: 'light' };
    }
  } catch (e) {
    // ignore json parse error
  }
  return DEFAULT_DISPLAY_PREFERENCES;
}

export function applyDisplayPreferences(prefs) {
  try {
    const root = document.documentElement;
    const body = document.body;

    const isLight = prefs.theme === 'light' || prefs.theme === 'editorial';
    const activeTheme = isLight ? 'light' : 'dark';

    // Tailwind and classList switches
    if (isLight) {
      root.classList.remove('dark');
      root.classList.add('light');
      if (body) {
        body.classList.remove('dark');
        body.classList.add('light');
      }
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      if (body) {
        body.classList.remove('light');
        body.classList.add('dark');
      }
    }

    // Set standard data attributes
    root.setAttribute('data-theme', activeTheme);
    if (body) body.setAttribute('data-theme', activeTheme);

    root.setAttribute('data-accent', prefs.accent || 'teal');
    if (body) body.setAttribute('data-accent', prefs.accent || 'teal');

    root.setAttribute('data-density', prefs.density || 'comfortable');
    if (body) body.setAttribute('data-density', prefs.density || 'comfortable');

    root.setAttribute('data-typography', prefs.typography || 'sans');
    if (body) body.setAttribute('data-typography', prefs.typography || 'sans');

    // On-demand lazy load for editorial serif font only when user actively selects it
    if (prefs.typography === 'editorial' && typeof document !== 'undefined' && !document.getElementById('jobproof-editorial-font')) {
      const fontLink = document.createElement('link');
      fontLink.id = 'jobproof-editorial-font';
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400&display=swap';
      document.head.appendChild(fontLink);
    }

    // Save to localStorage synchronously
    localStorage.setItem('jobproof_display_preferences', JSON.stringify({ ...prefs, theme: activeTheme }));
    localStorage.setItem('jobproof_theme', activeTheme);
  } catch (e) {
    console.warn('Failed to apply display preferences', e);
  }
}
