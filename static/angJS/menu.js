var app=angular.module("menuApp", []);
app.controller('menuCtrl', function($scope,$http){
	
	$http({
	method: 'GET',
	url: '/menu',

	}).then(function successCallback(response) {
	$scope.menu=response.data

	}, function errorCallback(response) {
	$scope.menu= []
	});

	$scope.msg = "Menu"

$scope.updateMenu=function(item){
		$http({
	method: 'POST',
	url: '/updateMenu',
	data: item

	}).then(function successCallback(response) {
	$scope.msg="Updated the menu!"

	}, function errorCallback(response) {
	$scope.menu=[]
	});
}
})