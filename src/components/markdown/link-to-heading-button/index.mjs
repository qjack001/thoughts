/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { visit } from 'unist-util-visit'

export default function addButtonToHeadings() {

	const headingLevels = [ 2, 3, 4 ] // only apply to these heading levels
	const copyButton = `<button title="copy link to heading" onclick="${stringifyFunction(copyLinkToHeading)}"/>`

	return (tree) => {
		visit(tree, 'heading', node => {
			if (headingLevels.includes(node.depth)) {
				node.children.push({
					type: 'html',
					value: copyButton,
				})
			}
		})
	}
}

/**
 * This is the code that copies the link to the heading. It is converted to a string
 * and run client-side (see the onclick attribute above). The "//" are used to parse
 * out the inner code of the function.
 * 
 * The function first sets the window location to the linked-heading, then copies
 * the current address to the clipboard. This ensures the full address is correct.
 */
function copyLinkToHeading() {
	//
	window.location.replace(`#${this.parentNode.id}`)
	void navigator.clipboard.writeText(window.location.href)
	//
}

/**
 * Converts the given function into a string. Uses "//" to delineate the inner code
 * of the function.
 */
function stringifyFunction(func) {
	return func.toString().split('//')[1].trim().replace('\n', ';')
}