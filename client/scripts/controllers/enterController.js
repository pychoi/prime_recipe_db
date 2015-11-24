myApp.controller('EnterController', ['$scope', '$http', function($scope, $http){
    console.log("EnterController is working!");

    $scope.recipeInfo = {};
    $scope.recipeId = "";
    $scope.ingredient = {};
    $scope.ingredients = [];
    $scope.categories = [];
    $scope.disable = false;
    $scope.disableInstruction = false;
    $scope.saveStepErrorMessage = false;
    $scope.noStepErrorMessage = false;
    $scope.checkIngredient = true;

    // $scope.steps array contains all step numbers and corresponding instructions as objects
    $scope.steps = [{step: 1}];
    //$scope.steps = [];

    $scope.main = ['Beef', 'Pork', 'Chicken/Poultry', 'Lamb/Goat', 'Seafood', 'Pasta/Noodle', 'Tofu', 'Vegetables', 'Egg', 'Rice/Congee'];
    $scope.cuisine =['Chinese', 'American', 'Italian', 'Mexican', 'Japanese', 'Korean', 'Indian', 'Southeast Asian (Thai, Vietnamese, Singaporean, Malaysian)'];
    $scope.type = ['Bread', 'Dessert', 'Dim Sum', 'Soup', 'Chinese Festival', 'BBQ', 'Herbal Medicine', 'Salad', 'Sauces'];


    $scope.addName = function(recipeInfo){
        //$scope.accordion = 2;
        $http.post('/submit/recipeInfo', $scope.recipeInfo).then(function(){
            console.log("Recipe Info saved");
            $scope.disable = true;
            $scope.getId();
        });
    };

    $scope.getId = function(){
      $http.get('/submit/recipeInfo').then(function(response){
          console.log(response.data);
          $scope.recipeId = response.data[0].id;
      });
    };

    $scope.deleteName = function(){
        $scope.disable = false;
        $scope.recipeInfo = {};
        $http.delete('/submit/recipeInfo').then(function(){
            console.log('deleted recipe info!');
        });
    };

    $scope.addIngredient = function(){
        $scope.ingredients.push($scope.ingredient);

        $http.post('/submit/ingredient', $scope.ingredient).then(function (response) {
            //console.log(response);
            console.log("Ingredient saved");
            $scope.checkIngredient = false;
        });

        $scope.ingredient = {};
        $scope.enterIngredients.$setUntouched();
    };

    $scope.deleteIngredient = function(foo){
        $http.delete('/submit/ingredient',
            {params: {name: foo.name, amount: foo.amount, recipeId: $scope.recipeId}}).then(function(){
            for(var i = 0; i < $scope.ingredients.length; i++){
                if(foo.name == $scope.ingredients[i].name && foo.amount == $scope.ingredients[i].amount){
                    $scope.ingredients.splice(i,1);
                }
            }
                if($scope.ingredients.length < 1){
                    $scope.checkIngredient = true;
                }
        });
    };

    $scope.addNewStep = function(){
        var newItemNum = $scope.steps.length + 1;
        $scope.steps.push({step: newItemNum});
    };

    $scope.saveStep = function(foo){

        if(foo.length < 1){
            console.log("empty");
            $scope.noStepErrorMessage = true;
        } else {
            $scope.noStepErrorMessage = false;
        }

        for (var i = 0; i < foo.length; i++) {
                if(!foo[i].instruction) {
                    console.log("missing instruction");
                    $scope.saveStepErrorMessage = true;
                } else {
                    $scope.saveStepErrorMessage = false;
                    $http.post('/submit/instruction', foo[i]).then(function () {
                        $scope.disableInstruction = true;
                        console.log("instruction saved");
                    });
                }
            }

    };

    $scope.removeStep = function(foo){
        for(var i = 0; i < $scope.steps.length; i++){
            if(foo.step == $scope.steps[i].step){
                $scope.steps.splice(i,1);
            }
        }

        for(var i = 0; i < $scope.steps.length; i++){
            $scope.steps[i].step = i+1;
        }
    };

    $scope.deleteSteps = function(){
        $http.delete('/submit/instruction',
            {params: {recipeId: $scope.recipeId}}).then(function(){
                $scope.disableInstruction = false;
        });
    };


    $scope.toggleChecked = function(foo){
        if ($scope.categories.indexOf(foo) === -1){
            $scope.categories.push(foo);
        } else {
            $scope.categories.splice($scope.categories.indexOf(foo), 1);
        }
    };

    $scope.submitRecipe = function(){

        for(var i = 0; i < $scope.categories.length; i++) {
            $http.post('/submit/categories', {name: $scope.categories[i], recipeId: $scope.recipeId}).then(function(){
                $scope.getThisRecipe();
            });
        }

    };

    $scope.getThisRecipe = function(){
        $http.get('/submit/recipeData').then(function(response){
            console.log(response.data);
        });
    }

}]);