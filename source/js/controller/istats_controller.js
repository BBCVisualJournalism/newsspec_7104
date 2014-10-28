define(['lib/news_special/bootstrap'], function (news) {

    var IStatsController = function () {
        this.init();
    };

    IStatsController.prototype = {

        init: function () {
            this.listenForViewChange();
        },

        listenForViewChange: function () {

            // Listen for clicks to select a region
            news.pubsub.on('sr-region-click', function () {
                news.pubsub.emit('istats', ['View changed', 'region']);
            });
        }

    };

    return new IStatsController();

});