# Scrollimate!

Finally, the first version of scrollimate after years of having only indivdual components available!

Scrollimate focuses on features and functions related to scrolling, animations (hence the name), but includes also other functionalities.


## Usage & Setup: 

This is a *jQuery Plugin*, so you'll need jQuery. 
Include jQuery. Include scrollimate.js.

    <script src="path/to/your/scripts/jquery-2.1.4.min.js"></script>
    <script src="path/to/your/scripts/scrollimate.js"></script>

Each of the functionalities are implemented as methods of the scrollimate object. That means you just need to call the method you want, or you can use the handy init function and just need one call for them all!


### INIT FUNCTION

(Parallax is called via the init method)

The init function takes a single argument, an array of the methods you want to use, for example:

    scrollimata.init(['saScroll', 'parallax'])

will initiate the Smooth Anchor Sroll and Parallax functions


### CALLING METHODS MANUALLY

While you can call (almost) every method via *init*, you can also call the methods each manually, such as:

    scrollimate.saTabs();

which will initiate the saTabs Function


## The Methods

What does Scrollimate Entail? Let's take a look:

---
---

# SA Parallax
![SA PARALLAX SAMPLE](http://files.moritzzimmer.com/saparallax.gif)

The original scrollimate function. You **_have to_** call SA Parallax with the **init** function.

#### BSAIC SETUP:

1. Follow the Instructions for Scrollimate Installation
2. add the following data-attribute to the element you wish to parallax scroll: `data-sabglayer`
3. Call the init Function with:
  `<script> scrollimate.init(['saParallax']); </script>`

#### ADVANCED SETUP:
![SA PARALLAX SAMPLE](http://files.moritzzimmer.com/saparallax3.gif)

See how in this example, the top hero-image parallaxes right away, but each following elements (images) only when it comes into view, and consistently for each element? SA Parallax can do that!

*You can tell the `data-sabglayer` attribute how your parallax animation should behave.
By Default, it will simply start at the top and will scroll at half the speed that the page once you start scrolling.
The `data-sabglayer` will take two arguments:*

- Supply a single number like so: `data-sabglayer="0.5"`

If you supply it a single number, this is the speed at which you want the element to scroll relative to the page speed. To create several layers of parallax, or simply to more fine-tune the effect, you can se the `data-sabglayer` attribute to any floating point value between 0 (which will cause the element to scroll normally) and 2 (which will cause the element to appear static on the page). You can also use any number larger than 2, which will cause the element to scroll in the opposite direction of the scroll! And yes, you can also use negative numbers and make the element scroll faster than the page!
  
- Supply two argments seperated by comma like so: `data-sabglayer="-0.5, 0.36"`

With this, you can define the position of parallaxing element. This is useful if you want the element to be positioned “perfectly” when it is scrolled in the center of the page, for example. `0,5` is usually a good start, buy you may need to play around with the number.

*More importantly*, giving this attribute is useful if the element you wish to parallax is not at the top. The element will only _start_ parallaxing _once in view_, and will be offset by the number specified. (If the second argument is not given, the element will start parallaxing from the very moment the page scrolls).


#### Mobile Control ####

By default, parallax will not be enabled on screen sizes smaller than 768px. (Sidenote: This applies to initial screen-size: Whatever your page loaded with, determined whether or not parallax is enabled. This is by design so that check is not performed over and over).

*You can re-enable* mobile parallax by calling the `enableMobile` before the saParallax method like so: 
    `<script> scrollimate.init(['enableMobile', 'saParallax']); </script>`
(If you are running the init function with other methods the order doens't matter, as long as saParallax gets called last).

---

# SA (Smooth Anchor) Scroll
![SMOOTH ANCHOR SCROLL SAMPLE](http://files.moritzzimmer.com/smoothanchorscroll.gif)

Smoothly scrolls to elements on websites that contain anchor scrolls. Instead of jumping to a point in the page, website scrolls smoothly (and at a consistent speed) to each anchor.

#### BSAIC SETUP:

1. Follow the Instructions for Scrollimate Installation
2. Call the Method once on the page: `<script> scrollimate.saScroll; </script>` (You may also use the init function by supplying 'saScroll' as an additional argument)

---
---

# SA Tabs 
![TABSCROLL SAMPLE](http://files.moritzzimmer.com/tabscroll.gif)

Create simple, bookmarable, browser-history-respecting tab content on any website. No cluttered Markup: You just need to add **_one_** custom data-attribute.


### MARKUP:
You need to have two things: 

#### 1.) A Navigation of links, with each link wrapped in a parent.

In the collection of links, link the links via #s to the sections. 
For example, you may have two divs, one has the id of `id="one"`, the other `id="two"`
Your links should link to `href="#one"` and `href="#two"`.

Wrap each link in a parent. (This is important for styling, or if you are using a list)

Wrap each parent to a link in another parent, and give it the following attribute
`"data-tabscrollnavcontainer"`.

#### It should look something like this:

    <ul data-tabscrollnavcontainer>
        <li>
            <a href="#one">One</a>
        </li>
        <li>
            <a href="#two">Two</a>
        </li>
    </ul>

##### ---- or something like ----

    <div data-tabscrollnavcontainer>
        <div>
            <div>   
                <a href="#one">One</a>
            </div>
            <div>   
                <a href="#two">Two</a>
            </div>
        </div>
    </div>


#### 2.) A collection of "tabs", the content you want to display as tabs.
I recommend it to look something like this:

    <div>
        <div id="one">
            ...
        </div>
        <div id="tow">
            ...
        </div>
    </div>

##### ---- or something like ----

    <article>
        <section id="one">
            ...
        </section>
        <section id="two">
            ...
        </section>
    </article>

Note: (The class for the active tab on the navigation is `.tabscroll_activeNavi`)

### SETUP:

1. Follow the Instructions for Scrollimate Installation
2. Call the Method once on the page:
  `<script> scrollimate.saTabs; </script>` (You may also use the init function by supplying 'saScroll' as an additional argument)

#### EXCLUSION

You want to have a link within your navigation that does something else. An external link, a popup link, etc. This is possible by simply adding the `data-saexclude` attribute to the anchor element.

---
---

# SA Scroll Class

Will add a specifiable class to any element when a target element is scrolled, and remove it when it stops scrolling.  

_as of right now, this method_  **_cannot_** **_be_** **_called_** **_with_** **_the_** **_init_** **_method_** :( 

#### BASIC SETUP:

- Follow the Instructions for Installation 
- Call the Method once on the page: `<script> scrollimate.scrollClass( $(window), $('.topnav'), 'scrolling' ); </script>` 


SA Scroll Class takes three arguments:

1. *complete jQuery Selector* of the element you want to scroll (in the above example it would be the entire window, but it can be an overflow-ed div, or really anything )
2. *complete jQuery selector* of the element that you want to add the class to (in the above example we are adding a class to the element with the `.topnav` class)
3. The name of the class you want to add

In the above example, the `.topnav` Element will get the `scrolling` class when the `window` is scrolled. 

---
---

# SA Accordion
(examples: https://codepen.io/justMoritz/pen/vJVZVd)

A simple _horizontal_ accordion for an infinite number of elements.

_as of right now, this method_  **_cannot_** **_be_** **_called_** **_with_** **_the_** **_init_** **_method_** :( 

#### BSAIC SETUP:

1. You will need any number elements with the same selector, for example 5 divs with the class of `element`. _please float these elements left, inline or inline-block the, so they will be next to each other_ . Clearing the float etc. will be up to you.
2. Follow the Instructions for Scrollimate Installation
3. Call the Method once on the page with _two arguments_ like so: `<script> saAccordion('.element', '66.66'); </script>` 

SA Accordion takes **at** **least** **one**, but can take four arguments:

1. The target elements selector (in the above example every element with the `.element` class)
2. (optional) The width (in percent) of the exanded element. If none is provided, the default width is 50%.
3. (optional) The type of event that raises the change over the element selected in argument 1. Can be click, mouseover, mouseout, etc. If left blank, defaults to CLICK
4. (optional) You can determin the height of the element, in pixels, or in percent of the width of the individual element. (This is done via padding-bottom)



