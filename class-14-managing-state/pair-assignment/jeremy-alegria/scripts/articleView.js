(function(module) {

  var articleView = {};

  var render = function(article) {
    var template = Handlebars.compile($('#article-template').text());

    article.daysAgo = parseInt((new Date() - new Date(article.publishedOn))/60/60/24/1000);
    article.publishStatus = article.publishedOn ? 'published ' + article.daysAgo + ' days ago' : '(draft)';
    article.body = marked(article.body);

    return template(article);
  };

  // COMMENT-DONE: What does this method do?  What is it's execution path?
  /*
  *  Called from article.js
  *
  *  This method takes the handlebars templage defined on index.html identified
  *  by the id="option-template". It then generates an object called "options"
  *  and fills that with key:value pairs (options) of unique authors using .map()
  *
  *  Using the "options" object it then appends the HTML option to the dropdown
  *  template on the index.html page.
  *
  *  Next, it does something similar for categores. Using the allCategories method
  *  on the Ariticle object it appends the category rows passed to it into the
  *  dropdown template id="category-filter". It will use .map() on the "rows"
  *  passed to it to ensure it set the html value and text for the options.
  *
  */
  articleView.populateFilters = function() {
    var options,
      template = Handlebars.compile($('#option-template').text());

    // Example of using model method with FP, synchronous approach:
    // NB: This method is dependant on info being in the DOM. Only authors of shown articles are loaded.
    options = Article.allAuthors().map(function(author) { return template({val: author}); });
    if ($('#author-filter option').length < 2) { // Prevent duplication
      $('#author-filter').append(options);
    };

    // Example of using model method with async, SQL-based approach:
    // This approach is DOM-independent, since it reads from the DB directly.
    Article.allCategories(function(rows) {
      if ($('#category-filter option').length < 2) {
        $('#category-filter').append(
          rows.map(function(row) {
            return template({val: row.category});
          })
        );
      };
    });
  };

  // COMMENT-DONE: What does this method do?  What is it's execution path?
  /*
  *  Called from self: artilceView.js
  *  Method: articleView.index
  *
  *  This acts as a helper funtion to refresh the content on the articles view
  *  by filtering the articles that get shown based on the selection made in
  *  either the authors or categories dropdown.
  *
  *  Operating onChange of one of the select boxs; either the author-filter or
  *  category-filter. It takes the id's value predecessor and sets that into a
  *  variable named "resource" and then using page() it calls a route for the
  *  given selection to filter the content.
  *
  *  Example for the selection "Virginia+Sawayn":
  *  The predecessor on dropdown id="author-filter" would be "author", the selection
  *  of that box "Virginia+Sawayn" (this) is added to the URL.
  *
  *  The function replacement:
  *  /<resource>/<this>
  *  would be...
  *  /author/Virginia+Sawayn
  *
  */
  articleView.handleFilters = function() {
    $('#filters').one('change', 'select', function() {
      resource = this.id.replace('-filter', '');
      page('/' + resource + '/' + $(this).val().replace(/\W+/g, '+')); // Replace any/all whitespace with a +
    });
  };

  articleView.initNewArticlePage = function() {
    $('#articles').show().siblings().hide();

    $('#export-field').hide();
    $('#article-json').on('focus', function(){
      this.select();
    });

    $('#new-form').on('change', 'input, textarea', articleView.create);
  };

  articleView.create = function() {
    var article;
    $('#articles').empty();

    // Instantiate an article based on what's in the form fields:
    article = new Article({
      title: $('#article-title').val(),
      author: $('#article-author').val(),
      authorUrl: $('#article-author-url').val(),
      category: $('#article-category').val(),
      body: $('#article-body').val(),
      publishedOn: $('#article-published:checked').length ? util.today() : null
    });

    $('#articles').append(render(article));

    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });

    // Export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
    $('#export-field').show();
    $('#article-json').val(JSON.stringify(article) + ',');
  };

  // COMMENT-DONE: What does this method do?  What is it's execution path?
  /*
  *  Called from articleControler.js
  *  As: articleView.index(ctx.articles);
  *
  *  This function sets the state of the page when in an article view.
  *
  *  First it hides all the id="articles" on the page then it walks the articles[]
  *  and appends the article data to the HTML using the render() helper funtion
  *  at the top of this file.
  *
  *  Then it populates the dropdown filters at the top of the page with populateFilters()
  *
  *  Next, it filters the content viewed, all the rendered content, based on any
  *  selected items from the dropdown filters, if one is selected.
  *
  *  Finally, it sets the shown lines of the article to 1 lines, by matching <p>
  *  tags and shows only 1 of many if found.
  *
  *  :nth-of-type is a CSS pseudo selector for if you want to ensure you're
  *  selecting the same type of tag no matter where it is inside the parent
  *  element, or what other different tags appear before it.
  *
  */
  articleView.index = function(articles) {
    $('#articles').show().siblings().hide();

    $('#articles article').remove();
    articles.forEach(function(a) {
      $('#articles').append(render(a));
    });

    articleView.populateFilters();

    // COMMENT: What does this method do?  What is it's execution path?
    /*
    *  The following method, defined above, calls a route to filter the articles
    *  on the page based on a selection.
    *
    *  (see handleFilters() above for more detail)
    *
    */
    articleView.handleFilters();

    // DONE: Replace setTeasers with just the truncation logic, if needed:
    if ($('#articles article').length > 1) {
      $('.article-body *:nth-of-type(n+2)').hide();
    }
  };

  articleView.initAdminPage = function() {
    var template = Handlebars.compile($('#author-template').text());

    Article.numWordsByAuthor().forEach(function(stat) {
      $('.author-stats').append(template(stat));
    });

    $('#blog-stats .articles').text(Article.all.length);
    $('#blog-stats .words').text(Article.numWordsAll());
  };

  module.articleView = articleView;
})(window);
