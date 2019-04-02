//
// @name Video Player
// @description  Video functionalty for vimeo and youtube.
//
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Helper = HelsingborgPrime.Helper || {};

HelsingborgPrime.Helper.Player = (function ($) {

    //Declarations
    var playerFirstInitYoutube = true; //Indicates wheter to load Youtube api or not.
    var playerFirstInitVimeo = true; //Indicates wheter to load Vimeo api or not.
    var playerFirstInitBambuser = true; //Indicates wheter to load Bambuser api or not.

    //Check for players, if exists; Run player script.
    function Player() {
        if ($(".player").length) {
            this.init();
        }
    }

    //Listen for play argument
    Player.prototype.init = function () {
        $(".player a").on('click', function (e) {
            this.initVideoPlayer($(e.target).closest('a'));
        }.bind(this));

        $(".player-playlist a").on('click', function (e) {
            e.preventDefault();
            this.switchVideo($(e.target).closest('a'));
        }.bind(this));
    };

    //Init player on start
    Player.prototype.initVideoPlayer = function(e) {
        var videoid = e.attr('data-video-id');
        var listid = e.attr('data-list-id');

        if (this.isNumeric(videoid)) {
            this.initVimeo(videoid, e);
        } else {
            if (listid) {
                this.initYoutube(videoid, e, listid);
            } else {
                this.initYoutube(videoid, e);
            }
        }
    };

    Player.prototype.initVimeo = function(videoid, target) {

        //Remove controls
        this.toggleControls(target);

        //Append player
        $(target).parent().append('<iframe src="//player.vimeo.com/video/' + videoid + '?portrait=0&color=333&autoplay=1" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');

        //Not first run anymore
        this.playerFirstInitVimeo = false;
    };

    Player.prototype.initYoutube = function(videoid, target, listid) {

        if (typeof listid === 'undefined') {
            listid = null;
        }

        //Remove controls
        this.toggleControls(target);

        //Append player
        if (listid) {
            $(target).parent().append('<iframe type="text/html" width="100%" height="100%"src="//www.youtube.com/embed/' + videoid + '?autoplay=1&autohide=1&cc_load_policy=0&enablejsapi=1&modestbranding=1&origin=styleguide.dev&showinfo=0&autohide=1&iv_load_policy=3&list=' + listid + '&rel=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
        } else {
            $(target).parent().append('<iframe type="text/html" width="100%" height="100%"src="//www.youtube.com/embed/' + videoid + '?autoplay=1&autohide=1&cc_load_policy=0&enablejsapi=1&modestbranding=1&origin=styleguide.dev&showinfo=0&autohide=1&iv_load_policy=3&rel=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
        }

        //Not first run anymore
        this.playerFirstInitYoutube = false;
    };

    Player.prototype.initBambuser = function(videoid, target) {

        //Remove controls
        this.toggleControls(target);

        //Append player
        $(target).parent().append('<iframe type="text/html" width="100%" height="100%"src="//embed.bambuser.com/broadcast/' +videoid+ '?autoplay=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');

        //Not first run anymore
        this.playerFirstInitBambuser = false;
    };

    Player.prototype.switchVideo = function(element) {
        var videoid = element.attr('data-video-id');
        var listid = element.attr('data-list-id');

        var $player = element.parents('.player-playlist').siblings('.player');
        var $iframe = $player.children('iframe');

        $player.find('a').hide();

        if (!$player.find('.loading').length) {
            $player.append('<div class="loading pos-absolute-center" style="width:300px;"><div></div><div></div><div></div><div></div></div>');
        }

        if (this.isNumeric(videoid)) {
            this.initVimeo(videoid, $player.children('a'));
        } else {
            if (listid) {
                this.initYoutube(videoid, $player.children('a'), listid);
            } else {
                this.initYoutube(videoid, $player.children('a'));
            }
        }

        $iframe.remove();
    };

    Player.prototype.toggleControls = function(target) {
        if (typeof target === 'undefined') {
            console.error('Could not start player. Wrapper not found.');
            return false;
        }

        target = target.parent();

        if (target.hasClass('is-playing')) {
            target.removeClass('is-playing');
            $("html").removeClass('video-is-playing');
            return true;
        }

        target.addClass('is-playing');
        $("html").addClass('video-is-playing');
        return true;
    };

    /**
     * Reset all players, or with target id.
     * @param  {object} target
     * @return {bool}
     */
    Player.prototype.resetPlayer = function(target) {
       if (typeof target !== 'undefined') {
            $('.player iframe').remove();
            $('.player').removeClass('is-playing');
            $('html').removeClass('video-is-playing');
            return false;
        }

        $('iframe', target).remove();
        target.removeClass('is-playing');
        $('html').removeClass('video-is-playing');
        return true;
    };

    Player.prototype.isNumeric = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    return new Player();

})($);
