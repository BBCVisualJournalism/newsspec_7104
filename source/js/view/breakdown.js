define(['lib/news_special/bootstrap'], function(news) {


	// Graph constructor
	var Breakdown = function(containerId, regionsData) {
		//console.log('Breakdown');
		//this.GRAPH_CONTAINER_ID = containerId;
		this.GRAPH_CONTAINER = "#" + containerId;
		this.NUMBER_SEPARATOR = ',';

        // An offset to compensate for user agent margin
        this.BREAKPOINT_OFFSET = 16;

		this.regionsData = regionsData;

		// Move this into a helper module
		this.breakpoints = [320, 480, 768, 974];

		this.lastWidth = document.body.clientWidth;

		this.regionSelectedAtLeastOnce = false;

		return this;
	}

	Breakdown.prototype.init = function() {

		myBreakdown = this;
		myBreakdown.NUMBER_SEPARATOR = news.$('#sr-thousands-separator').text();

		if (myBreakdown.isEnhancedView()) {
			myBreakdown.addEnhancements();
		}

        news.pubsub.on('sr-region-click', function (ev) {
        	ev.preventDefault();

        	var myRegion = news.$(ev.currentTarget).parent().attr('data-name'),
        		demographics = ['women', 'men', 'children', 'total'],
        		destinations = ['lebanon', 'jordan', 'iraq', 'egypt'];

        	// Remove any previous region class from the overlay (any class matching 'sr-region--')
        	news.$('.sr-map--overlay').removeClass(function (index, cssClass) {
				return (cssClass.match (/\bsr-region--\S+/g) || []).join(' ');
			});
        	
			// Display the map overlay for the selected region
        	news.$('.sr-map--overlay').addClass('sr-region--' + myRegion);
        	
			// Highlight the list item for the selected region
        	news.$('.sr-regions__list li').addClass('sr-knocked-back');
        	news.$('.sr-regions__list li').removeClass('sr-highlighted');
        	news.$('.sr-regions__list li[data-name=' + myRegion + ']').removeClass('sr-knocked-back');
        	news.$('.sr-regions__list li[data-name=' + myRegion + ']').addClass('sr-highlighted');

        	// Update the breakdown figures for gender and age
        	for (var item in demographics) if(demographics.hasOwnProperty(item)) {
        		news.$('.sr-region--' + demographics[item] + ' .sr-breakdown--figure').text(

                    // Persian only
                    //myBreakdown.numberStringToFarsi(myBreakdown.regionsData[myRegion][demographics[item]].toString())

                    // Everything else
                    myBreakdown.formatNumber(myBreakdown.regionsData[myRegion][demographics[item]].toString())

        		);
        	}

        	// Update the breakdown figures for destination countries
        	for (var country in destinations) if(destinations.hasOwnProperty(country)) {
        		var myFig = myBreakdown.regionsData[myRegion][destinations[country]],
        			myBarWidth = 0,
        			myPaddingLeft = 0;

        		myBarWidth = myBreakdown.calculatePercentage(
        			myFig,
        			// 100% = the biggest value in the data, or the total figure for Deraa
        			myBreakdown.regionsData.deraa.total
        		);

        		news.$('.sr-region--' + destinations[country] + ' .sr-breakdown--figure').text(

                    // Persian only
                    //myBreakdown.numberStringToFarsi(myFig.toString())

                    // Everything else
                    myBreakdown.formatNumber(myFig.toString())

        		);

        		// Set the left padding on the figure to 0 if the bar width is 0 - just so it looks neat
        		myPaddingLeft = (myBarWidth === 0) ? 0 : 8;
        		news.$('.sr-region--' + destinations[country] + ' .sr-breakdown--figure').css(
    				'padding-left',
    				myPaddingLeft + 'px'
        		);
        		news.$('.sr-region--' + destinations[country] + ' .sr-breakdown--figure').css(
        			'left',
        			(myBarWidth) + '%'
        		);
        		news.$('.sr-region--' + destinations[country] + ' .sr-breakdown--bar').css(
        				'width', 
   						myBarWidth + '%'
        		);
        	}


        	myBreakdown.regionSelectedAtLeastOnce = true;
        });

        news.pubsub.on('resize', function (ev) {
        	if (myBreakdown.lastWidth !== document.body.clientWidth) {

	        	if (myBreakdown.isEnhancedView()) {

	        		myBreakdown.addEnhancements();
	        		if (myBreakdown.regionSelectedAtLeastOnce !== true) {
	        			news.$('.sr-regions__list li[data-name="deraa"] a').trigger('click');
	        		}

	        	} else {
	        		//
	        	}

	        	myBreakdown.lastWidth = document.body.clientWidth;
        	}
        });

        if (myBreakdown.regionSelectedAtLeastOnce !== true) {
        	news.$('.sr-regions__list li[data-name="deraa"] a').trigger('click');
        }
	}

	Breakdown.prototype.addEnhancements = function() {
		var mapMarkup = '',
			keyMarkup = '',
			linkMarkup = '<a href="#"></a>',
			myBreakdown = this;

		// Add the map to the DOM
		if (news.$('.sr-region__map-container').length < 1) {
			mapMarkup = '<div class="sr-region__map-container">' +
			    	'<div class="sr-map sr-map--base"></div>' +
			    	'<div class="sr-map sr-map--overlay"></div>' +
			    '</div>';
			news.$(myBreakdown.GRAPH_CONTAINER).after(mapMarkup);
		}

		// Add links to regions list items
		if (news.$('.sr-regions__list li a').length < 1) {
			//news.$('.sr-regions__list li').append(linkMarkup);

			// Our jQuery build omits wrap so we jump through some hoops 
			// to add our link inside the li
			news.$('.sr-regions__list li').each(function () {
				var myContentCopy = news.$(this).html(),
					myRegion = news.$(this).attr('data-name'),
					// Set data-name attribute here so IE stays happy with the DOM structure
					myLink = news.$(linkMarkup).attr('data-name', myRegion).append(myContentCopy);
				news.$(this).html(myLink);
			});

			news.$('.sr-regions__list li a').on('click', function (ev) {
				news.pubsub.emit('sr-region-click', [ev]);
			});
		}

	}

	Breakdown.prototype.updateFigures = function(index) {
		var myBreakdown = this;

		for (var destination in myBreakdown.destinationsData) if(myBreakdown.destinationsData.hasOwnProperty(destination)) {
			/*news.$('#sr-destinations .sr-' + destination + ' .sr-fig').html(
				myBreakdown.formatNumber(myBreakdown.destinationsData[destination]['keyEvents'][index])
			);*/
		}
	}

	// Move this into a helper module
	Breakdown.prototype.getViewportWidth = function() {
        return document.body.clientWidth;
    }

    // Move this into a helper module
    Breakdown.prototype.formatNumber = function(num) {
        var myNewString = num.toString().replace(/\B(?=([\d۰۱۲۳۴۵۶۷۸۹]{3})+(?![\d۰۱۲۳۴۵۶۷۸۹]))/g, this.NUMBER_SEPARATOR);
        // Anything except Persian: var myNewString = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.NUMBER_SEPARATOR);
        return myNewString.replace(/(^,)|(,$)/g, "");
    }

	// Move this into a helper module
    Breakdown.prototype.isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    // Move this into a helper module
	Breakdown.prototype.calculatePercentage = function(quantity, total) {
		return Math.round((quantity / total) * 100);
	}

	Breakdown.prototype.isEnhancedView = function() {
		return myBreakdown.getViewportWidth() >= (myBreakdown.breakpoints[2] - myBreakdown.BREAKPOINT_OFFSET);
	}

    Breakdown.prototype.numberStringToFarsi = function(string) {
        var farsiString = '',
            num = string.replace(/\,/g,'');
            persianNumberArray = new Array('۰','۱','۲','۳','۴','۵','۶','۷','۸','۹');

        for(;num/10 > 0;){
            n = num%10;
            num = parseInt(num/10, 10);
            farsiString = persianNumberArray[n] + farsiString;
        }

        return this.formatNumber(farsiString) || persianNumberArray[0];
    }

	return Breakdown;

});