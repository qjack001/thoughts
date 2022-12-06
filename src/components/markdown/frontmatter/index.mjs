/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import Git from 'git-date-extractor'

export default function injectFrontmatter() {
	return async (tree, file) => {

		file.data.astro.frontmatter.layout = '../components/post-layout.astro'

		const filepath = file.history[0]
		const timestamps = await Git.getStamps({ files: filepath })
		const timestamp = timestamps[Object.keys(timestamps)[0]]
		
		console.log(timestamp.created)
		console.log(timestamp.created * 1000)
		file.data.astro.frontmatter.created = timestamp.created * 1000
		file.data.astro.frontmatter.lastUpdated = timestamp.modified * 1000

		visit(tree, 'heading', heading => {
			if (heading.depth == 1) {
				file.data.astro.frontmatter.title = toString(heading)
				return
			}
		})
	}
}
