$(document).ready(function ($) {

});


$('.card').concrete({
  onclick: function () {
    this.flip();
  },
  flip: function () {
    this.toggleClass('up').trigger('flip');
  },
  match: function () {
    return this.map(this.name);
  },
  name: function () {
    return this.attr('class').match(/\bcard-name-(.+?)\b/)[1];
  }
});


$('.flipper').concrete({
  onflip: function () {
    up = this.find('.card.up');
    console.log(up.length);
    
    two_flipped_up()?  that_match()?  this.trigger('_match')
      :  this.trigger('_no_match')
    :  0;
    /////
    function two_flipped_up () { return up.length === 2; }
    function that_match () { return up.eq(0).name() === up.eq(1).name(); }
  }
});


$('.move').concrete({
  on_match: function () {    
    console.log(':)');
  },
  on_no_match: function () {    
    console.log(':(');    
  },
  
});


$('.game').concrete({
});

$('.commentary').concrete({
  say: function (text) {  this.find('footer').text(text);  },
  on_match: function () {  this.say('nice');  },
  on_no_match: function () {  this.say('too bad');  },
})