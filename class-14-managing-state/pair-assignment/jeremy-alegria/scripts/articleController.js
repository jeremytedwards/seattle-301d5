(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized

  articlesController.index = function(ctx, next) {
    articleView.index(ctx.articles);
  };

  /* DONE - COMMENT: What does this method do?  What is it's execution path?

  This method loads all articles by id from the article database as a new property
  on page.js context object being executed in route.js.

  The articleData function has an article as parameter, which is used to pass in
  the array of article objects. These articles are then saved in an array as a
  new property on the ctx object and call the next callback, articlesController.index.

  The findWhere method on our Article object, accepts field, value, and callback
  as parameters using the context object in order to get the id from our current
  url params.*/

  articlesController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };

    Article.findWhere('id', ctx.params.id, articleData);
  };

  // DONE - COMMENT: What does this method do?  What is it's execution path?

  /*This method load articles by author, which also saves our articles array as
  a new property on page.js that passes 2 params - ctx and next.

  The authorData function accepts a paramater, articlesByAuthor, which saves the
  articles array as a new property on the ctx object and call the next callback,
  articlesController.index in route.js.

  The findWhere method is used to get our author data from the database by accessing
  the author/data from our articles table.  We are using the context object in order
  to retrieve the author name from the current url params.*/

  articlesController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData);
  };

  // DONE - COMMENT: What does this method do?  What is it's execution path?

  /*This method loads articles by category. The categoryData function accepts
  articlesInCategory as its param to pass in our array of article objects.
  We then save our articles array as a new property on the ctx object and call
  the next callback, articlesController.index in route.js.

  The findWhere method is used to get the category data from the articles database.
  To grab the category name from our current url params by using the context object.*/

  articlesController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // DONE - COMMENT: What does this method do?  What is it's execution path?

  /*This method loads or saves all of the articles from the database.
  The articleData function has allArticles as param used to pass in our array
  of article objects. The articles array is saved as a new property on the ctx
  object and call the next callback- articlesController.index in route.js.

  If it finds any articles in the Article.all[] then it places all the articles
  in the ctx.articles property otherwise it will try to fill the Article.all[]
  and then populates the ctx.articles property. */

  articlesController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.all;
      next();
    };

    if (Article.all.length) {
      ctx.articles = Article.all;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };


  module.articlesController = articlesController;
})(window);
