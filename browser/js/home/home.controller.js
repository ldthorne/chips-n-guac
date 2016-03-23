app.controller('HomeCtrl', function ($http, $scope) {
  $scope.submitted = false;

  $scope.successful = false;
  $scope.send = function (user) {
    $scope.successful = false;
    $scope.error = false;
    $scope.submitted = true;
    const data = {
      fName: user.firstName,
      lName: user.lastName,
      phone: user.phone
    }
    $http.post('/api/chipotle', data)
      .then(function (res) {
        console.log(res)
        $scope.submitted = true;
        $scope.successful = 'Nice, ' + user.firstName + '! Your coupon should arrive to your phone (' + user.phone + ') in 5-10 minutes. \n\nIf you\'ve already submitted before, this probably won\'t work, but I was too lazy to do some more serious error handling.';
      	$scope.successPic = '/success.png'
      }).catch(function (err) {
        console.log(err)
        $scope.submitted = false;
        $scope.error = err.data.error
      	$scope.errorPic = '/error.png'
      })
  }
})