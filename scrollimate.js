/*
 * adapted from github.com/justMoritz
 */
var scrollimate = (function( window, $ ){

  var _domEl = {

  },
  _global = {
    wp:   0,
    prlx: 0,
    speed: 1,
    saBgLay: [],
    saItHgt: [],
    saWinHi: '',
  };



  /* * General Functionality * */
  var _executeFunctionByName = function (functionName) {
    var context = window;
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(context);
  };



  /* * Parallax Functionality * */
  var __parallaxHelperFunction = function( saBg, tOfSet, winHi, spd, elHeight, left, flag ){
    if(flag === 0){
      tOfSet = 0;
      winHi = 0;
      elHeight = 0;
    }
    $(saBg).css("transform", "translate3d("+left+", "+Math.floor((((_global.wp-tOfSet+winHi)/2)*spd)+elHeight)+"px, 0px)");       
    $(saBg).css("-ms-transform", "translate("+left+", "+Math.floor((((_global.wp-tOfSet+winHi)/2)*spd)+elHeight)+"px)"); 
  };

  var _parallaxAnimation = function($saBgLayers){
    // loops through each element that is in the scrollimateBgLayers array
    for (i = 0 ; i < $saBgLayers.length ; i++){

      var posFlag = 0;
      var topoffset = $($saBgLayers[i]).offset().top; 
      var elHeight  = $($saBgLayers[i]).css('height');
      elHeight = parseInt(elHeight, 10);
      // elHeight = elHeight*0.125;

      // parses the data-attribute to read the arguments. First one is speed, second is position
      var dataBgAttributes = $($saBgLayers[i]).attr('data-sabglayer').split(', ');

      // if only more than argument is given set posFlag to 1,
      //  which will cause the element to only start parallaxing once in view, and will be offset by the number specified
      if( dataBgAttributes.length > 1 ){
        posFlag = 1;
        elHeight = elHeight*dataBgAttributes[1];
      }
      // if the second argument is not given, the element will  start parallaxing from the very moment the page loads

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

        // keep the translateX attribute currently present
        if ($($saBgLayers[i]).css("transform") === "translateX(-50%)"){
            __parallaxHelperFunction( $saBgLayers[i], topoffset, _global.saWinHi, $speed, elHeight, '-50%', posFlag);
        }
        else{
            __parallaxHelperFunction( $saBgLayers[i], topoffset, _global.saWinHi, $speed, elHeight, '0px', posFlag);
        }
          // }
      }
    }
  };

  var saParallax = function () {     
    // gets all elelemts with the data-sabglayer attribute
    _global.saBgLay = $("[data-sabglayer]");  

    // Only run functionality if there are no elements
    if( _global.saBgLay.length !== 0 ){

      // variable to hold the initial position from the top of each element.
      _global.saItHgt = [];  

      // gets the initial position from the top of each element
      // (needed for absolutely positioned elements)
      for (i = 0 ; i < _global.saBgLay.length ; i++){
          _global.saItHgt[i] = $(_global.saBgLay[i]).offset().top;
      }

      // makes sure evertyhing is drawn the first initial time.
      _parallaxAnimation(_global.saBgLay);

      // makes sure the boxes are drawn accodringly if the window is resized
      $(window).resize(function(){
          _parallaxAnimation(_global.saBgLay); 
      });
      
      console.log('parallax initiated');
      _global.prlx = 1;
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
      for (i=0; i<$tabscroll_anchors.length; i++){
        if( $($tabscroll_anchors[i]).attr('href') === "#"+$inputLoc ){
          $('.tabscroll_activeNavi').removeClass('tabscroll_activeNavi');
          $($tabscroll_anchors[i]).parent().addClass('tabscroll_activeNavi');
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
      }
      // if there is a hash-link active
      else{
        //hide all tabs
        $("[data-tabscroll]").hide();

        // fade in only the tab with the data-tabscroll attribute corresponding
        // to the link that was clicked.
        if ( $transition_type === 'fade') {
          $("[data-tabscroll='"+$location+"']").fadeIn();
          __activeClassHelperFunction($location);

        } 
        else if ( $transition_type === 'slide') {
          $("[data-tabscroll='"+$location+"']").slideDown();
          __activeClassHelperFunction($location);
        }
        else{
          $("[data-tabscroll='"+$location+"']").show();
          __activeClassHelperFunction($location);
        }
      }             
    }

    function setUpPage() {
      // finds all anchor tabs within the data-tabscrollnavcontainer
      $tabscroll_anchors = $("[data-tabscrollnavcontainer]").find("a");

      // if we pass a type in here, we can control the method of change. Right now we can do fade, slide and none.
      $transition_type = $("[data-tabscrollnavcontainer]").attr("data-tabscrollnavcontainer");
      
      // adds the active class to the first tab-navigation
      $($tabscroll_anchors[0]).parent().addClass("tabscroll_activeNavi");

      for ($i = 0; $i < $tabscroll_anchors.length; $i++){

        // targets each and every link's href-attribute found within the tabscrollnavcontainer
        var $eachAnchor = $($tabscroll_anchors[$i]).attr("href");
    
        // adds the navigational data-attribute to each anchor tag's parent
        $($tabscroll_anchors[$i]).parent().attr("data-tabscrollnavi", $eachAnchor.substring(1)); 
        
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
  var saAccordion = function(element, mainwidthinpercent){
    console.log(mainwidthinpercent);
    if (mainwidthinpercent === undefined){
      mainwidthinpercent = '50';
    }
    // number of elements
    var numEl = $(element).length;
    var restwidth = (100-mainwidthinpercent)/(numEl-1);

    $(element).css('width', restwidth+'%').removeClass('active');
    $(element+':first-of-type').css('width', mainwidthinpercent+'%').addClass('active');     
    $(element).click(function(){
      $(element).css('width', restwidth+'%').removeClass('active');
      $(this).css('width', mainwidthinpercent+'%').addClass('active');                   
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

      
      // when the window is scrolled
      $(window).scroll( function(){
        // updates the window position variable
        _global.wp = $(window).scrollTop();

        // runs the parallax animation function, 
        // ONLY if the global prlx indicates the parallax function has been initiated
        if(_global.prlx === 1){
          _parallaxAnimation(_global.saBgLay);
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
    init: init,
  };
})(window, jQuery);



