# Programming with A.I. assistance: a ChatGPT review

Yesterday, while building a Remark plugin to add links to headings,[^1] I asked OpenAI's
new A.I chatbot — [ChatGPT](https://openai.com/blog/chatgpt/) — if there were any errors
in my code. Somewhat surprisingly, it reported back to me that it did not have enough context
to know, and then described some very possible issues it could have given some assumptions.

[^1]: See: _[A design pattern for Markdown components](./markdown-components)_.

I gave it the frontmatter plugin I'd previously written and it correctly noticed that
the title would be wrong if it contained child nodes (like `<em>` and `<strong>`). It
suggested that I instead use the `hast-util-to-string` package to parse the string...
which I have now done.


## ChatGPT vs Github Copilot

So far, I have enjoyed using ChatGPT to generate summaries of an author's work, create
and play new tabletop roleplaying games, and provide suggested movies I may enjoy based on
my past likes. The killer feature, however, has been its ability to answer questions
conversationally that would be too vague to type into Google (but are perhaps too embarrassing
or niche to ask a friend).

The format of a chatbot means the A.I. only responds to prompts, as opposed to Copilot's
desire to finish your sentences for you. While Copilot felt aggressive, ChatGPT feels
relaxing to use. ChatGPT also has a tendency to comment its code extensively and write
follow-up explanations of how it works. I suspect this is because it is trained on tech
blogs. The results are much easier to work with (whereas the unexplained code spit out
by Copilot could feel like a chore to have to carefully read over). When I want to drill
down into something, I can ask. If the response misses an edge case, I can ask it to
rewrite the function to account for that. If the code is too hard to read, I can ask it
to write it to be more readable.


## Using ChatGPT to write a feature for my website

I first asked ChatGPT to write another Remark plugin to convert text wrapped in `==`
to ==highlighted text== using span elements. That was the prompt. The answer was a fully
functioning plugin that did exactly that... except it treated the highlight syntax like
a block element.

Fair enough. I didn't really specify that it should work inline. I asked it again, this
time accounting for that use case in particular:

> **Jack:** write a Remark plugin that processes text wrapped in `==` and converts it
> to highlighted text using spans. Make sure it can capture text that occurs in the middle
> of the paragraph or sentence.

> **ChatGPT:**
> ```
> import Remark from "remark";
> 
> // Create a new Remark plugin
> const highlightPlugin = (node: Remark.Node) => {
>     if (node.type == "text") {
>         // Find any instances of text wrapped in "=="
>         const matches = node.value.match(/==(.+?)==/g);
>         if (matches) {
>             // Replace each instance with a span containing the highlighted text
>             node.value = node.value.replace(/==(.+?)==/g, "<span class='highlight'>$1</span>");
>         }
>     }
> };
> ```

Now this one is formatted a little differently than how Astro wants it, but I like its
use of regex here. Unfortunately, this wouldn't work if there were nodes within the
highlighted section (like: `this ==text is *highlighted* and italicized==`).

I knew how I wanted the plugin to work now, so instead of asking it to try again, I
just drilled into each step I needed for the process:

> **Jack:** write a regex expression that targets `==` only when it is at the start of
> the string, or comes after whitespace

> **ChatGPT:**
> ```
> /1==|\s==/g
> ```
> This regex expression uses the `^` character to match `==` at the start of the string,
> and the `\s` character to match a whitespace character before `==`. The `|` character is
> used to separate the two alternatives, and the `g` flag is used to search for multiple
> matches within the string.
>
> Here are some examples of how this regex expression would match in different strings:
> - `==this is highlighted==` -> matches `==` at the start of the string
> - `this is ==highlighted==` -> matches `==` after a whitespace character
> - `this is not highlighted` -> no match
>
> Note that this regex expression does not match `==` that occurs in the middle of a word,
> as it only matches `==` after a whitespace character. To match `==` in the middle of a
> word, the regex expression would need to be modified to include the `\w` character to
> match an word character before `==`.

Neat. The regex works perfectly and the explanation is helpful. I then asked for the
opposite (`==` only at the end of the string or directly followed by whitespace) and
got the answer for that: `/==$|==\s/g`.

Piecing these together, I wrote the following plugin:

```
visit(tree, 'text', node => {
	if (node.value.includes('==')) {
		node.type = 'html'
		node.value = node.value.replace(/^==|\s==/g, ' <span class="highlight">')
		node.value = node.value.replace(/==$|==\s/g, '</span> ')
	}
})
```

By simply setting the node type to html, we can inject markup anywhere into the text and
have it render. Any "opening" tokens (`==` at start or after whitespace) are replaced
with opening span tags, and closing tokens are replaced with closing span tags. This _does_
allow imbalanced tags if only one token is present — but so does html! It also fixes
any issue of markup being written inside of the highlighted text. ==See? It is _just fine_
with italicized text.==

I did try asking it for the corresponding CSS — which was fine; yellow, as you'd expect
— but it wasn't very inspired, so I ended up writing it out myself. I knew exactly what
I wanted in this case.


## Conclusion

ChatGPT didn't write the feature in its entirety. It didn't handle every case and it needed
my prompting and guidance to get there. But this is exactly why it was a great experience
to use: it was a collaborative effort. I used it as a tool to do things I didn't know how
to do, but was able to incorporate it with the parts I _did_ know how to do with ease.
Unlike previous coding A.I. that try to solve the whole problem for you.

I would not be surprised if my job involved A.I. assistance in the near future. In fact,
I'd be shocked if it doesn't. ChatGPT feels like a product that I could use nearly as
indispensible as Google.

To become a tool that I could use at work a few things would need to happen. First,
the model would need to be able to run locally. I'm not sure if that is a reasonable
request,[^2] but it would either need to become possible or the rules around sending
company property over the wire would need to change. Also, there will need to be a way
to train the model on new data — much like DreamBooth is doing with Stable Diffusion
right now. With this, code bases and documentation could be read to give the chatbot
an understanding of the context it is working in.

[^2]: ChatGPT tells me it takes _"approximately 1 petaflop of computational power to run [GPT-3]"_.