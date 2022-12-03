import { defineConfig } from 'astro/config'
import { frontmatter } from './src/components/markdown/frontmatter.mjs'

export default defineConfig({
	site: 'https://guinane.xyz',
	base: '/thoughts',
	markdown: {
		remarkPlugins: [ frontmatter ],
		extendDefaultPlugins: true,
	},
})
