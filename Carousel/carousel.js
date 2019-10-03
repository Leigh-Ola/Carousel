var Carousel = (function(){

	function addImage(url, settings, index){
		var el = this.container;
		var imageBox = document.createElement("div")
		imageBox.classList.add("imageBox");
		imageBox.style.backgroundImage = ("url("+url+")");
		imageBox.style.backgroundSize = (settings.stretch)? "cover" : "contain";
		imageBox.style.padding = settings.padding;
		if(!this.settings.scrollable){
			el.classList.add("noScroll");
		} 
		var kids = el.children;
		var newHTML = "";
		var added = false;
		for(var i=0; i<kids.length; i++){
			if(i==index){
				added = true;
				newHTML+=(imageBox.outerHTML);
			}
			newHTML+=(kids[i].outerHTML);
		}
		if(!added){
			newHTML+=(imageBox.outerHTML);
		}
		el.innerHTML = newHTML;
		if(!isNaN(index) && index <= this.current){
			el.scrollLeft += el.children[0].clientWidth;
		}
		
		this.images++;
	}// handles the addition of an image
	
	function removeImage(index){
		var el = this.container;
		var kids = el.children;
		var index = (isNaN(index))? kids.length-1 : index ;
		var newHTML = "";
		var removed = false;
		for(var i=0; i<kids.length; i++){
			if(i==index){
				removed = true;
				continue;
			}
			newHTML+=(kids[i].outerHTML);
		}
		el.innerHTML = newHTML;
		if(index <= this.current && el.children.length){
			el.scrollLeft -= el.children[0].clientWidth;
		}
		this.images--;
	}// handles the removal of an image
	
	var nextTickArr = [];
	function executeNextTick(){
		for(var i in nextTickArr){
			if(typeof nextTickArr[i] != "function"){ continue; }
			nextTickArr[i].call(this, nextTickArr[i]);
		}
		nextTickArr = [];
	}//For executing callbacks when scroll animation ends.
	
	function addEventListeners(el){
		var el = this.container;
		var start = [], end = [];
		var changing = false;
		var self = this, detecting;
		function stopped(){
			var scrWid = el.scrollWidth, innWid = el.clientWidth, scrLeft = el.scrollLeft, len = Math.floor(scrWid/innWid);
			var isLeft = (el.children[self.current].offsetLeft > scrLeft);
			for(var i=0; i<len; i++){
				var childOffsetLeft = el.children[i].offsetLeft;
				if(!isLeft && (scrLeft <= childOffsetLeft)){
					moveToImage.call(self, i, [self.settings.eventListeners.manualScroll]);
					break;
				}else if(isLeft && (scrLeft < (childOffsetLeft + innWid))){
					moveToImage.call(self, i, [self.settings.eventListeners.manualScroll]);
					break;
				}
			}
		};
		function scroll(e){
			if(self.changing){ return; }
			if(detecting){
				clearTimeout(detecting);
			}
			detecting = setTimeout(stopped, 100);
		}
 		el.addEventListener("scroll", scroll )
	}
	
	function moveToImage(newCurr, callback){
		var self = this;
		if(newCurr == self.current){
			return;
		}
		
		var el = self.container;
		var i = el.children[newCurr].offsetLeft;
		self.changing = true;
		var remaining = (el.scrollLeft > i)? el.scrollLeft-i : i-el.scrollLeft ;
		var min = Math.floor(remaining/30);
		var diff = (diff<10)? 7 : min;
		var callbacks = (function(c, s){
			for(var i in c){
				c[i].call(s);
			}
		})(callback, self)
		function moveOffset(){
			var scrLeft = el.scrollLeft;
			diff = (remaining < 10)? 1 : diff;
			var change = (scrLeft > i)? -diff : diff ;
			el.scrollLeft = scrLeft+change;
			remaining-=diff;
			if(remaining > 0){
			   setTimeout(function(){
					moveOffset();
				},1)
			}else{
				setTimeout(function(){
					self.changing = false;
					self.current = newCurr;
					executeNextTick.call(self);
					if(typeof callbacks == "object"){ callbacks(); }
				 },1);
				}
		}
		moveOffset();
	}//handles changing of slides
	
	function seek(index, callback){
		var carousel = this;
		var callback = (typeof callback=="function")? callback : function(){} ;
		var callbacks = [callback,carousel.settings.eventListeners.autoScroll]
		var loop = (this.settings.loop);
		var index = (index >= this.images)? ((loop)? 0 : this.images-1) : index ;
		var index = (index < 0)? ((loop)? (this.images+index) : 0) : index ;
		moveToImage.call(this, index, callbacks);
	}//handles seeking slides
	
	function scroll(){
		var time = this.settings.scroll;
		var self = this;
		function timed(){
			setTimeout(function(){
				if((!self.settings.loop) && (self.current == self.images -1)){
					return;
				}
				seek.call(self, self.current+1, timed);
			},time);
		}
		timed();
	}//handles scrolling at intervals
	

	function fixSettings(s){
		var newS = {};
		newS.el = ((String(s.el.constructor).indexOf("rray") > -1)? s.el[0] : s.el );
		newS.stretch = Boolean(s.stretch);
		newS.fill = ((!s.fill)? "transparent" : s.fill);
		newS.loop = Boolean(s.loop);
		newS.scroll = (isNaN(s.scroll))? 0 : s.scroll ;
		newS.padding = (!s.padding)? "0px" : (isNaN(Number(s.padding))? s.padding : s.padding+"px" );
		newS.eventListeners = ((Object.keys(s).indexOf("eventListeners") < 1) || (typeof s.eventListeners != "object") || (Object.keys(s.eventListeners).length < 1))? {} : s.eventListeners ;
 		if(Object.keys(newS.eventListeners).indexOf("autoScroll")<0){
			newS.eventListeners.autoScroll = function(){};
		}
		if(Object.keys(newS.eventListeners).indexOf("manualScroll")<0){
			newS.eventListeners.manualScroll = function(){};
		}
		newS.scrollable = (typeof s.scrollable == "boolean")? s.scrollable : true ;
		return newS;
	}// validation for swttings object

	var sliderFunc = function(urls, settings){
		this.images = 0;
		this.current = 0;
		this.changing = false;
		
		var self = this;
		var settings = fixSettings(settings);
		this.settings = settings;

		var el = (typeof settings.el == "string")? document.querySelector(settings.el) : settings.el ;
		el.innerHTML = "";
		
		var emptyContainer = document.createElement("div");
		emptyContainer.classList.add("carousel-container");
		el.appendChild(emptyContainer);
		this.container = el.lastElementChild;
		this.container.style.backgroundColor = settings.fill;

 		addEventListeners.call(this);
 		if(settings.scroll > 0){
 			scroll.call(this);
 		}

		for(var i in urls){
			addImage.call(this, urls[i], settings);
		}
		
		return {
			add : function(url, index){
				addImage.call(self, url, settings, index);
			},
			remove : function(index){
				removeImage.call(self, index);
			},
			next : function(){
				this.seek(self.current+1)
			},
			previous : function(){
				this.seek(self.current-1)
			},
			seek : function(index){
				seek.call(self, index);
			},
			get : function(str){
				var arr = ["images", "current" ,"settings", "container"];
				if(str==undefined){
					var obj = {};
					for(var a in arr){
						obj[arr[a]] = self[arr[a]];
					}
					return obj;
				}
				var str = String(str).trim().toLowerCase();
				if(arr.indexOf(str) < 0){
					return null;
				}
				return self[str];
			},
			nextTick : function(f){
				if(typeof f != "function"){ return; }
				nextTickArr.push(f);
			}
		}//returns a new object, in order to avoid exposing other properties
	}//exposed function object

	return sliderFunc;
})();