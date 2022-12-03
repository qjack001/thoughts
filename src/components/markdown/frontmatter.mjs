/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { visit } from 'unist-util-visit'

export function frontmatter() {
	return function (tree, file) {

		file.data.astro.frontmatter.layout = '../components/post-layout.astro'

		visit(tree, 'heading', heading => {
			if (heading.depth == 1) {
				// get text node child of heading
				// (note: will break if there's another node within the heading)
				file.data.astro.frontmatter.title = heading.children[0].value
				return
			}
		})
	}
}