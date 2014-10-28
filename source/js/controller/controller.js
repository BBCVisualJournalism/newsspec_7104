define(['lib/news_special/bootstrap', 'model/model', 'view/graph_regions', 'view/breakdown'],
    function (news, Model, GraphRegions, Breakdown) {

		function init() {
            myModel = new Model('sr-regions__list');
            myModel.init();
            
            myGraphRegions = new GraphRegions('sr-regions__list', myModel.regions);
            myGraphRegions.init(myModel.overallData);
            
            myBreakdown = new Breakdown('sr-regions__list', myModel.regions);
            myBreakdown.init(myModel.overallData);

            // Add event emitters
            window.addEventListener('resize', function (e) {
                news.pubsub.emit('resize');
            }, false);

		}

        return {
            init: init
        };
    });