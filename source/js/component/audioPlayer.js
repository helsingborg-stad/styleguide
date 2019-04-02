//
// @name File selector
// @description
//
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Component = HelsingborgPrime.Component || {};

HelsingborgPrime.Component.AudioPlayer = (function ($) {

    var numberTotalOfTicks = 1000;

    function AudioPlayer() {
        this.handlePlayPause();

        $(".audio-player").each(function(index, player){

            //Setup seekbar
            $("audio", player).get(0).addEventListener('loadedmetadata', function() {
                this.initPlayer($(player).closest(".audio-player"));
            }.bind(this));

            //Lock seeker
            $(".action-seek", player).get(0).addEventListener('mousedown', function() {
                this.lockSeeker(player);
            }.bind(this));

            //Handle reseek
            $(".action-seek", player).get(0).addEventListener('mouseup', function() {
                this.handleReSeek(player);
                this.unlockSeeker(player);
            }.bind(this));

            //Move seeker
            $("audio", player).get(0).addEventListener('timeupdate', function() {
                this.updateSeekerStatus(player);
            }.bind(this));

        }.bind(this));

    }

    AudioPlayer.prototype.updateSeekerStatus = function (player) {
        if(!$(player).hasClass("locked")) {
            $(".action-seek", player).val(($("audio", player).get(0).currentTime/$("audio", player).get(0).duration) * 100);
        }
    };

    AudioPlayer.prototype.initPlayer = function (player) {
        $(player).addClass("ready");
    };

    AudioPlayer.prototype.lockSeeker = function (player) {
        $(player).addClass("locked");
    };

    AudioPlayer.prototype.unlockSeeker = function (player) {
        $(player).removeClass("locked");
    };

    AudioPlayer.prototype.handleReSeek = function (player) {

        $("audio", player).get(0).currentTime = $("audio", player).get(0).duration * ($(".action-seek", player).val()/100);

        if($("audio", player).get(0).currentTime != $("audio", player).get(0).duration) {
            this.play(player);
        } else {
            this.pause(player);
        }
    };

    AudioPlayer.prototype.play = function (player) {

        //Stop all players
        this.pauseAll();

        //Play and visaully indicate playback
        $("audio", $(player).closest(".audio-player")).get(0).play();
        $(player).closest(".audio-player").addClass("playing");
    };

    AudioPlayer.prototype.pause = function (player) {

        //Stop and remove playback class
        $("audio", $(player).closest(".audio-player")).get(0).pause();
        $(player).closest(".audio-player").removeClass("playing");
    };

    AudioPlayer.prototype.pauseAll = function () {
        $(".audio-player").each(function(index, player){
            this.pause(player);
        }.bind(this));
    };

    AudioPlayer.prototype.handlePlayPause = function() {
        $(".audio-player .toggle-action-play").click(function(event){
            this.play($(event.target));
        }.bind(this));

        $(".audio-player .toggle-action-pause").click(function(event){
            this.pause($(event.target));
        }.bind(this));
    };

    return new AudioPlayer();

})(jQuery);
