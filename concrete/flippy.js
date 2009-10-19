$(document).ready(function ($) {
  $('img').concrete({
    expand: function() {
      this.animate({height: 100}, {queue: false})
    },
    collapse: function() {
      this.animate({height: 45}, {queue: false})
    }
  });
});

