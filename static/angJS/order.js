
var app=angular.module("orderApp",[]);
app.controller('orderCtrl', function($scope,$http){
    // Q1) add two more pizza objects 
    $scope.editingData = [];
    
    $http({
      method: 'GET',
      url: '/showOrders'
  }).then(function successCallback(response) {
    $scope.orders=response.data
    for (var i = 0, length = $scope.orders.length; i < length; i++) {
      $scope.editingData[i] = false;
  }
}, function errorCallback(response) {
    $scope.orders=[]
});

  $scope.msg="Orders"
  $scope.edit = function(index){
    $scope.editingData[index] = true;
};


$scope.save = function(){
    for (var i = 0, length = $scope.orders.length; i < length; i++) {
      if( $scope.editingData[i])
        $scope.quantity=parseInt($scope.orders[i].quantity)
  }
  $http({
      method: 'POST',
      url: '/saveOrders',
      data:$scope.orders
  }).then(function successCallback(response) {

    $scope.msg="Saved!"

}, function errorCallback(response) {
    $scope.msg="Sorry, server problem, try again!"
});


  for (var i = 0, length = $scope.orders.length; i < length; i++) {
      $scope.editingData[i] = false;
  }
} 

$scope.removeOrder = function(item){
  $http({
      method: 'POST',
      url: '/removeOrder',
      data:item
  }).then(function successCallback(response) {

    $scope.msg="Deleted!"

    //$scope.orders=response.data

    $scope.orders.splice($scope.orders.indexOf(item),1);

}, function errorCallback(response) {
    $scope.msg="Sorry, server problem, try again!"
});


  for (var i = 0, length = $scope.orders.length; i < length; i++) {
      $scope.editingData[i] = false;
  }
}
$scope.searchByDate = function() {
	var datestring = $scope.orderDate
	var date = new Date(Date.parse(datestring))
	var date2 = new Date(Date.parse(datestring))
	date2.setDate(date2.getDate() + 1)
	console.log(date)
	console.log(date2)

	var query = {
		date: {
			$gte: { "$date" : date},
			$lt: { "$date" : date2}
    }
}
	
	  $http({
      method: 'POST',
      url: '/searchByDate',
      data: {date: date.valueOf()}
  }).then(function successCallback(response) {
	console.log(response)
	$scope.orders=response.data
}, function errorCallback(response) {
    $scope.msg="Sorry, server problem, try again!"
});


  for (var i = 0, length = $scope.orders.length; i < length; i++) {
      $scope.editingData[i] = false;
  }
}

   
})