/* moritzzimmer.com
 *
 * written by Moritz Zimmer, 2016 – 2017
 * http://www.moritzzimmer.com
 *
 * (c) 2017 CC Attribution 4.0
 * https://creativecommons.org/licenses/by/4.0/legalcode
 *
 */
var scrollimate = (function( window, $ ){

  var _global = {
    wp:   0,
    prlx: false,
    speed: 1,
    saBgLay: [],
    saWinHi: '',
    mobileEnabled: false,
    isMObile: false,
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
        _global.saBgLay.css('-ms-transform', 'translate(0, 0)');
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
    for (i = 0 ; i < $saBgLayers.length ; i++){
      var posFlag = 0,
          $saCurEl = $($saBgLayers[i]);
          topoffset  = $saCurEl.offset().top,
          elHeight   = $saCurEl.css('height');

      elHeight = parseInt(elHeight, 10);
      something = parseInt(elHeight, 10);

      var dataBgAttributes = $saCurEl.attr('data-sabglayer').split(', ');

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

      if ( $($saBgLayers[i]).attr("data-sabglayer") === "" )  {
        $speed = 1;
      }
      else{
        $speed = dataBgAttributes[0]; 
      }
      parallaxHelperConfig = {
        saBg: $saBgLayers[i],
        tOfSet:  topoffset,
        winHi: _global.saWinHi,
        spd: $speed,
        elHeight: elHeight,
        left: '0px' ,
        flag: posFlag
      };

      // The code is run when it is within view, but offset by the elHeight.
      if( topoffset+elHeight < _global.wp+_global.saWinHi){

        if ($saCurEl.css("transform") === "translateX(-50%)"){
          parallaxHelperConfig.left = '-50%';
          __saParallaxHelperFunction( parallaxHelperConfig );
        }
        else{
          __saParallaxHelperFunction( parallaxHelperConfig );
        }
      }
      // run only the first time (on elements that are not static elements) 
      // to make sure original position is approximating correct. 
      // Hacky, and doesn't work 100%. Will re-write the logic sometime. 
      // If you are not me and you are reading this, do a pull request :)
      else {
        var m=0;
        if(m === 0){
          window.scrollBy(0,1);
          parallaxHelperConfig.tOfSet = $saCurEl.offset().top;
          window.scrollBy(0,-1);
          __saParallaxHelperFunction( parallaxHelperConfig );
          m++;
        }
      }
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
   */
  var saScroll = function() {
    console.log('saScroll initiated');
      $('[href^="#"]').click(function(){
        var smoothAnchorScrollTime = 500 + (Math.floor($($(this).attr("href")).offset().top))/2;
        $('html, body').animate({
            scrollTop: $( $(this).attr('href') ).offset().top
        }, smoothAnchorScrollTime);
        return false;
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
    $tabscrollAnchors = $("[data-tabscrollnavcontainer]").find("a").not("[data-saexclude]");
    $transition_type = $("[data-tabscrollnavcontainer]").attr("data-tabscrollnavcontainer");
    $($tabscrollAnchors[0]).parent().addClass("tabscroll_activeNavi");

    for ($i = 0; $i < $tabscrollAnchors.length; $i++){
      var $eachAnchor = $($tabscrollAnchors[$i]).attr("href");
      $($tabscrollAnchors[$i]).parent().attr("data-tabscrollnavi", $eachAnchor.substring(1)); 
      $($eachAnchor).attr("data-tabscroll", $eachAnchor.substring(1));
    }    
    
    $("[data-tabscroll]").removeAttr('id');
    $("[data-tabscroll]:first-of-type").siblings("[data-tabscroll]").hide();   
  };

  /**
   *
   * 3: _saTabsHashChangeFunct: 
   *    Called both initially in saTabs and also on each Hash (URL fragment) change, monitured
   *    by the saTabs Method.
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
  var _saTabsHashChangeFunct = function() {
    /* checks the current location, matches it to the href-containing link, and adds correct class to parent */
    var __activeClassHelperFunction = function($inputLoc){
      for (i=0; i<$tabscrollAnchors.length; i++){
        if( $($tabscrollAnchors[i]).attr('href') === "#"+$inputLoc ){
          $('.tabscroll_activeNavi').removeClass('tabscroll_activeNavi');
          $($tabscrollAnchors[i]).parent().addClass('tabscroll_activeNavi');
        }
      }
    };

    var $location = String(document.location);    
    $location = $location = $location.split("#")[1];

    if ($location === undefined || $location === 'all' ){
        $("[data-tabscroll]:first-of-type").show();   
        $("[data-tabscroll]:first-of-type").addClass('activeTab');   
    }
    else{
      $("[data-tabscroll]").hide().removeClass('activeTab');   

      if ( $transition_type === 'fade') {
        $("[data-tabscroll='"+$location+"']").fadeIn().addClass('activeTab');   
        __activeClassHelperFunction($location);

      } 
      else if ( $transition_type === 'slide') {
        $("[data-tabscroll='"+$location+"']").slideDown().addClass('activeTab');   
        __activeClassHelperFunction($location);
      }
      else{
        $("[data-tabscroll='"+$location+"']").show().addClass('activeTab');   
        __activeClassHelperFunction($location);
      }
    }             
  };

  /**
   *
   * 1: saTabs: 
   *    Runs the _saTabsSetUpPage function, the initial instance of the _saTabsHashChangeFunct,
   *    then also monitors the hash change to run the _saTabsHashChangeFunct as needed.
   *
   *    Hash changed is implemented as follows:
   *    Stores the previous hash, then listens if it has changed every frew millisectons
   *    Needed for IE9. Adapted from https://stackoverflow.com/questions/680785/on-window-location-hash-change
   *
   *    (In previous versions, this had been triggered by $(window).on('hashchange', function (event) { )
   */
  var saTabs = function () {
    _saTabsSetUpPage();
    
    var prevHash = window.location.hash;
    window.setInterval(function () {
      if (window.location.hash !== prevHash) {
        prevHash = window.location.hash;
        _saTabsHashChangeFunct();
      }
    }, 100);
    
    $(window).load(function(){
       _saTabsHashChangeFunct();
    });

    console.log('saTabs initiated');
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
        $(element+':first-of-type').css('width', mainwidthinpercent+'%').addClass('active');   
      } 
      // mobile functionality
      else{
        $element.css('width', '100%');
        $element.css('height', 0).css('padding-bottom', restwidth+'%').removeClass('active');
        $(element+':first-of-type').css('height', 0).css('padding-bottom', mainwidthinpercent+'%').addClass('active');   
      }

      // if no type is given, default to click
      if (type === undefined){ type = 'click'; }
      $element.on(type, function(){
        // desktop functionality
        if ( $(window).width() > 767) {   
          console.log(restwidth);
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
   * Init Function 
   * 
   * On Document Ready, calculates the height of viewport (window Height)
   *
   * Parses the arguments-array given to the init method's call, loops through
   * them and then executes the function with the corresponding name. 
   * No error-checking is currently enabled, but this may be a future feature addition 
   *
   * On Window Resize, re-calculate the window height, and re-run parallax, if is enabled
   * On window scroll, update the window position variable (_global.wp), and re-run parallax, if enabled
   *
   */
  var init = function(input){
    console.log('Running Scrollimate with the following input: ' + input );

    $(function(){
      _global.saWinHi = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight; 

      for(i=0; i < input.length; i++){
        console.log( input[i] );
        _executeFunctionByName("scrollimate."+input[i]+"");
      }

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


  /** 
   * Public Methods
   */
  return{
    saParallax: saParallax,
    saScroll: saScroll,
    saTabs: saTabs,
    saScrollClass: saScrollClass,
    saAccordion: saAccordion,
    init: init,
    enableMobile: enableMobile,
  };
})(window, jQuery);