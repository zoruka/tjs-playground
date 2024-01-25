import { FleekConfig } from '@fleekxyz/cli';

export default {
	sites: [
		{
			slug: 'tjs-playground',
			distDir: 'dist',
			buildCommand: 'yarn build',
		},
	],
} satisfies FleekConfig;
