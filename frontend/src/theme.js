export const TOKENS = {
    colors: {
        primary: 'var(--ui-text-primary)',
        accent: 'var(--ui-accent)',
        accentSecondary: 'var(--ui-accent-secondary)',
        bg: 'var(--ui-bg)',
        cardBg: 'var(--ui-card-bg)',
        textPrimary: 'var(--ui-text-primary)',
        textSecondary: 'var(--ui-text-secondary)',
        textTertiary: 'var(--ui-text-tertiary)',
        border: 'var(--ui-border)',
        success: 'var(--ui-success)',
        warning: 'var(--ui-warning)',
        danger: 'var(--ui-danger)',
    },
    shadows: {
        card: 'var(--ui-shadow-card)',
        cardHover: 'var(--ui-shadow-card-hover)',
        floating: 'var(--ui-shadow-floating)',
    },
    chartPalette: [
        '#6366F1',
        '#3B82F6',
        '#0EA5E9',
        '#94A3B8',
        '#CBD5E1'
    ],
    fonts: {
        ui: 'var(--ui-font-body)',
        mono: 'var(--ui-font-mono)',
        display: 'var(--ui-font-display)'
    }
};

export const resolveCssValue = (value) => {
    if (typeof value !== 'string') return value;
    const match = value.match(/^var\((--[^)]+)\)/);
    if (!match) return value;
    if (typeof window === 'undefined') return value;
    const resolved = window.getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim();
    return resolved || value;
};

export const getResolvedTokens = () => ({
    colors: Object.fromEntries(
        Object.entries(TOKENS.colors).map(([key, val]) => [key, resolveCssValue(val)])
    ),
    chartPalette: [...TOKENS.chartPalette],
});
