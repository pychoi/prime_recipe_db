myApp.controller('SearchController', ['$scope', function($scope){

    $scope.main = ['Beef', 'Pork', 'Chicken/Poultry', 'Lamb/Goat', 'Seafood', 'Pasta/Noodle', 'Tofu', 'Vegetables', 'Egg', 'Rice/Congee'];
    $scope.cuisine =['Chinese', 'American', 'Italian', 'Mexican', 'Japanese', 'Korean', 'Indian', 'Southeast Asian (Thai, Vietnamese, Singaporean, Malaysian)'];
    $scope.type = ['Bread', 'Dessert', 'Dim Sum', 'Soup', 'Chinese Festival', 'BBQ', 'Herbal Medicine', 'Salad', 'Sauces'];

    $scope.searchRecipes = function(){
        location.href=('#recipe');
    }

}]);