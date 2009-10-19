$(document).ready(function ($) {

  $('.card').concrete({
    onclick: function () {
      this.flip();
    },
    flip: function () {
      this.toggleClass('is-up');
      console.log('flip! ' + this.name());
    },
    name: function () {
      c = this.attr('class')
      return this.attr('class').match(/\bcard-name-(.+?)\b/)[1];
    },
    expand: function() {
      this.animate({height: 100}, {queue: false})
    },
    collapse: function() {
      this.animate({height: 45}, {queue: false})
    }
  });
});

