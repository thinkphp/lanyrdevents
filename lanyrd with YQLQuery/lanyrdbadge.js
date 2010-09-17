var lanyrdbadge = function(){
    var l;
    function init(){

         //get element with ID 'lanyrd'
         l = document.getElementById('lanyrd');

         if(l && l.nodeName.toLowerCase() == 'a') {

              l.innerHTML += '<span> (Loading&hellip) </span>';  
              var user = l.getAttribute('href');

              var endpoint = "http://query.yahooapis.com/v1/public/yql?q=";

              var yql = 'select * from html where url="'+user+'" and xpath="//h2[contains(.,\'Future\')]/.."';  

              new YQLQuery(yql,lanyrdbadge.seed).fetch();

          }//end if

    }//end function init


    function seed(o) {
             if(window.console) {console.log(o);}
             var res = o.results[0];
             res = res.replace(/class="split"/,'id="lanyrd"');  
             res = res.replace(/speaking at/,'');
             res = res.replace(/href="/gi,'href="http://lanyrd.com');
             res = res.replace(/src="/gi,'src="http://lanyrd.com');
             var newDiv = document.createElement('div');
                 newDiv.innerHTML = res;
             l.parentNode.appendChild(newDiv);
             l.parentNode.removeChild(l); 
    } 

    return {init: init, seed: seed};
}();
lanyrdbadge.init();


//let's build following constructor for YQL
function YQLQuery(query,callback,format) {
       this.query = query;
       this.callback = callback || function(){};
       this.format = format || 'xml';
       this.fetch = function() {
           if(!this.query || !this.callback) {
                    throw new Error("YQLQuery.fetch(): Parameters may be undefined!"); 
           } 

           var scriptEl = document.createElement('script'),
               uid = 'yql'+ +new Date(),
               encodedQuery = encodeURIComponent(this.query),
               instance = this;

            YQLQuery[uid] = function(json) {
               instance.callback(json);
               delete YQLQuery[uid];
               document.body.removeChild(scriptEl);  
            };

            scriptEl.src = 'http://query.yahooapis.com/v1/public/yql?q='+
                            encodedQuery + '&format='+this.format+'&callback=YQLQuery.' + uid+
                           '&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
            if(window.console){console.log(decodeURIComponent(encodedQuery));}
            document.body.appendChild(scriptEl);         
     };          
};

