(function () {

  /**
   * Scroll to top when state changes
   */
  function scrollToTopOnStateChange($window, $rootScope){

    // Update UI when state changes
    $rootScope.$on('$stateChangeSuccess', function () {

      // Jump to top
      angular.element($window).scrollTop(0);
    });
  }

  // Inject dependencies
  scrollToTopOnStateChange.$inject = ['$window', '$rootScope'];

  // Export
  angular.module('app')
    .run(scrollToTopOnStateChange);

})();
