# What Astro gets wrong (and how to fix it)

Having build dozens of Astro sites over the past couple years, I've become quite a bit
opinionated in how it should be done. The framework itself has changed tremendously over
that time, and some of it not for the better. [_Today's Feature_](./digital-advent.md)
is going to be "filling out" the rest of this site — and in doing so, try to recapture
the simplicity that made me love Astro in the first place.


## Don't use layouts

I'm a bit of a sidebar minimalist[^1]. If the file isn't something I'm ever going to need to
edit I hide it[^2]. If I don't _need_ it, I delete it. So why clutter up the sidebar with another
whole folder?

It was a rhetorical question because the answer is there is none. The Astro convention of
creating a special "layouts" folder is pointless because they're no different from any
other components. In fact, I find it quite helpful to think about them this way; less to
have to remember. I also think that if you have more than three layouts you're probably
doing something wrong. Components are intrinsically composable (whereas layouts are not),
and any opportunity you have to refactor a layout into multiple components you should take it.

I like to start off with a "Base" component. One that will wrap every page of the site. I
like to include the `<html>` tags (even though Astro will do it for you if you don't)
because it lets you set the language attribute of the page. This component should also set
all the `<head>` data and include global styles (like fonts, colors, etc).

Then I usually add a "Post-Layout" component, if it's a markdown-based site. This component
is where all the formatting of the markdown can go, without cluttering up the site-wide layout.
It also lets you modify the posts without modifying non-post pages (like the homepage). By
wrapping the post-layout in the base-layout, we also save ourselves from copy-pasting all that
initial setup.

But again, these aren't _"layouts"_, they're layout components.


## Don't use frontmatter

Astro is all-in on markdown frontmatter. And I can't stand it. It all just gets copied
over anyway — I only have the one post-layout, remember? And why am I writing the title
twice? It's right there in the markdown! Worst of all, it shows up as a weird table on
Github.

Instead, I like to keep my markdown files clean and frontmetter-free. To achieve this,
I've made a simple [markdown plugin](https://docs.astro.build/en/guides/markdown-content/#markdown-plugins)
that adds this frontmatter to the page before it gets rendered out.

```
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
```

Set the layout to "post-layout", and set the title to the first h1 heading of the file. In
this case I'm being extra lazy and not even bothering to make sure there aren't any more
nodes within the heading (like emphasized or strong text).


## Don't do any of that weird image importing stuff

Vite is nice but there's no need for all that. Put it in the public folder. The web isn't
that complicated.

---

This post also took me about an hour to write. I'm also going to add a simple homepage
to list all the posts, but I don't have anything to really say about it. Here's
[all the changes in today's commit](https://github.com/qjack001/thoughts/commit/9e35ecd44e05410b2bbace6e4368848ab1f38bac).


[^1]: The entirety of my VS Code sidebar, as I write this: ![A screenshot of the file tree in my IDE's sidebar. There are only 5 files visible: two config files, two markdown files, and an image.](/thoughts/images/sidebar-screenshot.png)
[^2]: See [yesterday's post](./digital-advent#hiding-all-those-annoying-files) for how to do that.