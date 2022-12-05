/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { visit } from 'unist-util-visit'

export default function highlight() {
	return (tree) => {
		visit(tree, 'text', node => {
			if (node.value.includes('==')) {
				node.type = 'html'
				node.value = node.value.replace(/^==|\s==/g, ' <span class="highlight">')
				node.value = node.value.replace(/==$|==\s/g, '</span> ')
			}
		})
	}
}