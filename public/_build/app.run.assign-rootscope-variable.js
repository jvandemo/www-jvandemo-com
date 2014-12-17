(function () {

  angular.module('app')
    .run(assignToRootScope);

  /**
   * Assign global services to $rootScope for convenient access
   */
  function assignToRootScope($rootScope, $state) {
    $rootScope['$state'] = $state;
  }

  // Inject dependencies;
  assignToRootScope.$inject = ['$rootScope', '$state'];

})();