import process from 'process';

export const IS_TEST_MODE = Boolean(process.env.TEST_MODE || false);
