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
	var _outputDiv = document.getElementById("output");
	_outputDiv.insertAdjacentHTML('afterend', template);

	// Get the template source
	var src = document.getElementById("entry-template").innerHTML.trim();
	var _template = document.getElementById("entry-template");
	var _handler;
	

	/* Check if handlebars script file is loaded or not */
	var init = function () {
		setTimeout(compileTemplate, 100);
	}
	init();

	function compileTemplate() {
		timeout--;
		if(typeof(window.io) != 'undefined'){
			_outputDiv.innerHTML = src; // just for first time
			_handler = document.getElementById('socialProofPopup');
			initlizePopup();
		} else if (timeout > 0) {
			init();
		} else {
			console.error('Failed to load ioscript, check your network connection');
		}	
		
	}

	function initlizePopup() {
		var socket = io.connect('http://localhost:5000');
		
		setTimeout(function () {
			socket.emit('login')
		},1000)
		socket.on('show popup', function (data) {
			console.log(data);
			showPopup(data);
		});
	}

	function showPopup(context) {
		var html = render(src, null, context);
		_outputDiv.innerHTML = html;
		hidePopByCloseButton();
		setTimeout(function () {document.getElementById('socialProofPopup').className = "lftInfoPopup active"; },1000);
	}

	function hidePopByCloseButton() {
		document.getElementById('closeButton').addEventListener('click', function () {hidePop(); });
	}
	function hidePop() {
		document.getElementById('socialProofPopup').className = "lftInfoPopup";
	}
	function render(str, options, context) {
	    str = (str || '').toString();
	    context = context || {};
	    options = options || {};

	    var re = /\{\{[ ]*([^{}\s]+)[ ]*\}\}/g;

	    return str.replace(re, function (match, key) {
	        var value;
	        if (context.hasOwnProperty(key)) {
	            value = context[key].toString();
	            if (options.escapeHtml) {
	                value = value.replace(/["'&<>]/g, function (char) {
	                    switch (char) {
	                        case '&':
	                            return '&amp;';
	                        case '<':
	                            return '&lt;';
	                        case '>':
	                            return '&gt;';
	                        case '"':
	                            return '&quot;';
	                        case '\'':
	                            return '&#039;';
	                        default:
	                            return char;
	                    }
	                });
	            }
	            return value;
	        }
	        return match;
	    });
	}
}());
