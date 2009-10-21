// Generic card that can be flipped.
// If a game is going on, it might limit your ability to flip.
$('.card').concrete({
  name: function () {  
    return this.attr('class').match(/\bcard-name-(.+?)\b/)[1];  
  },
  onclick: function () {  
    return this.flip();  
  },
  flip: function () {  
    return this.
      _shrink_content(function () {     
          this.toggleClass('up').
            _grow_content(function () {
              this.trigger('_flip');
            });
      });
  },
  _shrink_content: function (complete_fn) {
    return this._animate_content({width: 0}, complete_fn);
  },
  _grow_content: function (complete_fn) {
    return this._animate_content({width: '100%'}, complete_fn);
  },
  _animate_content: function (props, complete_fn) {
    var self = this; 
    return this.find('.content').
      animate(props, {
        duration: self.getFlipDuration(), 
        easing: 'swing',
        complete: function () {  complete_fn.call(self);  }
      }).end();
  },
  FlipDuration: 150
});


// In a game, cards pick up some extra semantics.
// note: `onmatch` is part of the concrete framework, not my match event.
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


// Turns low-level flip events to higher level game events
$('.game.on .flipper').concrete({
  on_flip: function () {
    var guesses = this.find('.card.guess');
    console.log('flipper guesses: ', guesses.length);
    
    one_guess()?  this.trigger('_first_flip') 
    : two_guesses()?  
        that_match()?  this.trigger('_match')
        : this.trigger('_no_match')
    : 'ignoring a downward flip' ;
    /////
    function one_guess () { return guesses.length === 1; }
    function two_guesses () { return guesses.length === 2; }
    function that_match () { return guesses.eq(0).name() === guesses.eq(1).name(); }
  }
});


// Tracks the state of the current move.
// After the first flip moves to the more interesting 'one-guess' state
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
    this.addClass('done ' + win_or_lose);
  },
  on_toggle_game: function () {
    this.toggleClass('on').find('.commentary').say('Are you cheating?');
  }
});

// can turn game on and off
$('.game > header').concrete({
  onclick: function () { this.trigger('_toggle_game'); }
});


// Snarky Commentary gives you praise or ridicules you!
$('.commentary').concrete({
  comment: function (e) {
    var selector = e.type.replace(/^_/, '.') + ' li';
    console.log('commenting on ', e.type);
    return this.find('.comments').
      find('.active').removeClass('active').end().
      find(selector).random().addClass('active');
  },
});

$('.game.on .commentary').concrete({
  onmatch: function () { this.comment({type: '_initial'}); },
  on_match: function (e) {  this.comment(e);  },
  on_no_match: function (e) {  this.comment(e);  },
  on_first_flip: function (e) {  this.comment(e);  },
  on_pointless_click: function (e) {  this.comment(e);  }
});

$('.comments li').concrete({
  random: function () {
    var random_index = this.length * Math.random();
    return this.pushStack( this.eq(random_index) );
  }
});

// hmm..
$('.game.done .state .progress + dd').concrete({
  onmatch: function () {  this.text('done!');  }
});