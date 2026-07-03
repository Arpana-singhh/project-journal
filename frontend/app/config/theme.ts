import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
    token: {
        colorPrimary: '#1f6f5c',
        colorPrimaryHover: '#175a4a',
        colorPrimaryActive: '#175a4a',
        colorError: '#b42318',
        colorText: '#1a1a1a',
        colorTextSecondary: '#6b7280',
        colorBorder: '#d9dee3',
        colorBgContainer: '#ffffff',
        borderRadius: 8,
        fontFamily: 'var(--font-poppins), Arial, Helvetica, sans-serif',
    },
    components: {
        Pagination: {
            colorPrimary: '#1f6f5c',
            colorPrimaryHover: '#175a4a',
            borderRadius: 8,
        },
        Input: {
            colorPrimary: '#1f6f5c',
            colorPrimaryHover: '#175a4a',
            borderRadius: 8,
        },
        Select: {
            colorPrimary: '#1f6f5c',
            colorPrimaryHover: '#175a4a',
            optionSelectedBg: '#e6f2ef',
            borderRadius: 8,
        },
        Collapse: {
            colorPrimary: '#1f6f5c',
            borderRadius: 8,
            contentBg: '#fbfbfb',
        },
        Modal: {
            colorPrimary: '#1f6f5c',
            borderRadius: 8,
        },
        Button: {
            colorPrimary: '#1f6f5c',
            colorPrimaryHover: '#175a4a',
            borderRadius: 8,
        },
        Badge: {
            colorPrimary: '#1f6f5c',
        },
        Table: {
            borderColor: '#d9dee3',
        },
    },
};

export default theme;
