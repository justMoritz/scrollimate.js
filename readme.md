# Scrollimate!

Scrollimate focuses on features and functions related to scrolling, animations (hence the name), but includes also other functionalities.

## Table of Contents

- [Setup and Usage](#setup)
     - [Init Method](#init)
     - [Calling Methods Manually](#manually)
- [The Methods](#methods)
     - [SA Parallax](#saParallax)
         - [Basic Setup](#saParallaxBasic)
         - [Advnaced Setup](#saParallaxAdvanced)
         - [Mobile Control](#saParallaxAdvanced)
     - [SA (Smooth Anchor) Scroll](#saScroll)
         - [Basic Setup](#saScrollBasic)
     - [SA Tabs](#saTabs)
         - [Markup](#saTabsMarkup)
         - [Setup](#saTabsSetup)
         - [Advanced Setup](#saTabsAdvSetup)
         - [Exclude Links](#saTabsExclusion)
         - [Non-indexed Version](#saTabsNonindexed)
     - [SA Scroll Class](#saScrollclass)
         - [Baisc Setup](#saScrollclassBasic)
     - [SA Accordion](#saAccordion)
         - [Basic Setup](#saAccordionBasic)
         - [Advanced](#saAccordionAdvanced)
     - [SA Underline](#saUnderline)
         - [Basic Setup](#saUnderlineBasic)
         - [Advanced](#saUnderlineAdvanced)
     - [SA Ripple](#saRipple)
         - [Basic Setup](#saRippleBasic)
         - [Advanced](#saUnderlineRipple)

## <a name="setup"></a>Setup and Usage: 

This is a *jQuery Plugin*, so you'll need jQuery. 
Include jQuery. Include scrollimate.js.

    <script src="path/to/your/scripts/jquery-2.1.4.min.js"></script>
    <script src="path/to/your/scripts/scrollimate.js"></script>

Each of the functionalities are implemented as methods of the scrollimate object. That means you just need to call the method you want, or you can use the handy init function and just need one call for them all!


### <a name="init"></a>1.) INIT METHOD

(Parallax is called via the init method)

The init function takes a single argument, an array of the methods you want to use, for example:

    scrollimate.init(['saScroll', 'parallax'])

will initiate the Smooth Anchor Sroll and Parallax functions


### <a name="manually"></a>2.) CALLING METHODS MANUALLY

While you can call (almost) every method via *init*, you can also call the methods each manually, such as:

    scrollimate.saTabs();

which will initiate the saTabs Function


## <a name="methods"></a>The Methods

What does Scrollimate Entail? Let's take a look:

---
---

# <a name="saParallax"></a>SA Parallax
![SA PARALLAX SAMPLE](http://files.moritzzimmer.com/saparallax.gif)

The original scrollimate function. You **_have to_** call SA Parallax with the **init** function.

#### <a name="saParallaxBasic"></a>BASIC SETUP:

1. Follow the Instructions for Scrollimate Installation
2. add the following data-attribute to the element you wish to parallax scroll: `data-sabglayer`
3. Call the init Function with:
  `<script> scrollimate.init(['saParallax']); </script>`

#### <a name="saParallaxAdvnaced"></a>ADVANCED SETUP:
*You can tell the `data-sabglayer` attribute how your parallax animation should behave.
By Default, it will simply start at the top and will scroll at half the speed that the page once you start scrolling.
The `data-sabglayer` will take two arguments:*

#### Adjust scroll speed

- Supply a single number like so: `data-sabglayer="0.5"`

Supply it a single number, this is the speed at which you want the element to scroll relative to the page speed. To create several layers of parallax, or simply to more fine-tune the effect, you can se the `data-sabglayer` attribute to any floating point value between 0 (which will cause the element to scroll normally) and 2 (which will cause the element to appear static on the page). 

You can also use any number larger than 2, which will cause the element to scroll in the opposite direction of the scroll. And yes, you can also use negative numbers and make the element scroll faster than the page!

#### Centering / Offset Control 

![SA PARALLAX SAMPLE](http://files.moritzzimmer.com/saparallax3.gif)

*See how in this example, the top hero-image parallaxes right away, but each following elements (images) only when it comes into view, and consistently for each element? SA Parallax can do that!*


You can supply more than one argument to SA Parallax. This is useful if the element you wish to parallax is not at the top. Supplying two elements will cause the eement to only _start_ parallaxing _once in view_. 

**NEW in 1.3:**

#### Keep Elements Centered

 - Supply two arguments (separated by comma), with the second argument set to *center* like so: `data-sabglayer="-0.5, center"`

This will calculate the parallax so that the element will be in it's “ideal” position when centered vertically on the screen. Plus, (ideally) you would never see it parallax out of view in either direction. (Mileage may vary...)

#### Custom Offset Elements
  
- Supply a second argument separated by comma like so: `data-sabglayer="-0.5, 0.25"`

With this, you can define the position of parallaxing element. This is useful if you want the fine-control the element’s be position. This number is the fraction it is offset by it’s own hight. For example, `0.5` on a 500px tall element will cause it to be offset by 250px, `1` by 500px, etc.

If you don't want the element to be offset, but not start parallaxing until in view, simply set the second number to 0, like so:  `data-sabglayer="1.5, 0"`


#### <a name="saParallaxMobile"></a>MOBILE CONTROL ####

By default, parallax will not be enabled on screen sizes smaller than 768px. (Sidenote: This applies to initial screen-size: Whatever your page loaded with, determined whether or not parallax is enabled. This is by design so that check is not performed over and over).

*You can re-enable* mobile parallax by calling the `enableMobile` before the saParallax method like so: 
    `<script> scrollimate.init(['enableMobile', 'saParallax']); </script>`
(If you are running the init function with other methods the order doens't matter, as long as saParallax gets called last).

---
---

# <a name="saScroll"></a>SA (Smooth Anchor) Scroll
![SMOOTH ANCHOR SCROLL SAMPLE](http://files.moritzzimmer.com/smoothanchorscroll.gif)

Smoothly scrolls to elements on websites that contain anchor scrolls. Instead of jumping to a point in the page, website scrolls smoothly (and at a consistent speed) to each anchor.

#### <a name="saScrollBasic"></a>BASIC SETUP:

1. Follow the Instructions for Scrollimate Installation
2. Call the Method once on the page: `<script> scrollimate.saScroll; </script>` (You may also use the init function by supplying 'saScroll' as an additional argument)

---
---

# <a name="saTabs"></a>SA Tabs 
![TABSCROLL SAMPLE](http://files.moritzzimmer.com/tabscroll.gif)

Create simple, bookmarable, browser-history-respecting tab content on any website. No cluttered Markup: You just need to add **_one_** custom data-attribute.


### <a name="saTabsMarkup"></a>MARKUP:
You need to have two things: 

#### <a name="saTabsMarkupNav"></a>1.) A Navigation of links, with each link wrapped in a parent.

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


#### <a name="saTabsMarkupTabs"></a>2.) A collection of "tabs", the content you want to display as tabs.
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

### <a name="saTabsSetup"></a>SETUP:

1. Follow the Instructions for Scrollimate Installation
2. Call the Method once on the page:
  `<script> scrollimate.saTabs; </script>` (You may also use the init function by supplying 'saTabs' as an additional argument)

### <a name="saTabsAdvSetup"></a>ADVANCED SETUP:

#### Transitions

You can control the type of transition between tabs with the `data-tabscrollnavcontainer` attribute. You can set it to:
- `fade`
- `slide`
- or leave blank for no transition at all

#### Non-Index Version

You may not want your tabs to be indexed / indexable. SA Tabs keeps track of your tabs via the URL, by adding a fragment (“hash”) to the end of the URL. **But what if you have an application on your page that already does that?**

Now SA Tabs can accomodate, by simply calling the `nonIDTabs();` method some time *after* the initial setup. (You can it as an additional argument to the `init` method, *after* the `saTabs` Method) This will not index your tabs, not write to the URL, but still keep the same markup and functionality for your tabs.

### <a name="saTabsExclusion"></a>EXCLUDE LINKS

You want to have a link within your navigation that does something else. An external link, a popup link, etc. This is possible by simply adding the `data-saexclude` attribute to the anchor element.

### <a name="saTabsExclusion"></a>Non-Indexed Version

You may not want your tabs to be indexed / indexable. Tabscroll keeps track of your tabs via the URL, by adding a fragment (“hash”) to the end of the URL. *But what if you have an application on your page that already does that?*

Now Tabscroll can accomodate, by simply calling the `saTabs.nonIDTabs()`; method some time after you included tabscroll.js. This will not index your tabs, not write to the URL, but still keep the same markup and functionality for your tabs.



---
---

# <a name="saScrollclass"></a>SA Scroll Class

Will add a specifiable class to any element when a target element is scrolled, and remove it when it stops scrolling.  

_as of right now, this method_  **_cannot_** **_be_** **_called_** **_with_** **_the_** **_init_** **_method_** :( 

#### <a name="saScrollclassBasic"></a>BASIC SETUP:

- Follow the Instructions for Installation 
- Call the Method once on the page: `<script> scrollimate.scrollClass( $(window), $('.topnav'), 'scrolling' ); </script>` 

SA Scroll Class takes three arguments:

1. *complete jQuery Selector* of the element you want to scroll (in the above example it would be the entire window, but it can be an overflow-ed div, or really anything )
2. *complete jQuery selector* of the element that you want to add the class to (in the above example we are adding a class to the element with the `.topnav` class)
3. The name of the class you want to add

In the above example, the `.topnav` Element will get the `scrolling` class when the `window` is scrolled. 

---
---

# <a name="saAccordion"></a>SA Accordion
(examples: https://codepen.io/justMoritz/pen/vJVZVd)

A simple _horizontal_ accordion for an infinite number of elements.

_as of right now, this method_  **_cannot_** **_be_** **_called_** **_with_** **_the_** **_init_** **_method_** :( 

#### <a name="saAccordionBasic"></a>BASIC SETUP:

1. You will need any number elements with the same selector, for example 5 divs with the class of `element`. _please float these elements left, inline or inline-block the, so they will be next to each other_ . Clearing the float etc. will be up to you.
2. Follow the Instructions for Scrollimate Installation
3. Call the Method once on the page with _two arguments_ like so: `<script> scrollimate.saAccordion('.element', '66.66'); </script>` 

#### <a name="saAccordionAdvanced"></a>Advanced SETUP:

SA Accordion takes **at** **least** **one**, but can take four arguments:

1. The target elements selector (in the above example every element with the `.element` class)
2. (optional) The width (in percent) of the exanded element. If none is provided, the default width is 50%.
3. (optional) The type of event that raises the change over the element selected in argument 1. Can be click, mouseover, mouseout, etc. If left blank, defaults to CLICK
4. (optional) You can determin the height of the element, in pixels, or in percent of the width of the individual element. (This is done via padding-bottom)

Please note that SA Accordion works with float: left;, and will take up 100% of the width of its container, so please plan your markup accordingly. 


---
---

# <a name="saUnderline"></a>SA Underline
(DEMO: https://codepen.io/justMoritz/pen/veMmbE)

If you like the idea of having a link underlined, because it makes them easily identifyable as a to read as a link; but you find that it makes them hard to imposisble to style, this method is for you.

This method will wrap each word inside a link (anchor tag) in it's own span, which you can then style (or style it's pseudo element). See the Demo link for some examples.

_for full functianlity (aka, with arguments), this method can current_ **_not_** **_be_** **_called_** **_with_** **_the_** **_init_** **_method_** :( 

#### <a name="saUnderlineBasic"></a>BASIC SETUP:

The following will target all links:

1. Follow the Instructions for Scrollimate Installation
2. Call the Method once on the page with _two arguments_ like so: `<script> scrollimate.saUnderline(); </script>` 
3. Apply the styles you want to `a span:before` (or something simliar).

*note:* You _can_ call this basic setup via this init() method. 

#### <a name="saUnderlineAdvanced"></a>Advanced SETUP:

If you pass a parameter, it will target 

1 Same as above, but ...
2. ...call with `scrollimate.saUnderline( $('your-selector-here') );`

*note:* You can currently _not_ call this advanced setup via this init() method. 

---
---

# <a name="saRipple"></a>SA Ripple
(DEMO: https://codepen.io/justMoritz/pen/qVxPBZ)

Add a material-design-like ripple effect that activates on click.


_for full functianlity (aka, with arguments), this method can current_ **_not_** **_be_** **_called_** **_with_** **_the_** **_init_** **_method_** :( 

#### <a name="saRippleBasic"></a>BASIC SETUP:

The following will target all links:
=
1. Follow the Instructions for Scrollimate Installation
2. Give the elements you want to have the ripple-effect a class of `.ripple`.
3. Call the Method once on the page with _two arguments_ like so: `<script> scrollimate.saRipple(); </script>` 

*note:* You _can_ call this basic setup via this init() method. 

#### <a name="saRippleAdvanced"></a>Advanced SETUP:

You can set the ripple color in 3 ways: 
  - use default: White. Nothin is needed other than the call the function one time on the page
  - When initializing saRipple, you can set the color by passing it as an argument, like so `scrollimate.saRipple({color: #ff4400});`
  - add the `data-ripplecolor` attribute the dom element, and put the complete CSS color therein

You can also target just a specifc element by passing a `target` of the complete jQuery selector like so: `scrollimate.saRipple({target: $(your-selector-here) });`

You can also cause the ripple effect on mouseover, etc. by passing an `interaction` argument like so: `scrollimate.saRipple({interaction: 'mouseover' });`

You can also set `noclass` to `true`, in which case the target element will not inherit the basic styles required to make ripple effect work. (display: inline-block, overflow: hidden, position relative). Remember to apply them manually!

Finally, you can combile all the arments and may end up with something like this:

    scrollimate.saRipple({
      color: 'rgba(0,255,0,0.05)',
      interaction: 'mouseover',
      target: $('.mouseclass'),
      noclass: true
    });

*note:* You can currently _not_ call this advanced setup via this init() method. 






