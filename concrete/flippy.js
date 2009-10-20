$(document).ready(function ($) {

});

// generic card behavior - no game logic!
// you should be able to flip up a card
$('.card').concrete({
  onclick: function () {  return this.flip();  },
  animate_content: function (props, complete_fn) {
    var self = this; 
    return this.find('.content').
      animate(props, {duration: 200, complete: function () {
        console.log('done');
        complete_fn.call(self);
      }}).end();
  },
  flip: function () {  
    return this.
      animate_content({width: 0}, function () {
        this.toggleClass('up').
        animate_content({width: '100%'}, function () {
          this.trigger('flip');
        });
      });
  },
  name: function () {  return this.attr('class').match(/\bcard-name-(.+?)\b/)[1];  },
});


$('.game.on .card').concrete({
  onmatch: function () {  console.log('match');  },
  flip: function () {  this.addClass('active')._super();  },
});

$('.game.on .card.up').concrete({
  onmatch: function () {  console.log('match');  },
  flip: function () {  this.trigger('_pointless_click');  },
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
    var active = this.find('.card.up.active');
    two_flipped_up()?  that_match()?  this.trigger('_match')
      :  this.trigger('_no_match')
    :  this.trigger('_first_flip');
    /////
    function two_flipped_up () { return active.length === 2; }
    function that_match () { return active.eq(0).name() === active.eq(1).name(); }
  }
});


$('.move').concrete({
  on_first_flip: function () { 
  },
});


$('.move.one-guess').concrete({
  on_match: function () {  
    console.log('match');
    this.find('.card.up.active').mark_as_matched();
    this.start_state();
  },
  on_no_match: function () {  
    console.log('no match');
    $('.card.up.active').flip();
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