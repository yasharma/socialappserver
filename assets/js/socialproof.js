(function(){
	var timeout = 100; // 10 seconds timeout
    
    //console.log(window.proof_config);
    //
    /* Create Handlebar template markups */
    
    var template = [
    	'<script id="entry-template" type="text/x-handlebars-template">',
	  		'<div class="lftInfoPopup active">',
	  			'<div class="bubble">',
	  				'<div class="bubbleImg">',
	            		'<img alt="{{customer_name}}" src="{{image}}">',
	        		'</div>',
		    		'<div class="bubbleCntnt">',
	    				'<div class="bubblewho">{{customer_name}}</div>',
	    				'<div class="bubblewhat">Recently started a free trial</div>',
	    				'<div class="bubblewhen">',
	    				    '<time><span>1 day ago</span></time>',
	    				    '<div class="bubblePoweredBy">',
	    				        '<span class="srOnly">Verified</span> ',
	    				        '<i><img src="images/verifiedIcn.png" ></i> ',
	    				        '<span>by</span> ',
	    				        '<a target="_blank" href="">SPT</a>',
	    				    '</div>',
	    				'</div>',
	    			'</div>',
	    			'<div class="close-button">',
	            		'<a href="javascript:void(0)" class="clseBtnLftP">',
	            			'<img src="images/closeIcn.png">',
	            		'</a>',
	        		'</div>',
	    		'</div>',	
  			'</div>',
		'</script>'
	].join('');

	// Insert template to document body
	document.getElementById("output").innerHTML +=  template;

	// Get the template source
	var src = document.getElementById("entry-template").innerHTML.trim();

	/* Check if handlebars script file is loaded or not */
	var _Handlebars = function () {
		setTimeout(function () {
			timeout--;
			if(typeof(window.Handlebars) != 'undefined'){
				var template = Handlebars.compile(src);
				var context = {customer_name: "David Robien", body: "This is my first post!"};
				var html    = template(context);
				document.getElementById("output").innerHTML += html;
				var x = document.getElementById("output");
				
			} else if (timeout > 0) {
				_Handlebars();
			} else {
				console.error('Failed to load script, check your network connection');
			}
		}, 100);
	}
	_Handlebars();
	
	
}());
