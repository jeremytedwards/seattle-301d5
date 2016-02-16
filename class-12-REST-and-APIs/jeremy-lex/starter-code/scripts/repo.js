(function(module) {
  var repos = {};

  repos.all = [];

  repos.requestRepos = function(callback) {
    // TODO: How would you like to fetch your repos? Don't forget to call the callback.
    console.log('gitAJAX: ' + $gitTokenAJAX);
    $.ajax($gitTokenAJAX).done(callback);

    // var $gitTokenAJAX = {
    //   url: 'https://api.github.com/users/jeremytedwards/repos?per_page=5&sort=updated',
    //   type: 'GET',
    //   headers: { 'Authorization': 'token ' + githubToken },
    //   success: function(repoData, message, xhr) {
    //     console.log('Processing each Repo' + repoData);
    //     repoData.forEach( function(xhr) {
    //       repos.with(xhr);
    //     });
    //   } // end of success function
    // };//end of gitTokenAJAX object

  };

  // DONE: Model method that filters the full collection for repos with a particular attribute.
  // You could use this to filter all repos that have a non-zero `forks_count`, `stargazers_count`, or `watchers_count`.
  repos.with = function(attr) {
    return repos.all.filter(function(repo) {
      return repo[attr];
    });
  };

  module.repos = repos;
})(window);
