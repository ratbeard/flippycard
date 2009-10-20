$('.game > header').concrete({
  onclick: function () {  this.parent().toggleClass('on'); }
})

// generic card behavior - no game logic!
// you should be able to flip up a card - 
// though if a game is going on, it might impose 
// some logic that restricts this!
$('.card').concrete({
  onclick: function () {  return this.flip();  },
  animate_content: function (props, complete_fn) {
    var self = this; 
    return this.find('.content').
      animate(props, {
        duration: 200, 
        easing: 'swing',
        complete: function () {  complete_fn.call(self);  }
      }).end();
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
  flip: function () {  this.toggleClass('guess')._super();  },
});

$('.game.on .card.up').concrete({
  onmatch: function () {  console.log('a concrete match');  },
  onclick: function () {  this.trigger('_pointless_click');  },
  mark_as_matched: function () {  
    return this.addClass('matched').removeClass('guess');  
  },
});

$('.card.up.active').concrete({
  mark_as_matched: function () {  return this.deactivate()._super();  },
});

$('.flipper').concrete({
  onflip: function () {
    var guesses = this.find('.card.guess');
    console.log('flipper: ',guesses.length);
    
    one_guess()?  this.trigger('_first_flip') 
    : two_guesses()?  
        that_match()?  this.trigger('_match')
        : this.trigger('_no_match')
    : 'flipped down' ;
    /////
    function one_guess () { return guesses.length === 1; }
    function two_guesses () { return guesses.length === 2; }
    function that_match () { return guesses.eq(0).name() === guesses.eq(1).name(); }
  }
});

$('.move').concrete({
  on_first_flip: function () {
    return this.addClass('one-guess');
  },
});

$('.move.one-guess').concrete({
  on_match: function () {  
    console.log('match');
    this.find('.card.up.guess').mark_as_matched();
    this.start_state();
  },
  on_no_match: function () {  
    console.log('no match');
    $('.card.up.guess').flip();
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
  on_first_flip: function () {  this.say('hmmm...');  },
  on_pointless_click: function () {  this.say('Pick a face down card, bozo!'); }
})