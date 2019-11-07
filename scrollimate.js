/* Scrollimate 2
 *
 * written by Moritz Zimmer, 2016 – 2019
 * http://www.moritzzimmer.com
 *                      _ _                   _
 *  ___  ___ _  __ ___ | | (_)_  __  __  __ _| |_  ___   (_)___
 * / __|/ __| |/ //   \| | | | |/  |/  |/  ' |  _|/   \  | / __|
 * \__ \ (__|  / | ( ) | | | | | | | | | ( ) | |_|  O_/  | \__ \
 * |___/\___|__|  \___/|_|_|_|_| |_| |_|\__\_|\__|\___(_)/ |___/
 *                                                     |__/
 * (c) 2019 CC Attribution 4.0
 * https://creativecommons.org/licenses/by/4.0/legalcode
 *
 */
var scrollimate = (function($){

  var _global = {
    wp:   0,
    prlx: false,
    speed: 1,
    saBgLay: [],
    saWinHi: '',
    mobileEnabled: false,
    isMObile: false,
    indexable: true,
    transition_type: '',
  };

  /* * checks and sets variable that enables parallax even on mobile in init function * */
  var enableMobile = function(){
    _global.mobileEnabled = true;
  };

  /* *
   * Executes Functions based on input String.
   * Currently does not support arguments
   */
  var _executeFunctionByName = function (functionName) {
    var context = window;
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(context);
  };


  /* * Parallax Functionality * * /
   *
   *
   * The Parallax Animation Chain works as follows:
   * 1.) Init ->
   * 2.) -> saParallax (setup);
   *
   * 3.) Scroll Listener (inside Init) ->
   * 4.) -> _saParallaxAnimation ->
   * 5.) -> __saParallaxHelperFunction
   *
   *
   * 5: __saParallaxHelperFunction:
   *    Takes the inputOpject object generated inside _saParallaxAnimation
   *    to do the actual calculations as they are applied to the individual
   *    Elements.
   *    This function also checks whether or not the code is run in a mobile
   *    viewport size, and if so, whether or not it has been indicated that
   *    the code will run in mobile (which by default it does not)
   *
   *    In case of non-parallax mobile, the final else statement resets all
   *    transformations that may have already happened. This is useful in case
   *    The window is resized from a non-mobile size to a mobile size after
   *    transformations have already occurred.
   */
  var __saParallaxHelperFunction = function(inputObject){

    var ___executeHelperFunction = function(){
      if(inputObject.flag === 0){
        inputObject.tOfSet = 0;
        inputObject.winHi = 0;
        inputObject.elHeight = 0;
      }
      $(inputObject.saBg).css("transform", "translate3d("+inputObject.left+", "+Math.floor((((_global.wp-inputObject.tOfSet+inputObject.winHi)/2)*inputObject.spd)+inputObject.elHeight)+"px, 0px)");
      $(inputObject.saBg).css("-ms-transform", "translate("+inputObject.left+", "+Math.floor((((_global.wp-inputObject.tOfSet+inputObject.winHi)/2)*inputObject.spd)+inputObject.elHeight)+"px)");
    };

    if(_global.mobileEnabled === true){
      ___executeHelperFunction();
    }
    else{
      if ( $(window).width() > 767) {
        ___executeHelperFunction();
      }
      /* Resets all transformations that may have already happened before the window was resized below 768px */
      else{
        _global.saBgLay.css('transform', 'translate3d(0, 0, 0)');
      }
    }
  };


  /**
   *
   * 4: _saParallaxAnimation:
   *    Loops through each of the saBgLayers elements. (from saParallax function),
   *    parses and splits the data-attribute arguments. First is speed, second is position.
   *
   *    If only more than argument is given set posFlag to 1, which will cause the
   *    element to only start parallaxing once in view, and be offset by the number specified.
   *    elHeight gets passed into the __saParallaxHelperFunction.
   *    If second argument is not given, element starts parallaxing from the moment page loads.
   *
   *    A parallaxHelperConfig object gets passed to __saParallaxHelperFunction,
   *    which does the actual calculation. If an element been positioned in CSS with
   *    translateX(50%) to achieve centering, the 'left' entry in the object is changed accordingly.
   *    Because of the horizontal nature of parallax scrolling, saParallax does not currently
   *    support the prevervation of translateY(-50%), though this feature is planned for the future
   */
  var _saParallaxAnimation = function($saBgLayers){
    for (var i = 0 ; i < $saBgLayers.length ; i++){
      var posFlag   = 0,
          $curEl    = $($saBgLayers[i]),
          topoffset = $curEl.offset().top,
          elHeight  = $curEl.css('height');

      elHeight = parseInt(elHeight, 10);

      var dataBgAttributes = $curEl.attr('data-sabglayer').split(', ');

      if( dataBgAttributes.length > 1 ){
        posFlag = 1;
        // if set to center, math will attempt to keep the item always in view.
        if (dataBgAttributes[1] === 'center'){
          elHeight = -(elHeight/2)*dataBgAttributes[0];
        }
        // otherwise, use tranditional logic.
        else{
          elHeight = elHeight*dataBgAttributes[1];
        }
      }

      var $speed = 1;

      if ( $curEl.attr("data-sabglayer") === "" )  {
        $speed = 1;
      }
      else{
        $speed = dataBgAttributes[0];
      }

      var parallaxHelperConfig = {
        saBg: $saBgLayers[i],
        tOfSet:  topoffset,
        winHi: _global.saWinHi,
        spd: $speed,
        elHeight: elHeight,
        left: '0px' ,
        flag: posFlag
      };

      if ($curEl.css("transform") === "translateX(-50%)"){
        parallaxHelperConfig.left = '-50%';
      }

      __saParallaxHelperFunction( parallaxHelperConfig );
    }
  };

  /**
   *
   * 2: saParallax:
   *    Intial Setup, parsing and first draw:
   *
   *    Selects all the elelemts with the data-sabglayer attribute. These are stored inside
   *    a variable within the _global object, because it needs to stay accessible in the
   *    entire application, as it is continually used in the $(window).scroll and resize
   *    functions initialized within the init method.
   *
   *    Method only runs functionality if there are elements present (not no elements).
   *    Then runs the initial parallax animation.
   *
   *    Also finally sets the _global.prlx to true to make sure the scroll and resize functions
   *    in the init method only calculate and call this function if everything is set.
   */
  var saParallax = function () {

    _global.saBgLay = $("[data-sabglayer]");
    _global.saBgLay.css('will-change', 'transform');

    if( _global.saBgLay.length !== 0 ){
      _saParallaxAnimation(_global.saBgLay);

      console.log('parallax initiated');
      _global.prlx = true;
    }
  };


  /* * Smooth Anchor Scroll Functionality * * /
   *
   * Listens to hash fragment url click, then adds a little bit of time
   * to the scrolling based on how far the target is from the top to ensure
   * that the scroll motion is always about the same percieved velocity.
   * Page is animated to scroll from the top to the element that that matches
   * the href attribute.
   * return false to prevent default
   * you can pass a callback into the function call, which will execute as soon as the animation is over
   */
  var saScroll = function(force, callback) {
    callback = callback || false;
    console.log('saScroll initiated');
    $('[href^="#"]').click(function(){
      var $this = $(this);
      if( $this.attr('href') !== 'javascript:void(0);' && $($this.attr('href')).length && $this.attr('href') !== '#' ){
        var smoothAnchorScrollTime = 500 + (Math.floor($($this.attr("href")).offset().top))/2;
        var scrollEvents = "";
        if(force){
          scrollEvents = "";
        }else{
          scrollEvents = "scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove";
        }
        var $page = $('html, body');

        $page.on(scrollEvents, function(){
          $page.stop();
        });
        $page.animate({
          scrollTop: $( $this.attr('href') ).offset().top
        }, smoothAnchorScrollTime).promise().then(function() {
          $page.off(scrollEvents);
          if( callback ){
            callback();
          }
        });
        return false;
      }
    });
  };


  /* * SA Tabs Functionality * * /
   *
   *
   * The SA Tabs Functionality Chain:
   * 1.) saTabs ->
   * 1.1) -> 3
   * 1.2) -> (Hash Change Listener, triggers 3)
   *
   * 2.) _saTabsSetUpPage
   * 3.) _saTabsHashChangeFunct
   *
   *
   * 2: _saTabsSetUpPage:
   *    Finds all anchor tabs within the data-tabscrollnavcontainer and reads the attribute.
   *    If a type was passed here, it will control the method of change: fade, slide and none.
   *    The active class is added to the first tab-navigation
   *
   *    Then loops and targets each and every link's href-attribute found within the tabscrollnavcontainer
   *    and adds the navigational data-attribute to each anchor tag's parent
   *
   *    We then use this anchor to find each element, section, etc. that has the
   *    same ID as the anchor tag we found.
   *
   *    Final section sets a custom data-tabscroll attribute to each section that correspons
   *    with the link in the navigation, stripping off the # (substring)
   *
   *    Also Removes each id tag of an data-tabscroll element (to help some browsers prevent)
   *    default behaviour, and hiding all sections initially except the one specified.
   */
  var _saTabsSetUpPage = function() {
    var $tabscrollAnchors = $("[data-tabscrollnavcontainer]").find("a, button").not("[data-saexclude]");
    _global.transition_type = $("[data-tabscrollnavcontainer]").attr("data-tabscrollnavcontainer");

    for (var $i = 0; $i < $tabscrollAnchors.length; $i++){
      var $curEl = $($tabscrollAnchors[$i]),
          eachAnchor = $curEl.attr("href");
      $curEl.parent()
        .attr("data-tabscrollnavi", eachAnchor.substring(1))
        .find('a, button')
          .attr("id", 'roletab'+eachAnchor.substring(1));
      $(eachAnchor)
        .attr("data-tabscroll", eachAnchor.substring(1))
        .attr("aria-labelledby", 'roletab'+eachAnchor.substring(1))
        .attr('tabindex', '-1')
        .attr('role', 'tabpanel');

      // removes link if in non-indexable version (to not interfere with app status keeping)
      if(!_global.indexable){
        $curEl
          .attr("href", 'javascript:void(0);')
          .css('cursor', 'pointer')
          .attr('role', 'tab');
        _saTabHelpers.saTabsPrepInactiveElement( $curEl );
        $curEl.on('click', function(){
          var tab_target = $(this).parent().attr("data-tabscrollnavi");
          _saTabsHashChangeFunct(tab_target);
        });
      }
    }
    _saTabHelpers.saTabsPrepActiveElement( $($tabscrollAnchors[0]) );

    $("[data-tabscroll]").removeAttr('id');
    $("[data-tabscroll]:first-of-type").siblings("[data-tabscroll]").hide();

    document.onkeydown = _saTabHelpers.saTabsHashKeyListener;
  };

  jQuery.expr[':'].focus = function( elem ) {
    return elem === document.activeElement && ( elem.type || elem.href );
  };


  /**
   * Collections of Methods used by saTabs
   */
  var _saTabHelpers = {
    /**
     * Listens for keystrokes related to tabchanges
     * @param  {event} e  event
     */
    saTabsHashKeyListener: function(e){
      // First checks that the current active tab has focus, so that tabs don't change if not desired
      var $activeElement = $('.tabscroll_activeNavi').find('a, button');
      if ( $activeElement.is(":focus") ) {
        e = e || window.event;

        // if Home Button, activate first tab
        if (e.keyCode == '36') {
          var $firstTab = $('[data-tabscrollnavi]:first-child').find('a, button');

          // only proceed if the link is not excluded (and exists)
          if( $firstTab.length && !$firstTab[0].hasAttribute('data-saexclude') ){

            // non-indexed version simply trigger click
            if(!_global.indexable){
              $firstTab.trigger('click').focus();
            }
             // for indexed version, change hash and focus tab
            else{
              window.location.hash = $firstTab.attr('href');
              $firstTab.focus();
            }
          }
        }

        // if End Button, activate last button
        // other documentation same as above
        else if (e.keyCode == '35') {
          var $lastTab = $($('[data-tabscrollnavi]')[$('[data-tabscrollnavi]').length - 1]).find('a, button');
          if( $lastTab.length && !$lastTab[0].hasAttribute('data-saexclude') ){
            if(!_global.indexable){
              $lastTab.trigger('click').focus();
            }
            else{
              window.location.hash = $lastTab.attr('href');
              $lastTab.focus();
            }
          }
        }

        // if left arrow, activate previous tab
        // other documentation same as above
        else if (e.keyCode == '37') {
          var $prevTab = $('.tabscroll_activeNavi').prev('[data-tabscrollnavi]').find('a, button');
          if( $prevTab.length && !$prevTab[0].hasAttribute('data-saexclude') ){
            if(!_global.indexable){
              $prevTab.trigger('click').focus();
            }else{
              window.location.hash = $prevTab.attr('href');
              $prevTab.focus();
            }
          }
        }

        // if right arrow, activate next tab
        // other documentation same as above
        else if (e.keyCode == '39') {
          var $nextTab = $('.tabscroll_activeNavi').next('[data-tabscrollnavi]').find('a, button');
          if( $nextTab.length && !$nextTab[0].hasAttribute('data-saexclude') ){
            if(!_global.indexable){
              $nextTab.trigger('click').focus();
            }else{
              window.location.hash = $nextTab.attr('href');
              $nextTab.focus();
            }
          }
        }

      }
    },

    /**
     * Changes the markup of an element to be the active tab.
     * @param  {object} $input   LINK, not the PARENT
     */
    saTabsPrepActiveElement: function($input){
      $input
        .attr('aria-selected', 'true')
        .attr('tabindex', '0')
        .addClass('this--active')
        .parent().addClass("tabscroll_activeNavi");
    },

    /**
     * Changes the markup of an element to be the INactive tab.
     * @param  {object} $input   LINK, not the PARENT
     */
    saTabsPrepInactiveElement: function($input){
      $input
        .attr('aria-selected', 'false')
        .attr('tabindex', '-1')
        .removeClass('this--active')
        .parent().removeClass("tabscroll_activeNavi");
    },
  };


  /**
   *
   * 3: _saTabsHashChangeFunct:
   *    Called both initially in saTabs and also on each Hash (URL fragment) change, monitured
   *    by the saTabs Method.
   *
   *    If this function is called with an input parameter, use that as location. This means it was
   *    called as the non-indexed version through a click event. If not, grab location from the href
   *
   *    Writing the URL that raised the event into a string, stripping off everything before the hash
   *    In order to parse the users navigational input.
   *
   *    If there is no hash (or it set to 'all'), show only the first section of tab content.
   *    If there is a hash-link active, function will hide all tabs, fade in only the tab with
   *    the data-tabscroll attribute corresponding to the link that was clicked.
   *
   *    Finally, also checks for the 'fade' and 'slide' transition types, and executes different
   *    funcionality, which I would like to break out into different functions eventually.
   */
  var _saTabsHashChangeFunct = function( masterinput ) {
    $(document).trigger('satabchanged');
    /* checks the current location, matches it to the element containing the link, and adds correct class */
    var __activeClassHelperFunction = function(inputLoc){
      var $naviEls = $('[data-tabscrollnavi]');
      for (var i=0; i<$naviEls.length; i++){
        var $curEl = $($naviEls[i]);
        if( $curEl.data('tabscrollnavi') === inputLoc ){
          _saTabHelpers.saTabsPrepInactiveElement( $('.tabscroll_activeNavi').find('a, button') );
          _saTabHelpers.saTabsPrepActiveElement( $curEl.find('a, button') );
        }
      }
    };

    var location;

    if (typeof masterinput !== 'undefined') {
      location = masterinput;
    }
    else{
      location = String(document.location);
      location = location = location.split("#")[1]; // if the location is not passed as master input, we use the has instead!
    }

    // check if location resolves to a tab and sets the exists variable to true
    var $allTabs = $("[data-tabscroll]");
    var exists = false;
    for(var i=0; i < $allTabs.length; i++){
      var curtab = $($allTabs[i]).attr('data-tabscroll');
      if( curtab === location ){
        exists = true;
      }
    }

    if (location === undefined || location === 'all' || exists === false){
      var $firstTab = $("[data-tabscroll]:first-of-type");
      $firstTab.show();
      $firstTab.addClass('activeTab').attr('tabindex', '0');
      if(_global.indexable){
        window.location.hash = $firstTab.attr('data-tabscroll');
      }
    }
    else{
      $("[data-tabscroll]").hide().removeClass('activeTab');

      if ( _global.transition_type === 'fade') {
        $("[data-tabscroll='"+location+"']")
          .fadeIn()
          .addClass('activeTab')
          .attr('tabindex', '0');
        __activeClassHelperFunction(location);

      }
      else if ( _global.transition_type === 'slide') {
        $("[data-tabscroll='"+location+"']")
          .slideDown()
          .addClass('activeTab')
          .attr('tabindex', '0');
        __activeClassHelperFunction(location);
      }
      else{
        $("[data-tabscroll='"+location+"']")
          .show()
          .addClass('activeTab')
          .attr('tabindex', '0');
        __activeClassHelperFunction(location);
      }
    }
  };

 /**
   *
   * 1: saTabs:
   *    Runs the _saTabsSetUpPage function, the initial instance of the _saTabsHashChangeFunct,
   *    then also monitors the hash change to run the _saTabsHashChangeFunct as needed.
   *    Only Monitors hash change if the indexable setting is set to true
   *
   *    Hash changed is implemented as follows:
   *    Stores the previous hash, then listens if it has changed every frew millisectons
   *    Needed for IE9. Adapted from https://stackoverflow.com/questions/680785/on-window-location-hash-change
   *
   *    (In previous versions, this had been triggered by $(window).on('hashchange', function (event) { )
   */
  var saTabs = function () {
    _saTabsSetUpPage();

    if(_global.indexable){
      var prevHash = window.location.hash;
      window.setInterval(function () {
        if (window.location.hash !== prevHash) {
          prevHash = window.location.hash;
          _saTabsHashChangeFunct();
        }
      }, 100);
    }

    $(window).on('load', function(){
       _saTabsHashChangeFunct();
    });

    console.log('saTabs initiated');
  };

  /**
  * Public Helper Method that sets the SA TABS status to non-indexable
  */
  var nonIDTabs = function(){
    _global.indexable = false;
  };


  /**
   *
   * SA Scroll Class:
   *
   * Function adds class class to target element while and ONLY WHILE scrollingElement is scrolled
   */
  var saScrollClass = function ( $scrollingElement, $target, classname ){
    $target.addClass('scrollprep');
    var timer,
        flag = false;

    $scrollingElement.scroll(function() {
      if (!flag) {
        flag = true;
        $target.addClass(classname);
      }
      clearTimeout(timer);
      timer = setTimeout(function() {
        $target.removeClass(classname);
        flag = false;
      }, 200);
    });
  };

  jQuery.fn.getSelector = function() {
    return this.data('selector');
  };


  /**
   *
   * SA Accordion Functionality:
   *
   * Function consists mainly of the __saAccordionHelper function,
   * which is called on initial load, and also every time the window is resized,
   * for resizing.
   *
   *
   */
  var saAccordion = function(element, mainwidthinpercent, type, imageaspectratio){
    var __saAccordionHelper = function(){
      var $element = $(element);
      if (mainwidthinpercent === undefined){
        mainwidthinpercent = '50';
      }
      // number of elements
      var numEl = $element.length;
      var restwidth = (100-mainwidthinpercent)/(numEl-1);

      // desktop functionality
      if ( $(window).width() > 767) {
        // if no imageaspectratio is given, default to 33%
        if(imageaspectratio === undefined){ imageaspectratio = "33%" ;}
        $element.css('float', 'left');
        $element.css('padding-bottom', imageaspectratio);
        $element.css('width', restwidth+'%').removeClass('active');
        $($element[0]).css('width', mainwidthinpercent+'%').addClass('active');
      }
      // mobile functionality
      else{
        $element.css('width', '100%');
        $element.css('height', 0).css('padding-bottom', restwidth+'%').removeClass('active');
        $($element[0]).css('height', 0).css('padding-bottom', mainwidthinpercent+'%').addClass('active');
      }

      // if no type is given, default to click
      if (type === undefined){ type = 'click'; }
      $element.on(type, function(){
        // desktop functionality
        if ( $(window).width() > 767) {
          // console.log(restwidth);
          $element.css('width', restwidth+'%').removeClass('active');
          $(this).css('width', mainwidthinpercent+'%').addClass('active');
        }
        // mobile functionality
        else{
          $element.css('width', '100%');
          $element.css('height', 0).css('padding-bottom', restwidth+'%').removeClass('active');
          $(this).css('height', 0).css('padding-bottom', mainwidthinpercent+'%').addClass('active');
        }
      });

      setTimeout(function(){
        $element.css('transition', 'all 0.6s');
      }, 1000);
    };
    __saAccordionHelper();

    window.addEventListener('resize', function () {
      __saAccordionHelper();
    });
  };

  /**
   * saAccordion (jQuery extension)
   *
   * Extends the jQuery Object with the saUnderline Method (jQuery.saUnderline)
   */
  jQuery.fn.saAccordion = function(mainwidthinpercent, type, imageaspectratio) {
    saAccordion(this, mainwidthinpercent, type, imageaspectratio);
    return this;
  };



  /**
   * saUnderline
   *
   * Targets either all <a> anchor tags,
   * or and FULL jQuery selector
   *
   * wraps each word in a link tag in a span with class of underline,
   * for the purpose of better stying underlines via pseudo classes
   */
  var saUnderline = function($target){
    $target = $target || $('a');
    var $allLinks = $target;
    for(var i=0; i<$allLinks.length; i++){
      var cur   = $allLinks[i],
          words = $(cur).text().split(" ");
      $(cur).empty();
      $.each(words, function(i, v) {
        $(cur).append($("<span class='underline'>").text(v+' '));
      });
    }
  };

  /**
   * saUnderline (jQuery extension)
   *
   * Extends the jQuery Object with the saUnderline Method (jQuery.saUnderline)
   */
  jQuery.fn.saUnderline = function() {
    scrollimate.saUnderline( $(this) );
    return this;
  };


 /**
  * saRipple
  *
  * Add a material-design-like ripple effect that activates on click.
  *
  * @ (optional) target. By default it will be all elements with the class .ripple
  * @ (optional) color: CSS value. See below
  * @ (optional) interaction: See below
  * @ (optional) noclass: true/FALSE
  *
  * You can set the ripple color in 3 ways:
  *   - use default: White. Nothin is needed other than the call the function one time on the page
  *   - When initializing saRipple, you can set the color by passing it as an argument.
  *   - add the data-ripple attribute the dom element, and put the complete CSS color therein
  *
  * Notes:
  * Parses input arguments, adds styles to head of page, adds ripplestyles base-class to all targets
  * The listens to the desired interaction and appends the div to inside that element, based on the
  * mouse cursor position.
  * If noclass is set to true, the target element will not inherit the basic styles required to make
  * ripple effect work. (display: inline-block, overflow: hidden, position relative)
  */
  var saRipple = function($input){

    var fallbackcolor = '#ffffff',
        inttype = 'click',
        noclass = false,
        $target;

    if(typeof $input !== 'undefined'){
      $target = $input.target || $('.ripple');
      fallbackcolor = $input.color || '#ffffff';
      inttype = $input.interaction || 'click';
      noclass = $input.noclass || false;
    }else{
      $target = $('.ripple');
    }

    if($("#scrollimate__ripplestyles").length){}else{
      $('<style id="scrollimate__ripplestyles">.ripplestyles{display: inline-block;overflow:hidden;position: relative;}.ripple-effect{pointer-events: none;animation: ripple-animation 2s;-webkit-animation: ripple-animation 2s;-ms-animation: ripple-animation 2s;-o-animation: ripple-animation 2s;-moz-animation: ripple-animation 2s;background: white;border-radius: 50%;height: 50px;position: absolute;width: 50px;}@keyframes ripple-animation {from {transform: scale(1);-webkit-transform: scale(1);-ms-transform: scale(1);-o-transform: scale(1);-moz-transform: scale(1);opacity: 0.4;}to {transform: scale(100);-webkit-transform: scale(100);-ms-transform: scale(100);-o-transform: scale(100);-moz-transform: scale(100);opacity: 0;}}-webkit-@keyframes ripple-animation {from {transform: scale(1);-webkit-transform: scale(1);-ms-transform: scale(1);-o-transform: scale(1);-moz-transform: scale(1);opacity: 0.4;}to {transform: scale(100);-webkit-transform: scale(100);-ms-transform: scale(100);-o-transform: scale(100);-moz-transform: scale(100);opacity: 0;}}-ms-@keyframes ripple-animation {from {transform: scale(1);-webkit-transform: scale(1);-ms-transform: scale(1);-o-transform: scale(1);-moz-transform: scale(1);opacity: 0.4;}to {transform: scale(100);-webkit-transform: scale(100);-ms-transform: scale(100);-o-transform: scale(100);-moz-transform: scale(100);opacity: 0;}}-o-@keyframes ripple-animation {from {transform: scale(1);-webkit-transform: scale(1);-ms-transform: scale(1);-o-transform: scale(1);-moz-transform: scale(1);opacity: 0.4;}to {transform: scale(100);-webkit-transform: scale(100);-ms-transform: scale(100);-o-transform: scale(100);-moz-transform: scale(100);opacity: 0;}}-moz-@keyframes ripple-animation {from {transform: scale(1);-webkit-transform: scale(1);-ms-transform: scale(1);-o-transform: scale(1);-moz-transform: scale(1);opacity: 0.4;}to {transform: scale(100);-webkit-transform: scale(100);-ms-transform: scale(100);-o-transform: scale(100);-moz-transform: scale(100);opacity: 0;}}</style><!--[if IE 9]><style>.ripple-effect{display:none;}</style><![endif]-->').appendTo($('head'));
    }

    if(!noclass){
      $target.addClass('ripplestyles');
    }

    var _execute = function(event, passedthis){
      var $div = $('<div/>'),
          btnOffset = $(passedthis).offset(),
          xPos = event.pageX - btnOffset.left,
          yPos = event.pageY - btnOffset.top;

      $div.addClass('ripple-effect');
      var $ripple = $(".ripple-effect");

      $ripple.css("height", $(passedthis).height());
      $ripple.css("width", $(passedthis).height());
      var color = $(passedthis).data("ripplecolor") || fallbackcolor;
      $div.css({
          top: yPos - ($ripple.height()/2),
          left: xPos - ($ripple.width()/2),
          background: color
        }).appendTo($(passedthis));

      window.setTimeout(function(){
        $div.remove();
      }, 1500);
    };

    var reseter = false;

    if(inttype === 'mouseover'){
      $target.on(inttype, function (event) {
        if(reseter === true){
          _execute(event, this);
          reseter = false;
        }
      });

      $target.on('mouseout', function(){
        reseter = true;
      });
    }
    else{
      $target.on(inttype, function (event) {
        _execute(event, this);
      });
    }
  };

  /**
   *  saRipple (jQuery extension)
   *
   * Extends the jQuery Object with the “saRipple” Method (jQuery.saRipple)
   * The target (the element this method was run on) is added to the input,
   * then it calls the (scollimate-internal) Method (scrollimate.saRipple)
   *
   * @param  input  JSON (Optional)
   * @return        appended jQuery Object
   */
  jQuery.fn.saRipple = function(input) {
    var passedinput;
    for(var i=0; i < this.length; i++){
      if(input === undefined){
        passedinput = { target: $(this[i]) };
      }
      else{
        passedinput = input;
        passedinput.target = $(this[i]);
      }
      saRipple(passedinput);
    }
    return this;
  };


  /**
   * Helper Functions for springyElement
   * @type {Object}
   */
  var _springyElementHelpers = {

    /**
     * Stores the original position of the element
     * @param  {jQUery}  the individual jQuery element
     */
    setInitialPosition: function($element){
      $element.attr('data-springycompoundx', 0);
      $element.attr('data-springycompoundy', 0);
    },


    /**
     * Puts the element back into the original position
     * @param  {jQUery}  the individual jQuery element
     */
    resetPosition: function($element){
      $element.css('transform', 'translate(0,0');
      $element.attr('data-springycompoundx', 0);
      $element.attr('data-springycompoundy', 0);
    },


    /**
     * Checks and moves the element
     * @param  {event}   passed event from element
     * @param  {jQUery}  the individual jQuery element
     * @param  {int}     max amount of px element can travel
     */
    mouseUpdateFunct: function(e, $element, modifier){

      // variables to hold the input
      var inputx, inputy;

      // determines whether or not input is touch event
      // (if `touches` table is present in the originalEvent)
      // or if not, use the mouse position instead
      if( e.originalEvent.touches === undefined ){
        inputx = e.pageX;
        inputy = e.pageY;
      }else{
        inputx = e.originalEvent.touches[0].pageX;
        inputy = e.originalEvent.touches[0].pageY;
      }

      // calculates the difference between the old and the new
      // position, and then updates variable store (on the
      // element for the next round
      var differenceX = inputx - $element.attr('data-springyx');
      var differenceY = inputy - $element.attr('data-springyy');
      $element.attr('data-springyx', inputx);
      $element.attr('data-springyy', inputy);

      // the transform property used below (if condition is met)
      var newXposition = Number( $element.attr('data-springycompoundx') ) + differenceX;
      var newYposition = Number( $element.attr('data-springycompoundy') ) + differenceY;

      // stores the new position
      $element.attr('data-springycompoundx',  newXposition);
      $element.attr('data-springycompoundy',  newYposition);

      // if the total amount of pixels the element will have moved
      // does not exceed the max. amount of pixels the element is allowed to move
       if(
        newXposition > modifier  ||
        newYposition > modifier  ||
        newXposition < -modifier ||
        newYposition < -modifier
      ){
        if( newXposition > modifier*12  ||
            newYposition > modifier*12  ||
            newXposition < -modifier*12 ||
            newYposition < -modifier*12
        ){
          $element.css('transform', 'translate('+ 0 + 'px, ' + 0 + 'px');
        }
       }else{
         $element.css('transform', 'translate('+ newXposition + 'px, ' + newYposition + 'px');
       }
    },


    /**
     * Adds class to all springy elements and creates
     * unique styletag in head, if not already present
     * @param  {jQUery}  the element to apply the springy functionality to
     */
    elementStyleSetup: function($passedElementName){
      $passedElementName.addClass('scrollimate-springyelement');
      if( !$("#scrollimate__springyelementstyles").length ){
        $('<style id="scrollimate__springyelementstyles">.scrollimate-springyelement{transition: all 0.2s ease;}</style>').appendTo($('head'));
      }
    },
  };


  /**
   * The method which jQuery is being extended by
   * @param  {jQuery}  jQuery selector calling the method
   * @param  {int}     max distance the element can travel in pixels
   */
  var springyElement = function($passedElement, distance){

    // default setting for distance.
    distance = distance || 20;

    // sets required styles for elements
    _springyElementHelpers.elementStyleSetup($passedElement);

    // execute for each individual element
    $passedElement.each(function(){

      var $element = $(this);

      // set the intial data-attributes
      _springyElementHelpers.setInitialPosition($element);

      // set the inital position of where the mouse entered the element
      $element.on('mouseenter', function(e){
        $element.attr('data-springyx', e.pageX);
        $element.attr('data-springyy', e.pageY);
      });

      // Element being moved over listener
      $element.on('mousemove', function(e){
        _springyElementHelpers.mouseUpdateFunct(e, $element, distance);
      });

      // Element being touched and moved listener
      $element.on('touchmove', function(e){
        _springyElementHelpers.mouseUpdateFunct(e, $element, distance, true);
      });

     // resets the element when the mouse leaves
      $element.on('mouseup, mouseout', function(){
        _springyElementHelpers.resetPosition($element);
      });

     // resets the element when the touch is released
      $element.on('touchend', function(){
        _springyElementHelpers.resetPosition($element);
      });

    }); // end .each()

  };


  /**
   * Extends the jQuery object with the springyElement Method
   * @param  {int}  max distance the element can travel in pixels
   */
  jQuery.fn.springyElement = function(distance) {
    springyElement( $(this), distance );
    return this;
  };


  /**
   * Helper Functions for _scrollStuff
   * @type {Object}
   */
  var _scrollStuffHelpers = {
    /**
     * checks if element in in view and applies class
     * @param  {jQuery Selector} The full jQuery selector you want to use
     * passed from inview() initial call
     */
    inviewChecker: function($passedselector, passedrepeat, passedclassname, passeddelay){
      if($passedselector !== undefined){
        $passedselector.each(function(){
          // console.log( _global.wp + _global.saWinHi )
          // console.log( $(this).offset().top  )
          if( _global.wp + _global.saWinHi > $(this).offset().top ){
            var $passedthis = $(this);
            setTimeout(function(){
              $passedthis.addClass(passedclassname);
            }, passeddelay);
          }else{
            if(passedrepeat){
              $(this).removeClass(passedclassname);
            }
          }
        });
      }
    },

    height: function($selector){
      return $selector.outerHeight(true);
    },
  };


  /**
   * @param  {object} Takes the input parameters from original call
   */
  var inview = function( selector, calledinput ){

    var repeat    = false;
    var classname = 'this--nowinview';
    var delay     = 0;

    if (typeof(calledinput) !== 'undefined') {
      repeat    = calledinput.repeat    || repeat;
      classname = calledinput.classname || classname;
      delay     = calledinput.delay     || delay;
    }

    _global.wp = $(window).scrollTop();

    _scrollStuffHelpers.inviewChecker(selector, repeat, classname, delay);

    $(window).scroll( function(){
      _scrollStuffHelpers.inviewChecker(selector, repeat, classname, delay);
    }); // end window scroll
  };


  /**
   *
   * Extends the jQuery Object with the scrollstuff Method,
   * which calls the inview method with an input object as defined below
   *
   * @param  {object}       Takes the following input parameters
   *
   *   {
   *      repeat:    {boolean}  whether or not the animation repeats
   *                            when it's out and in of view again
   *      classname: {string}   name of the class to attach to object
   *                            'this--nowinview' by default.
   *      delay:     {int}      delay until class is added, in milliseconds
   *   }
   *
   */
  jQuery.fn.scrollstuff = function(inputobject) {
    inview(this, inputobject);
    return this;
  };




  /**
    * Init Function
    *
    * On Document Ready, calculates the height of viewport (window Height)
    *
    * Parses the arguments-array given to the init method's call, loops through
    * them and then executes the function with the corresponding name.
    * Some Error Checking Applies, and see comments further down for classic
    * and Fallback Methods
    *
    * On Window Resize, re-calculate the window height, and re-run parallax, if is enabled
    * On window scroll, update the window position variable (_global.wp), and re-run parallax, if enabled
    *
    */
  var init = function(input){

    $(function(){
      _global.saWinHi = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
      _global.wp = $(window).scrollTop();

      // checks if the init method was called with the old way,
      // if so, loops through the array and executes each function by name
      var calledWithArr = Object.prototype.toString.call(input) == '[object Array]';
      if( calledWithArr ){
        console.log( 'Classic Init Method classically calling the following Methods: ' );
        for(var i=0; i < input.length; i++){
          console.log( input[i] );
          _executeFunctionByName("scrollimate."+input[i]+"");
        }

      // Otherwise, loops through each argument given as an object (new way)
      // Key should be the function name, input[key] the arguments to the function
      }else{
        console.log( 'Init Method calling the following Methods: ' );
        for (var key in input){

          var current = window['scrollimate'][key];
          console.log( key );

          // if the function exists
          // check if parameter given is in the form of an array
          // if it is, proceed with apply
          // else, use call
          if (typeof current === "function"){
            var isArr = Object.prototype.toString.call(input[key]) == '[object Array]';
            if( isArr ){
              current.apply(null, input[key]);
            }else{
              current.call(null, input[key]);
            }
          }
        }

      } //end else/calledWithArr

      $(window).resize(function(){
        _global.saWinHi = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;

        if( _global.prlx ){
          _saParallaxAnimation(_global.saBgLay);
        }
      }); // end window resize

      $(window).scroll( function(){
        _global.wp = $(window).scrollTop();

        if( _global.prlx ){
          _saParallaxAnimation(_global.saBgLay);
        }
      }); // end window scroll

    }); // end document ready

  };


  /*
   * Public Methods
   */
  return{
    enableMobile: enableMobile,
    init: init,
    inview: inview,
    nonIDTabs: nonIDTabs,
    saAccordion: saAccordion,
    saParallax: saParallax,
    saRipple: saRipple,
    saScroll: saScroll,
    saScrollClass: saScrollClass,
    saTabs: saTabs,
    saUnderline: saUnderline,
    springyElement: springyElement,
  };
})(jQuery);
