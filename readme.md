# Scrollimate!

Finally, the first version of scrollimate after years of having only indivdual components available!

Scrollimate focuses on features and functions related to scrolling, animations (hence the name), but includes also other functionalities.


## Usage & Setup: 

This is a *jQuery Plugin*, so you'll need jQuery. 
In the body, right before the footer: Include jQuery. Include scrollimate.js.

    <script src="path/to/your/scripts/jquery-2.1.4.min.js"></script>
    <script src="path/to/your/scripts/scrollimate.js"></script>

Each of the functionalities are implemented as methods of the scrollimate object. That means you just need to call the method you want, or you can use the handy init function and just need one call for them all!


### Init Function

(Parallax is called via the init method)

The init function takes a single argument, an array of the methods you want to use, for example:

  scrollimata.init(['saScroll', 'parallax'])

will initiate the Smooth Anchor Sroll and Parallax functions


### Calling Methods manually

While you can call (almost) every method via *init*, you can also call the methods each manually, such as:

  scrollimate.saTabs();

which will initiate the saTabs Function


## The Methods

What does Scrollimate Entail? Let's take a look:

---

### SA Parallax

The original scrollimate function. You _have to_ call sa Parallax with the init function.

#### Basic Setup:

- Follow the Instructions for installation
- add the following data-attribute to the element you wish to parallax scroll: `data-sabglayer`
- Call the init Function with:
  `<script> scrollimate.init(['saParallax']); </script>`

#### Advanced Setup:

You can tell the `data-sabglayer` attribute how your parallax animation should behave.
By Default, it will simply start at the top and will scroll at half the speed that the page once you start scrolling.
The `data-sabglayer` will take two arguments. 

If you supply it only one number, this is the speed at which you want the element to scroll relative to the page speed. 
  data-sabglayer="-0.5, 0.36"
To create several layers of parallax, or simply to more fine-tune the effect, you can se the `data-sabglayer` attribute to any floating point value between 0 (which will cause the element to scroll normally) and 2 (which will cause the element to appear static on the page). You can also use any number larger than 2, which will cause the element to scroll in the opposite direction of the scroll! And yes, you can also use negative numbers and make the element scroll faster than the page!
  
If you supply two argments seperated by comma like so:
  data-sabglayer="-0.5, 0.36"
You can define the position of parallaxing element. This is useful if you want the element to be positioned “perfectly” when it is scrolled in the center of the page, for example. `0,5` is usually a good start, buy you may need to play around with the number.

*More importantly*, giving this attribute is useful if the element you wish to parallax is not at the top. The element will only _start_ parallaxing _once in view_, and will be offset by the number specified. (If the second argument is not given, the element will start parallaxing from the very moment the page scrolls).