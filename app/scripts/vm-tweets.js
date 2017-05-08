/**
 *
 * @author
 * @description
 *
 */
 
/*jslint browser: true*/


(function ($, undefined) {
    'use strict';
    
    function Tweets(node, tweets) {
        var vm = this;
        
        vm.tweets = ko.observableArray();
        vm.tweets(tweets);
    }

    $(function() {
        $('[data-role="tweets"]').each(function() {
            
            var that = this;
            
            var config8 = {
              "id": '669982199421214721',
              "dataOnly": true,
              "maxTweets": 30,
              "customCallback": populateTpl
            };

            twitterFetcher.fetch(config8);

            function populateTpl(tweets){
                var filtered = [];
                
                $.each(tweets, function(i, tweet) {
                    if ($(tweet.author).find('[data-scribe="element:screen_name"]').text() === '@geebirdandbamby') {
                        filtered.push({
                            date: moment(tweet.timestamp).format('MMMM Do'),
                            link: tweet.permalinkURL,
                            tweet: tweet.tweet
                        });
                    }
                });
                
                ko.applyBindings(new Tweets(that, filtered), that);
            }
            
            function onNextClick(e) {
                var ul = $(that).find('ul');
                
                var $next = ul.find('.active').removeClass('active').next().addClass('active');
                
                if ( !ul.find('.active').next().length ) {
                    $next = ul.find('li').first().addClass('active');
                } 
                
                
                ul.css({
                    marginTop: $next.position().top * -1
                });
                
                
            }
            
            $(this).find('[data-role="next-tweet"]').on('click', onNextClick);
            
        });
    });
  
})(jQuery);


            