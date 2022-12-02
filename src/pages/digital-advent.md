# Digital Advent Calender

![A text message that reads: "Digital advent calendra", and a reply: "what". A second reply an hour later: "Quinn what does it mean".](/thoughts/images/quinn-message.png)

I'm still not entirely sure what it means, but I'm rolling with it anyway. My plan is to:

1. Add a (small) new feature to my site each day.
2. Write a small thing about it.

The second one is mostly because as much as I want to add features to my website, I'd much rather
get better[^*] at writing. Sort of a two-birds-one-stone thing and it gives me something to write
about.

I'm guessing I will make it about a week before falling off, but in any event, this will provide
clear evidence as to exactly how long.

[^*]: By _"better"_ I mean _"faster"_, mostly.


## Today's feature

With a backlog of bugs to fix, features to add, and projects to finish, I thought the only
reasonable thing to do would be to open a new repo and start something new.

This site (the one you're currently reading) will provide me a place to put down loose thoughts
— and for the course of December, these posts. It should also give me lots of things to do,
so I have something to add each day.

I'm setting it up as an Astro project, because it really just needs to be a static Markdown
site and because I've made like 50 Astro sites by now so it shouldn't be much trouble.


## How to set up an Astro project in 2023

Ya, it's not 2023 yet I know, I know. But I think this is how I'm going to do it next year too.
I'll quickly run through the main parts of the setup, but if you want to see the actual files, they
can be browsed
[on Github](https://github.com/qjack001/thoughts/commit/78d65dea373a90008b35842c87a6007c9970831f).

### Package management

I've started using [Bun](https://bun.sh/) as a replacement for NPM. I find it's much faster and I
like typing "bun" in to the terminal. It uses the standard `package.json` file, so everything else
is pretty much the same (a nice side effect is that it can still be built with NPM because of that).

```
bun init
bun install astro -d
```

### Linting

I have a linting config set-up and published to NPM, so I always use that. An `.eslintrc` file
points to the package name and that's all the setup it needs. Oh I also add a `.vscode/settings.json`
file to configure auto-formatting on save (more on that later too):

```
{
	"editor.formatOnSave": false,
	"eslint.validate": ["javascript", "typescript"],
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": true,
	},
}
```

### PostCSS

The bare-minimum requirement when working with Astro is installing `autoprefixer` and adding it in a
PostCSS config. At some point in the future I may set up CSS nesting, because I kinda like that
one too — but that's another feature for another day.

### Deploying to Github Pages

Ok, jumping the gun here a bit given there isn't even a site to deploy yet, but I like to get all
my ducks in a row or whatever. I like deploying to Github Pages because my domain name is already
set up, so each repo becomes a sub-path of the site (this one will be `/thoughts`).

One thing to remember if you are deploying an Astro site on a sub-path like this, is you need to
configure Astro so that it knows where its own files are going to end up. This can be done by
adding a `base` property to the Astro config (in this case, set to: `'/thoughts'`).

I use a deploy script in the ".github" folder. I don't love that this is how you have to do it
because yaml is so unpleasant and there is no IDE completion/type checking to help configure
the deploy correctly. Also, now I have a stupid ".github" folder in my sidebar.

### Hiding all those annoying files

One easy way to get rid of that stupid ".github" folder is to add a stupid ".vscode" folder (if you
remember from the _Linting_ section, I've actually already done this). Adding a new `files.exclude`
property to the settings file allows me to hide any file from the sidebar. I use it to get rid of
all the files and folders I don't really interact with while working on the site:

```
{
	"files.exclude": {
		"**/.git": true,
		".gitignore": true,
		"**/.DS_Store": true,
		"node_modules": true,
		"dist": true,
		".vite": true,
		".output": true,
		"tsconfig.json": true,
		".eslintrc": true,
		".vscode": true,
		"bun.lockb": true,
		"postcss.config.cjs": true,
		".github": true,
	}
}
```


## Conclusion

Well, there you have it. Admittedly, almost none of that was setting up Astro. Sorry. I have a site
now though, and lots of things to add to it. All-in-all it took me about 1 hour: 10 minutes spent
setting all that up and 50 minutes writing this. 
