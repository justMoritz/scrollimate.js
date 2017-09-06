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
    saItHgt: [],
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
   *   
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
   *    Loops through each of the saBgLayers elements. (from saParallax function),
   *    parses and splits the data-attribute arguments. First is speed, second is position.
   *
   *    If only more than argument is given set posFlag to 1, which will cause the
   *    element to only start parallaxing once in view, and be offset by the number specified.
   *    elHeight gets passed into the __saParallaxHelperFunction.
   *    If second argument is not given, element starts parallaxing from the moment page loads.
   *
   */
  var _saParallaxAnimation = function($saBgLayers){
    for (i = 0 ; i < $saBgLayers.length ; i++){
      var posFlag = 0;
      var topoffset = $($saBgLayers[i]).offset().top; 
      var elHeight  = $($saBgLayers[i]).css('height');
      elHeight = parseInt(elHeight, 10);

      var dataBgAttributes = $($saBgLayers[i]).attr('data-sabglayer').split(', ');

      if( dataBgAttributes.length > 1 ){
        posFlag = 1;
        elHeight = elHeight*dataBgAttributes[1];
      }

      if( topoffset < _global.wp+_global.saWinHi){
        // offsets the scrolling in a paralax sort of way.
        // we are taking the initial height, adding it and then moving it accordingly in the opposite direction of the scroll.

        // if we have a number in the data-sabglayer, use as speed, if not, default to standard
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

        // keep the translateX attribute currently present
        if ($($saBgLayers[i]).css("transform") === "translateX(-50%)"){
          parallaxHelperConfig.left = '-50%';
          __saParallaxHelperFunction( parallaxHelperConfig );
        }
        else{
          __saParallaxHelperFunction( parallaxHelperConfig );
        }
      }
    }
  };

  var saParallax = function () {     
    // gets all elelemts with the data-sabglayer attribute
    _global.saBgLay = $("[data-sabglayer]");  
    _global.saBgLay.css('will-change', 'transform');


    // Only run functionality if there are not no elements
    if( _global.saBgLay.length !== 0 ){

      // variable to hold the initial position from the top of each element.
      _global.saItHgt = [];  

      // gets the initial position from the top of each element
      // (needed for absolutely positioned elements)
      for (i = 0 ; i < _global.saBgLay.length ; i++){
          _global.saItHgt[i] = $(_global.saBgLay[i]).offset().top;
      }

      // makes sure evertyhing is drawn the first initial time.
      _saParallaxAnimation(_global.saBgLay);

      // makes sure the boxes are drawn accodringly if the window is resized
      $(window).resize(function(){
          _saParallaxAnimation(_global.saBgLay); 
      });
      
      console.log('parallax initiated');
      _global.prlx = true;
    }
  };


  /* * Smooth Anchor Scroll Functionality * */
  var saScroll = function() {
    console.log('saScroll initiated');
      // on hash fragment url click
      $('[href^="#"]').click(function(){
        // adds a little bit of time to the scrolling based on how far the target is from the top 
        // ensures that the scroll motion is about the same percieved velocity 
        var smoothAnchorScrollTime = 500 + (Math.floor($($(this).attr("href")).offset().top))/2;
        // animate the page
        $('html, body').animate({
            //to scroll from the top to the href attribute 
            scrollTop: $( $(this).attr('href') ).offset().top
            // plan to make this time dynamic by calculating the offset from the top and then doing some math
        }, smoothAnchorScrollTime);
        // prevent default
        return false;
      });  
  };


  /* * Tabs Functionality * */
  var saTabs = function () {

    // checks the current location, matches it to the href-containing link, and adds correct class to parent
    var __activeClassHelperFunction = function($inputLoc){
      for (i=0; i<$tabscrollAnchors.length; i++){
        if( $($tabscrollAnchors[i]).attr('href') === "#"+$inputLoc ){
          $('.tabscroll_activeNavi').removeClass('tabscroll_activeNavi');
          $($tabscrollAnchors[i]).parent().addClass('tabscroll_activeNavi');
        }
      }
    };

    function hashChangeFunct () {
      // writing the URL that raised the event into a string
      var $location = String(document.location);

      // stripping off everything before the hash
      $location = $location = $location.split("#")[1];

      // if there is no hash, basically...
      if ($location === undefined || $location === 'all' ){
          // show only the first section
          $("[data-tabscroll]:first-of-type").show();   
          $("[data-tabscroll]:first-of-type").addClass('activeTab');   
      }
      // if there is a hash-link active
      else{
        //hide all tabs
        $("[data-tabscroll]").hide().removeClass('activeTab');   


        // fade in only the tab with the data-tabscroll attribute corresponding
        // to the link that was clicked.
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
    }

    function setUpPage() {
      // finds all anchor tabs within the data-tabscrollnavcontainer
      $tabscrollAnchors = $("[data-tabscrollnavcontainer]").find("a").not("[data-saexclude]");

      // if we pass a type in here, we can control the method of change. Right now we can do fade, slide and none.
      $transition_type = $("[data-tabscrollnavcontainer]").attr("data-tabscrollnavcontainer");
      
      // adds the active class to the first tab-navigation
      $($tabscrollAnchors[0]).parent().addClass("tabscroll_activeNavi");

      for ($i = 0; $i < $tabscrollAnchors.length; $i++){

        // targets each and every link's href-attribute found within the tabscrollnavcontainer
        var $eachAnchor = $($tabscrollAnchors[$i]).attr("href");
    
        // adds the navigational data-attribute to each anchor tag's parent
        $($tabscrollAnchors[$i]).parent().attr("data-tabscrollnavi", $eachAnchor.substring(1)); 
        
        // we then use this anchor to find each element, section, etc. that has the 
        // same ID as the anchor tag we found.
        
        // sets a custom data-tabscroll attribute to each section that correspons
        // with the link in the navigation, stripping off the # (substring)
        $($eachAnchor).attr("data-tabscroll", $eachAnchor.substring(1));
      }    
    }
     
    setUpPage();
 
    // remove each id tag of an data-tabscroll element
    $("[data-tabscroll]").removeAttr('id');
     
    // hiding all sections initially except the one specified.
    $("[data-tabscroll]:first-of-type").siblings("[data-tabscroll]").hide();   
    
    /*
     * stores the previous hash, then listens if it has changed every frew millisectons
     * Needed for IE9. Adapted from https://stackoverflow.com/questions/680785/on-window-location-hash-change    
     */
    var prevHash = window.location.hash;
    window.setInterval(function () {
      if (window.location.hash !== prevHash) {
        prevHash = window.location.hash;
        hashChangeFunct();
      }
    }, 100);
    
    // initial Hash Change Setup
    $(window).load(function(){
       hashChangeFunct();
    });

    /* // not currently used, left for reference
    $(window).on('hashchange', function (event) {  
      // triggers the hashchange manually on pageload. 
      // Adapted from http://stackoverflow.com/questions/20652020/the-hashchange-event-of-jquery-doesnt-work-if-i-open-a-page-with-hash-directly
    }).trigger('hashchange'); */

    console.log('saTabs initiated');
  }; // End saTabs
 

  /* * function adds class class to target element while and ONLY WHILE scrollingElement is scrolled * */ 
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


  /* * Accordion Functionaliy * */
  var saAccordion = function(element, mainwidthinpercent, type, imageaspectratio){
    var __accordionHelper = function(){
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
    __accordionHelper();

    window.addEventListener('resize', function () {
      __accordionHelper();
    });
  };


  /* * Init Function * */
  var init = function(input){
    console.log('Running Scrollimate with the following input: ' + input );

    // Document Ready 
    $(function(){

      // height of viewport (window Height)
      _global.saWinHi = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight; 
      // updates in case of window resize
      $(window).resize(function(){
        _global.saWinHi = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight; 
      });

      for(i=0; i < input.length; i++){
        console.log( input[i] );
        _executeFunctionByName("scrollimate."+input[i]+"");
      }

      // Code that initiates the window scroll listener, and all code (parallax or otherwise) that goes with it.
      // when the window is scrolled
      $(window).scroll( function(){
        // updates the window position variable
        _global.wp = $(window).scrollTop();

        /* * Mobile checking moved inside the __saParallaxHelperFunction function (the final stage of the parallax animatino chain)* */
        if( _global.prlx ){
          _saParallaxAnimation(_global.saBgLay); 
        }
      });
    });
  };




  /* 
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