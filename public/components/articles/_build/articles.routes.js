(function () {

  angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {

      $stateProvider
        .state('articles', {
          abstract: true,
          url: '/articles'
        })
        .state('articles.index', {
          url: '/',
          views: {
            'content@': {
              templateUrl: '/components/articles/index.html'
            }
          }
        })
        .state('articles.article', {
          url: '/:slug/index.html',
          resolve: {

          },
          views: {
            'content@': {
              templateUrl: resolveArticleTemplateUrl
            }
          }
        });

      /**
       * Resolve the template url from the slug
       *
       * @param $stateParams
       * @returns {string}
       */
      function resolveArticleTemplateUrl($stateParams){
        return '/components/articles/' + $stateParams.slug + '/index.html';
      }

      resolveArticleTemplateUrl.$inject = ['$stateParams'];

    }]);

})();
