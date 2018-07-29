var total=0
var app=angular.module("cartApp",[]);
app.controller('cartCtrl', function($scope,$http,$window){
    // Q1) add two more pizza objects 
    $http({
  method: 'GET',
  url: '/menu'
}).then(function successCallback(response) {
    $scope.pizzas=response.data
  }, function errorCallback(response) {
    $scope.pizzas=[]
  });
   
    $scope.phone=""
    $scope.email=""
    $scope.msg="Items in cart"
    // add two variables: cart, and total for web page cart.html
 	$scope.cart=JSON.parse(localStorage.getItem("cart"))
    if($scope.cart==null)
    {
        $scope.cart=[]
        $scope.total=0.0
        $scope.numItems=0
    }
    else
    {
        $scope.numItems=$scope.cart.reduce((total, item) => total + item.quantity,0)
        //update totalPrice in Q5
    }


//Q2: addToCart() function
$scope.addToCart=function(item){
    let index=$scope.cart.findIndex(x=>x.pizzaName==item.pizzaName)
    if(index==-1)//-1 means item is not in the cart
    {
        item.quantity=1
        //item has 4 properties: name, price, image, and quantity
        $scope.cart.push(item)
    }
    else
        $scope.cart[index].quantity+=1

    $scope.numItems+=1
    localStorage.setItem("cart", JSON.stringify($scope.cart))
    //store cart locally, so every wweb page can access it locally
}

//Q3: removeFromCart() function
$scope.removeFromCart=function(item){/*
    let index=$scope.cart.findIndex(x=>x.name==item.name)
    if(item.quantity==0)//-1 means item is not in the cart
    {
        localStorage.removeItem("cart")
        document.getElementById("total").innerHTML = '';
		
    }
    else
    {
        $scope.cart[index].quantity-=1
        $scope.numItems-=1
        $scope.total = $scope.total-item.price
        document.getElementById("total").innerHTML = '$' + $scope.total;
    }*/
	var index=$scope.cart.indexOf(item);
	$scope.cart[index].quantity--;
	if($scope.cart[index].quantity==0)
	{
		$scope.cart.splice(index,1);
	}
	localStorage.setItem("cart", JSON.stringify($scope.cart))
	$scope.calcTotalPrice();
}

//Q4: clearCart() function
$scope.clearCart=function(){
    //clear cart, numItems, and local storage
    $scope.cart.splice(0, $scope.numItems)
    $scope.numItems=0
    $scope.total=0
    localStorage.clear()
}

//Q5: calcTotalPrice() function
$scope.calcTotalPrice=function(){
	var total = 0;
    for(var i in $scope.cart){
        if($scope.cart[i].quantity > 1){
            total += $scope.cart[i].price*$scope.cart[i].quantity
        }
        else
            total+= $scope.cart[i].price
    }

    $scope.total = total
    document.getElementById("total").innerHTML = '$' + total;
}

//checkout function: redirect to checkout.html	
$scope.checkout=function(){
    $window.location.href="checkout.html"
}

//placeOrder: send cart, phone and email to the server. 
$scope.placeOrder=function(){
    /*var checkoutData={
		customerID: $scope.phone,
		email: $scope.email,
		cart: $scope.cart
	}*/
	var checkoutData = [
    $scope.cart,
    [
        {
            customerID: $scope.phone,
        }
    ]
]
    //checkoutData.push($scope.cart)
    //checkoutData.push([{customerID:$scope.phone},{email:$scope.email}])

    $http({
  method: 'POST',
  url: '/placeOrder',
  data:checkoutData
  //place order on server side
}).then(function successCallback(response) {
    $scope.msg="Your order has been recieved!"
    $scope.clearCart()
  }, function errorCallback(response) {
    $scope.msg="Server is not available, try again later."
  });
}
   
})