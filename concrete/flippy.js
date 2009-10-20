$(document).ready(function ($) {

});


$('.card').concrete({
  onclick: function () {  this.flip();  },
  flip: function () {
    return this.toggleClass('up').toggleClass('active').trigger('flip');
  },
  name: function () {
    return this.attr('class').match(/\bcard-name-(.+?)\b/)[1];
  },
  expand: function() {
    return this.animate({height: 100}, {queue: false})
  },
  collapse: function() {
    return this.animate({height: 45}, {queue: false})
  },
});

$('.card.up').concrete({
  flip: function () {
    this.trigger('_pointless_click');
  },
  mark_as_matched: function () {  return this.addClass('matched');  },
  turn_down: function () {  return this.removeClass('up');  }
});

$('.card.up.active').concrete({
  deactivate: function () {  return this.removeClass('active');  },
  mark_as_matched: function () {  return this.deactivate()._super();  },
  turn_down: function () {  return this.deactivate()._super();  }
});

$('.flipper').concrete({
  onflip: function () {
    var up = this.find('.card.up.active');
    two_flipped_up()?  that_match()?  this.trigger('_match')
      :  this.trigger('_no_match')
    :  this.trigger('_first_flip');
    /////
    function two_flipped_up () { return up.length === 2; }
    function that_match () { return up.eq(0).name() === up.eq(1).name(); }
  }
});


$('.move').concrete({
  on_first_flip: function () { 
    this.addClass('one-guess').find('.card:not(.up)').expand();
  },
});


$('.move.one-guess').concrete({
  on_match: function () {  
    console.log('match');
    this.find('.card.up.active').matched();
    this.start_state();
  },
  on_no_match: function () {  
    console.log('no match');
    this.find('.card.up.active').turn_down();
    this.start_state();  
  },
  start_state: function () {  this.removeClass('one-guess');  },
});



$('*').concrete({
  cards: function () {
    this.find('.card');
  }
});

$('.commentary').concrete({
  say: function (text) {  this.find('footer').text(text);  },
  on_match: function () {  this.say('nice');  },
  on_no_match: function () {  this.say('too bad');  },
  on_pointless_click: function () {  this.say('Pick a face down card, bozo!'); }
})