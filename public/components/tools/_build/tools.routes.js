(function () {

  angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {

      $stateProvider
        .state('tools', {
          url: '/tools',
          views: {
            'content@': {
              templateUrl: '/components/tools/index.html'
            }
          }
        });

    }]);

})();
