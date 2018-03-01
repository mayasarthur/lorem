
# :space_invader: Lorem Ipsum is Simply Dummy Text (or, Pain Itself) :space_invader:

> Reading for format involves the delamination of media composites. (Tenen, *Plaintext*, 115)

[![lorem oopsum](http://78.media.tumblr.com/58f5ca5c8bef8afe618fede563e18a5e/tumblr_nxlxsg1Kwp1r2ylxvo1_500.jpg)](http://loremoopsum.tumblr.com/)

In this exercise we will (attempt to) use freely available tools (web browser, text editor, GitHub) to dissect and "delaminate" text on the web. Starting with an excavation of form, format and protocols, hopefully we can begin to get at some of the other technical and social layers that comprise digital text and its reproduction. The goal is to deform and bewilder what we might be tempted to think of as innocuous, passive, ubiquitous (no but seriously, where is there *not* digital text?).

Basically, 1) we are going to appropriate the design and content of a familiar website, 2) examine its insides, 3) maximize what tenen calls "format" through decontextualization and deformation, and 4) finally republish it.

## Ingredients

- Browser (Chrome, Firefox)
- Text Editor (any will do though I recommend [atom.io](https://atom.io/))
- [GitHub Account](https://github.com/)
- You might want to take a peek at some [HTML/CSS basics](https://d157rqmxrxj6ey.cloudfront.net/chadsansing/19784/) to get familiar with the rough idea of how webpages are structured

## Part 1: Prep

1) Pair up
2) Choose a text-centric website that is iconic in some way.
    - "authoritative" (New York Times, government sites, Penn domains)
    - incendiary (Fox News, Breitbart)
    - almost invisible or appliance-like (CNN, Twitter, Facebook, Reddit, Wikipedia)
    - amateur or homespun ([Pine Point Revisited](http://pinepointrevisited.homestead.com/), [Motor City Music Archives](http://motorcitymusicarchives.com/), [Three Charlies](http://www.qsl.net/k7ccc/) ).
3) Create a new folder on your desktop
4) Save the site in your new folder
    - `File` > `Save Page As` 
    - Rename to `index.html`
    - Make sure `Webpage, Complete` is selected
5) Open the folder and take a look at what you've saved

## Part 2: Delamination

1) Open the file 'index.html' in your browser as well as in a text editor. If the code is too dense or long, you might want to "beautify" it using this [online tool](https://ctrlq.org/beautifier/)
2) Explore the file in the browser by right clicking on elements and selecting `Inspect` from the menu
3) What do you notice?
    - Where are there correspondences between the underlying code and the browser representation?
    - What doesn't correspond or doesn't make sense based on what you observe in either the code or the browser?
4) Try editing in some way in the text editor, either replacing text or replacing an image, and then refreshing the browser
5) :fire: Now to deform and decontextualize! :fire: Here are a few strategies:
    - Try to replace text with auto-generated text from one of the generators on [this list of generators](https://loremipsumgenerator.com/ultimate-list-of-lorem-ipsum-generators/)
    - Try distorting an image on the site using this [online glitch tool](https://snorpey.github.io/jpg-glitch) (remember that for the image to render, it has to maintain the same filename and filetype)
    - :underage: Try adding a [p5.js](https://p5js.org/) script [like this one](https://gist.github.com/bulbil/eb25df6cbcf856436b4946a5c0eb7f7c) to the bottom of the `index.html` file before the `</body>` tag :underage:
6) As you are editing, you'll want to save in the text editor, then refresh in your browser

## Part 3: Publication

1) Log into GitHub
2) `Fork` (i.e., copy) this repository to your own account
3) Select `index.html` then select edit (the pencil icon in the top right)
4) Copy-and-paste the contents of your `index.html` file, replace the contents of the existing file, and select the `commit` (i.e., save) button
5) Select `index_files` folder then drag the files from your `index_files` folder into this folder
    - **Note:** If you have many files, you'll want to transfer no more than thirty at a time, selecting `commit` after each group of files
6) Select `Settings` and scroll down to `GitHub Pages`, under the `Source` header choose `master branch`
7) A green box will appear with your new URL in it (this process takes some time) -- your delamination is live!

