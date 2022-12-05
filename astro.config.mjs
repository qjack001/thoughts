import { defineConfig } from 'astro/config'
import frontmatter from './src/components/markdown/frontmatter'
import linkToHeading from './src/components/markdown/link-to-heading-button'
import highlight from './src/components/markdown/highlight'

export default defineConfig({
	site: 'https://guinane.xyz',
	base: '/thoughts',
	markdown: {
		extendDefaultPlugins: true,
		remarkPlugins: [
			frontmatter,
			linkToHeading,
			highlight,
		],
	},
})
