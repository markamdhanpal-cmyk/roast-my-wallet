import { Platform } from 'react-native';

const fontFamily = Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto';

export const typography = {
    h1: {
        fontFamily,
        fontSize: 48,
        fontWeight: 'bold' as const,
    },
    h2: {
        fontFamily,
        fontSize: 32,
        fontWeight: 'bold' as const,
    },
    h3: {
        fontFamily,
        fontSize: 24,
        fontWeight: '600' as const,
    },
    body: {
        fontFamily,
        fontSize: 16,
        fontWeight: 'normal' as const,
    },
    caption: {
        fontFamily,
        fontSize: 14,
        fontWeight: 'normal' as const,
    },
};
