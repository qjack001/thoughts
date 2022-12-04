# A design pattern for Markdown components

Markdown is great and I never want to write long form text[^1] in any other way. It's perfect
for formatting text quickly, but it has its limitations: its syntax is fairly limited and doesn't
allow for much customization. What if I want to add a new type of element? Or control how images
are formatted?

[^1]: Like what you're reading now, for example.

The Astro-preferred solution is [MDX](https://docs.astro.build/en/guides/markdown-content/).
MDX lets you use custom components in your markdown, which is, admittedly, really powerful.
Unfortunately it just kind of sucks. Your documents become a weird mix of markdown and HTML-like
custom components, and it requires a lot of boilerplate to set up. You have to import every
component and assign them to the markdown component you want them to override every time!
In every single file!

So instead of that I'm using [Remark](https://github.com/remarkjs/remark) to extend the markdown
processing directly. Fair warning, the results are a bit hacky, but the writing experience after
the fact is far more elegant.


## How Remark plugins work

Remark plugins (in Astro at least) are functions that return functions. The function they return
takes an abstract syntax tree representing the document and (optionally) an object representing the
file — which includes its metadata and frontmatter and stuff. Both of these parameters are
_mutable_; you make updates by directly editing the objects.

For simple edits (like [yesterday's plugin](./what-astro-gets-wrong#dont-use-frontmatter) to set
the layout and title) this all works fine. For more complex components, you'll need to start
writing "html"-type nodes with the code written in Javascript strings. Gross.


## Making the most of a bad situation

Because this is an Astro project, my first thought was to somehow use Astro components.
I'll tell you upfront: this just doesn't work. There's no way to import an Astro component
into a regular Javascript file, no way to export a Javascript function out of an Astro
component, and I'm doubtful I would be able to render the component even if I could import it.

At the end of the day, html-in-javascript strings seems to be the best way about it. I'm
curious to see if I could write the html in JSX, but have yet to figure out how to compile
the file into standard javascript before importing it into the Astro config.[^2]

[^2]: Let me know if you know how to do this.

Ok, so here's how you make the best of what we've got.

#### Keep things close together

These are components, so they go in the components folder. Their markdown-specific, so
they go in a "markdown" folder inside of that one. Finally, each component gets _its_ own
folder. This keeps all of its files close together (the best we can do for now).

#### 1 file for 1 plugin

These html strings can get hairy quick. No need to over-complicate things. Each plugin
should have a file all to itself. I'm naming the file "index.mjs" so I can import it by
the folder name.

#### Use an Astro component for client-side code

One of the reasons I enjoy Astro so much is because it is just so easy to write client-side
code. Script tags are passed over as just that. No need to import a whole runtime, or worry
about rehydration. Anything that needs to run client-side (like scripts or styles) is put in
the markdown component's folder in an Astro component named "client-side.astro". I then add
all of these to the post-layout (and any other layout that uses markdown).


## An example component

I'm going to add a feature that gives each heading a button that copies the link to that
heading. If I was successful in doing this, you should see it in action on the heading above.

To start, in the index file we export a function that visits every heading and adds an
html-node child containing the markup for the button:

```
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
```

The `copyLinkToHeading` function works by adding the heading elements id to the current url,
then copies the entire address to the user's clipboard:

```
window.location.replace(`#${this.parentNode.id}`)
navigator.clipboard.writeText(window.location.href)
```

The styling needed for the new button goes in the client-side file, giving the button an icon and
hover state. I hide the button unless the heading is hovered as well. A no-script tag hides the
buttons if the user does not have Javascript turned on. You can find all the code for today's
feature [on Github](https://github.com/qjack001/thoughts/commit/8db8571f61da7ea874e727e53e874e6f300e34e1).