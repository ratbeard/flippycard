// generic card behavior - no game logic!
// you should be able to flip up a card - 
// though if a game is going on, it might impose 
// some logic that restricts your ability to flip
$('.card').concrete({
  onclick: function () {  return this.flip();  },
  Duration: 150,
  animate_content: function (props, complete_fn) {
    var self = this; 
    return this.find('.content').
      animate(props, {
        duration: self.getDuration(), 
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


// In a game, cards pick up some extra semantics.
// note: `onmatch` is part of the concrete framework, not my
// match event.
$('.game.on .card').concrete({
  onmatch: function () {  console.log('concrete match - card');  },
  flip: function () {  this.toggleClass('guess')._super();  },
});

$('.game.on .card.up').concrete({
  onmatch: function () {  console.log('concrete match - card up');  },
  onclick: function () {  this.trigger('_pointless_click');  },
  mark_as_matched: function () {  
    return this.addClass('matched').removeClass('guess');  
  },
});


// catches low-level flip events and turns them in to
// higher level game events
$('.game.on .flipper').concrete({
  onflip: function () {
    var guesses = this.find('.card.guess');
    console.log('flipper guesses: ', guesses.length);
    
    one_guess()?  this.trigger('_first_flip') 
    : two_guesses()?  
        that_match()?  this.trigger('_match')
        : this.trigger('_no_match')
    : 'was a downward flip' ;
    /////
    function one_guess () { return guesses.length === 1; }
    function two_guesses () { return guesses.length === 2; }
    function that_match () { return guesses.eq(0).name() === guesses.eq(1).name(); }
  }
});


// tracks the state of the current move
// after the first flip moves to the more interesting
// 'one-guess' state
$('.game.on .move').concrete({
  on_first_flip: function () {  return this.addClass('one-guess');  },
});

$('.game.on .move.one-guess').concrete({
  on_match: function () {  
    this.start_state().find('.card.up.guess').mark_as_matched();
  },
  on_no_match: function () {  
    this.start_state().find('.card.up.guess').flip();
  },
  start_state: function () {  return this.removeClass('one-guess');  },
});


// The big dady game object
// listens for matches to see if the game is over
$('.game').concrete({
  on_match: function () {
    this.all_cards_matched()? this.done('win') : console.log('game not done');
  },
  all_cards_matched: function () { 
    return this.find('.card:not(.matched)').length === 0; 
  },
  done: function (win_or_lose) {
    this.addClass('done').addClass(win_or_lose);
  },
  on_toggle_game: function () {
    this.toggleClass('on').find('.commentary').say('Are you cheating?');
  }
});

// can turn game on and off
$('.game > header').concrete({
  onclick: function () { this.trigger('_toggle_game'); }
});

// Snarky Commentary gives you praise or 
// ridicules you!
$('.commentary').concrete({
  say: function (text) {  this.find('footer').text(text);  }
});

$('.game.on .commentary').concrete({
  on_match: function () {  this.say('nice');  },
  on_no_match: function () {  this.say('too bad');  },
  on_first_flip: function () {  this.say('hmmm...');  },
  on_pointless_click: function () {  this.say('Pick a face down card, bozo!'); }
});