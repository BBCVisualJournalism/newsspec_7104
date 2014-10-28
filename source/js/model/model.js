/* TODO : remove the dependency on Dev and call to Dev.init() in release version - Dev is used to build the JSON file and console log it */

define(['lib/news_special/bootstrap'], function(news) {

    //var model = {};
    var Model = function(containerId) {
        //console.log('Model');
        this.GRAPH_CONTAINER = "#" + containerId;

        this.regions = {
            deraa: {
                total: 354641,

                children: 196722,
                women: 90253,
                men: 68483,

                lebanon: 66368,
                jordan: 281758,
                iraq: 189,
                egypt: 7170
            },
            homs: {
                total: 344198,

                children: 175631,
                women: 93040,
                men: 75498,

                lebanon: 228652,
                jordan: 96827,
                iraq: 572,
                egypt: 18147
            },
            aleppo: {
                total: 251298,

                children: 147513,
                women: 67760,
                men: 70319,

                lebanon: 195193,
                jordan: 37187,
                iraq: 40126,
                egypt: 13095
            },
            ruraldamascus: {
                total: 220349,

                children: 119532,
                women: 66874,
                men: 56016,

                lebanon: 129807,
                jordan: 69439,
                iraq: 726,
                egypt: 42463
            },
            damascus: {
                total: 154076,

                children: 70007,
                women: 45697,
                men: 45279,

                lebanon: 46892,
                jordan: 45547,
                iraq: 21060,
                egypt: 45226
            },
            hassakeh: {
                total: 147644,

                children: 63137,
                women: 38707,
                men: 57356,

                lebanon: 24277,
                jordan: 3268,
                iraq: 131512,
                egypt: 155
            },
            idlib: {
                total: 138253,

                children: 83252,
                women: 35389,
                men: 29811,

                lebanon: 137833,
                jordan: 8332,
                iraq: 69,
                egypt: 2223
            },
            hama: {
                total: 95502,

                children: 54353,
                women: 25643,
                men: 23682,

                lebanon: 72734,
                jordan: 28231,
                iraq: 140,
                egypt: 2575
            },
            raqqa: {
                total: 45128,

                children: 29808,
                women: 13221,
                men: 11495,

                lebanon: 42571,
                jordan: 6137,
                iraq: 5590,
                egypt: 226
            },
            deirezzor: {
                total: 24023,

                children: 14869,
                women: 6285,
                men: 5490,

                lebanon: 18077,
                jordan: 2370,
                iraq: 5510,
                egypt: 687
            },
            lattakia: {
                total: 7394,

                children: 3271,
                women: 2103,
                men: 2468,

                lebanon: 3870,
                jordan: 1074,
                iraq: 122,
                egypt: 2776
            },
            quneitra: {
                total: 7886,

                children: 5817,
                women: 2653,
                men: 2032,

                lebanon: 7331,
                jordan: 2571,
                iraq: 42,
                egypt: 559
            },
            tartous: {
                total: 4075,

                children: 1919,
                women: 1225,
                men: 1246,

                lebanon: 2830,
                jordan: 279,
                iraq: 10,
                egypt: 1271
            },
            suweida: {
                total: 1008,

                children: 625,
                women: 306,
                men: 421,

                lebanon: 540,
                jordan: 771,
                iraq: 8,
                egypt: 33
            },
            notknown: {
                total: 19137,

                children: 10166,
                women: 5629,
                men: 5190,

                lebanon: 8330,
                jordan: 8825,
                iraq: 3589,
                egypt: 244
            }
        };

        var myGraph = this;
        news.pubsub.on('updateMapDisplayField', function () { myGraph.renderData(); });
        return this;
    }

    // controller calls init() to set up some values in the model. 
    Model.prototype.init = function() {
        //console.log('Model, init: ', this.overallData);
        // model.isMobile = thisIsMobile;
       //  model.countryNames = countryNamesVocab;
        //NB: in other map projects some views would initilise when the model was ready by listening for this init event.
        //news.pubsub.emit('init');
    }

    // valid form submitted so update Model then emit events of updated values
    Model.prototype.update = function() {
        news.pubsub.emit('update');
        //send out istats
        /*news.istats.log(
            'navigation', // action type
            "newsSpecial", // action name
            {
                "view": 'results displyed' // view/description
            }
        );*/
    }

    Model.prototype.getKeyEventsContent = function(keyEventsClass) {
        var keyEvents = [];
        news.$('.' + keyEventsClass).each(function () {
            var myDataObj = {
                eltId : news.$(this).attr('id'),
                title : news.$(this).find('h3').text()
            };
            keyEvents.push(myDataObj);
        });
        return keyEvents;
    }

    /*Model.prototype.getKeyEventsIndexes = function(selector) {
        var indexes = [];
        news.$(selector).each(function () {
            indexes.push(news.$(this).find('a').attr('data-event'));
        });
        return indexes;
    }*/

    //public api
    return Model;

});