/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'

export default function injectFrontmatter() {
	return function (tree, file) {

		file.data.astro.frontmatter.layout = '../components/post-layout.astro'

		visit(tree, 'heading', heading => {
			if (heading.depth == 1) {
				file.data.astro.frontmatter.title = toString(heading)
				return
			}
		})
	}
}