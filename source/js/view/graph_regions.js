define(['lib/news_special/bootstrap'], function(news) {


	// Graph constructor
	var myGraphRegions = function(containerId, regionsData) {
		//console.log('myGraphRegions');
		//this.GRAPH_CONTAINER_ID = containerId;
		this.GRAPH_CONTAINER = "#" + containerId;
		this.NUMBER_SEPARATOR = ',';

        this.FIXED_UNIT_WIDTH = 5;
        this.DENOMINATOR = 1000;

        // An offset to compensate for user agent margin
        this.BREAKPOINT_OFFSET = 16;

		this.regionsData = regionsData;

		// Move this into a helper module
		this.breakpoints = [320, 480, 768, 974];

		this.graphStyle = 'bars'; // 'bars' or 'blocks', depending on viewport width
		this.lastWidth = document.body.clientWidth;

		return this;
	}

	myGraphRegions.prototype.init = function() {

		myGraphRegions = this;
		myGraphRegions.NUMBER_SEPARATOR = news.$('#sr-thousands-separator').text();

		if (myGraphRegions.isEnhancedView()) {
			myGraphRegions.addEnhancements();
		}

        news.pubsub.on('resize', function (ev) {
        	if (myGraphRegions.lastWidth !== document.body.clientWidth) {

	        	if (myGraphRegions.isEnhancedView()) {

	        		myGraphRegions.addEnhancements();

        			if (myGraphRegions.graphStyle !== 'blocksGroup4') {
	        			myGraphRegions.graphStyle = 'blocksGroup4';
        			} else if (myGraphRegions.graphStyle !== 'blocksGroup3') {
	        			myGraphRegions.graphStyle = 'blocksGroup3';
        			}
					myGraphRegions.renderCharts();

	        	} else {
	        		myGraphRegions.graphStyle = 'bars';
	        	}

	        	myGraphRegions.lastWidth = document.body.clientWidth;
        	}
        });
	}

	myGraphRegions.prototype.addEnhancements = function() {
		var myGraphRegions = this;

		myGraphRegions.renderCharts();

	}

	myGraphRegions.prototype.renderCharts = function() {
		var myGraphRegions = this;

		//console.log('myGraphRegions.graphStyle: ' + myGraphRegions.graphStyle);

		if (myGraphRegions.isEnhancedView()) {

			// Add the charts key to the DOM
			if (news.$('.sr-region__blocks-key').length < 1) {
				keyMarkup = '<div class="sr-region__blocks-key">' +
						'<h3 class="sr-flow"><span class="sr-key-ident"></span>= <span class="sr-key-label">' +
							// Persian only
							//myGraphRegions.numberStringToFarsi(myGraphRegions.DENOMINATOR.toString()) + ' ' + 
							// Everything else
							myGraphRegions.DENOMINATOR.toString() + ' ' + 
							news.$('#sr-refugees').text() + 
							'</span></h3>' +
					'</div>';
				news.$(myGraphRegions.GRAPH_CONTAINER).before(keyMarkup);
			}
            myGraphRegions.renderBlocks();
		} else {
			//
		}

	}

	myGraphRegions.prototype.renderBlocks = function() {
		var myGraphRegions = this,
			myChartContainers = news.$('.sr-region__bar-wrapper'),
			myChartContainerWidth = 0;

		myChartContainerWidth = news.$(myChartContainers).get(0).clientWidth;

        // Reset the chart content
        news.$('.sr-region__bar-wrapper .sr-region__bar').html('');

        myChartContainers.each(function (chartEltIndex) {

            var myRegion = news.$(this).parent().attr('data-name'),
            	myValue = 0,
            	myScaledValue = 0;

            myValue = myGraphRegions.regionsData[myRegion]['total'];
            myScaledValue = (myValue / myGraphRegions.DENOMINATOR) * myGraphRegions.FIXED_UNIT_WIDTH || 0;

            // Shave off the spare pixel once for each row of blocks, including any partial row (+1)
            myScaledValue -= ((myGraphRegions.FIXED_UNIT_WIDTH - 1) / myGraphRegions.FIXED_UNIT_WIDTH) * 
            	(Math.floor(myScaledValue / myChartContainerWidth) + 1);
            
            // Render the bar or bars for this month
            myGraphRegions.renderBlocksChart(this, myScaledValue, myChartContainerWidth, '.sr-region__bar');
        });
	}

	myGraphRegions.prototype.renderBlocksChart = function (chartElt, value, containerWidth, chartClass) {

        myGraphRegions = this;

        if (value > 0) {
            var myBarNode,
                barWidth = 0;

            if (value >= containerWidth) {
                barWidth = containerWidth;
                value -= containerWidth;
            } else {
                barWidth = Math.round(value);

                // No rounding - just in case of very small positive values occurring,
                // which would get us stuck in a recursive method meltdown
                value -= value;
            }


            myBarNode = news.$('<div class="sr-bar"></div>');
            myBarNode.css('width', '0');

            news.$(chartElt).find(chartClass).append(myBarNode);
			myBarNode.css('width', barWidth + 'px');
			myGraphRegions.renderBlocksChart(chartElt, value, containerWidth, chartClass);
        }
    };

	// Move this into a helper module
	myGraphRegions.prototype.getViewportWidth = function() {
        return document.body.clientWidth;
    }

    // Move this into a helper module
    myGraphRegions.prototype.formatNumber = function(num) {
        var myNewString = num.toString().replace(/\B(?=([\d۰۱۲۳۴۵۶۷۸۹]{3})+(?![\d۰۱۲۳۴۵۶۷۸۹]))/g, this.NUMBER_SEPARATOR);
        // Anything except Persian: var myNewString = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.NUMBER_SEPARATOR);
        return myNewString.replace(/(^,)|(,$)/g, "");
    }

	// Move this into a helper module
    myGraphRegions.prototype.isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    // Move this into a helper module
	myGraphRegions.prototype.calculatePercentage = function(quantity, total) {
		return Math.round((quantity / total) * 100);
	}

	myGraphRegions.prototype.isEnhancedView = function() {
		return myGraphRegions.getViewportWidth() >= (myGraphRegions.breakpoints[2] - myGraphRegions.BREAKPOINT_OFFSET);
	}

    myGraphRegions.prototype.numberStringToFarsi = function(string) {
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

	return myGraphRegions;

});