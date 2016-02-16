(function(module) {
  var repoView = {};

  // DONE: Private methods declared here live only within the scope of the wrapping IIFE.
  // Private Member - This is a function that is created for local access only. Helper Funtcion.
  var ui = function() {
    var $about = $('#about'); // Best practice: Cache the DOM query if it's used more than once.

    $about.find('ul').empty();
    $about.show().siblings().hide();
  };

  // TODO: How do you want to render a single repo as html? Return your filled in HTML template.
  // This is a function that is created for local access only. Helper Funtcion.
  var render = function(repo) {
    // For each item in the repo generate the html that will get appended to the
    // list on the page. Called from .append.map() below
    $('<li>').html();
  };

  // DONE: If all the data is loaded, we can prep the UI and render the repos.
  repoView.index = function() {
    ui();

    // The jQuery `append` method lets us append an entire array of HTML elements at once,
    // So we can use a little FP to transform our data-set into DOM nodes:
    $('#about ul').append(
      repos.with('forks_count').map(render)
    );
  };

  module.repoView = repoView;
})(window);
