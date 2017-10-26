(function(){
	var timeout = 100; // 10 seconds timeout
    
    //console.log(window.proof_config);
    //
    /* Create Handlebar template markups */
    
    var template = [
    	'<script id="entry-template" type="text/x-handlebars-template">',
	  		'<div id="socialProofPopup" class="lftInfoPopup">',
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
	    				        '<i><img src="{{verified}}" alt="verified"></i> ',
	    				        '<span>by</span> ',
	    				        '<a target="_blank" href="">SPT</a>',
	    				    '</div>',
	    				'</div>',
	    			'</div>',
	    			'<div class="close-button">',
	            		'<a href="javascript:void(0)" id="closeButton" class="clseBtnLftP">',
	            			'<img alt="close" src="{{closeIcon}}">',
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
		setTimeout(compileTemplate, 100);
	}
	_Handlebars();

	function compileTemplate() {
		timeout--;
		if(typeof(window.Handlebars) != 'undefined'){
			var template = Handlebars.compile(src);
			var context = {
				customer_name: "David Robien", 
				closeIcon: "http://localhost:9000/assets/images/closeIcn.png",
				image: "http://localhost:9000/assets/images/user_dp_bigl.png",
				verified: "http://localhost:9000/assets/images/verifiedIcn.png"
			};
			var html    = template(context);
			document.getElementById("output").innerHTML += html;
			var x = document.getElementById("output");
			
			// show popup
			showPop();

			// hide popup
			hidePop(); hidePopByCloseButton();
		} else if (timeout > 0) {
			_Handlebars();
		} else {
			console.error('Failed to load script, check your network connection');
		}
	}

	function showPop() {
		setTimeout(function () {
			document.getElementById('socialProofPopup').className = "lftInfoPopup active";
			/*setTimeout(function () {
				hidePop();
				showPop();
			},2500);*/
		},1000);
	}

	function hidePopByCloseButton() {
		document.getElementById('closeButton').addEventListener('click', function () {
			document.getElementById('socialProofPopup').className = "lftInfoPopup";
		});	
	}
	function hidePop() {
		document.getElementById('socialProofPopup').className = "lftInfoPopup";
	}
}());
