/*
 * Lanyrd is a cool new web site to organise the events you go 
 * to and speak at. This script is a badge to show off your upcoming events
 * on your own web site. In YQL you can get any HTML of a page and scrape it.
 * You then can get it back as XML and if you provide a callback method name
 * it return it as JSON-P which is HTML as a string inside a JSON callback.
 * The first thing you need to do is to find the HTML you want. What I want is
 * the DIV that contains the H2 Element with the word 'Future' in it.
 * Incredible,flexible and elegant XPath syntax is //H2[contais(.,'Future')]/..]
 * or "get all the H2 Elements where the text node contains the word 'Future' and
 * then go up one level in the DOM hierarchy".
 */
var lanyrdbadge = function(){
    var speak,
        spoken;
    function init(){

         //get element with ID 'lanyrd'
         speak = document.getElementById('speaking'), 
         spoken = document.getElementById('spoken');

         //if speak exists and the nodename is a A Element then make two request 
         //to retrieve the data from lanyrd.com
         if(speak && speak.nodeName.toLowerCase() == 'a') {
              speak.innerHTML += '<span> (Loading&hellip)</span>';  
              spoken.innerHTML += '<span> (Loading&hellip)</span>';  
              var user = speak.getAttribute('href');
              var endpoint = "http://query.yahooapis.com/v1/public/yql?q=";
              var yql1 = 'select * from html where url="'+user+'" and xpath="//h2[contains(.,\'Future\')]/.."';  
              var yql2 = 'select * from html where url="'+user+'" and xpath="//h2[contains(.,\'Past\')]/.."';  
              new YQLQuery(yql1,function(o){
                                   lanyrdbadge.seed(o);
                                   new YQLQuery(yql2,lanyrdbadge.seed2).fetch();
              }).fetch();
         }
    }

    function seed(o) {
            if(window.console) {console.log(o);}
             var res = o.results[0];
             res = res.replace(/class="split"/,'id="speaking"');  
             res = res.replace(/speaking at/,'');
             res = res.replace(/href="/gi,'href="http://lanyrd.com');
             res = res.replace(/src="/gi,'src="http://lanyrd.com');
             var newDiv = document.createElement('div');
                 newDiv.innerHTML = res;
             speak.parentNode.appendChild(newDiv);
             speak.parentNode.removeChild(speak);
    } 
    function seed2(o) {

            if(window.console) {console.log(o);}
             var res = o.results[0];
             res = res.replace(/class="split first"/,'id="spoken"');  
             res = res.replace(/spoken at/,'');
             res = res.replace(/href="/gi,'href="http://lanyrd.com');
             res = res.replace(/src="/gi,'src="http://lanyrd.com');
             var newDiv = document.createElement('div');
                 newDiv.innerHTML = res;
             spoken.parentNode.appendChild(newDiv);
             spoken.parentNode.removeChild(spoken);
    } 

   return {init: init, seed: seed,seed2: seed2};
}();
lanyrdbadge.init();