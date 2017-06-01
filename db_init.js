var mongodb = require('./db');
var pizzas = require('./data_pizzeria');

mongodb.connectDB();

// drop database
mongodb.dropDataBase()
    .then(function () {
        // gestion des ingrédients
        handleIngredients()
            .then(function () {
                handlePizzas()
                    .then(function () {
                        console.log("insertions des données terminées.");
                    })
                    .catch(function (err) {
                        console.error(err);
                    })
            })
            .catch(function (err) {
                console.log(err);
            })
    })
    .catch(function (err) {
        console.error(err);
    });

function handleIngredients() {
    return new Promise(function (resolve, reject) {
        // gestion des ingrédients
        var listeIngredient = [];
        for (var ii=0, c1=pizzas.length; ii<c1; ii++) {
            var ingredients = pizzas[ii].recipe;
            for (var jj=0, c2=ingredients.length; jj<c2; jj++) {
                var name = ingredients[jj];

                var index = listeIngredient.indexOf(name);
                if (index === -1) {
                    listeIngredient.push(name);
                }
            }
        }

        // insertions des ingrédients
        var nbIngredientToInsert = listeIngredient.length;
        for (var kk=0, c3=listeIngredient.length; kk<c3; kk++) {
            var ingredientName = listeIngredient[kk];

            mongodb.addIngredientAction({name: ingredientName})
                .then(function (ingredient) {
                    nbIngredientToInsert--;
                    if (nbIngredientToInsert === 0) {
                        resolve(true);
                        console.log("ingrédients insérés !!!");
                    }
                })
                .catch(function (err) {
                    reject(err);
                })
        }
    });
}

function handlePizzas() {
    return new Promise(function (resolve, reject) {
        // création des pizzas
        nbPizzaToInsert = 0;
        for (var ii=0, c1=pizzas.length; ii<c1; ii++) {
            var pizza = pizzas[ii];

            if (pizza.type === "pizza") {
                nbPizzaToInsert++;
                handleOnePizza(pizza)
                    .then(function (pizzaObjet) {
                        mongodb.addPizzaAction(pizzaObjet)
                            .then(function (pizzaInsert) {
                                nbPizzaToInsert--;
                                if (nbPizzaToInsert === 0) {
                                    console.log("pizzas insérés !!!");
                                    resolve(true);
                                }
                            })
                            .catch(function (err) {
                                reject(err);
                            });
                    })
                    .catch(function (err) {
                        reject(err);
                    })
            }
        }
    });
}

function handleOnePizza(pizza) {
    return new Promise(function (resolve, reject) {
        var pizzaObj = {
            name: pizza.name,
            price: pizza.price,
            ingredients: []
        };

        // gestion des ingrédients
        var nbIngredientToGet = pizza.recipe.length;
        for (var jj=0, c2=pizza.recipe.length; jj<c2; jj++) {
            var ingredientName = pizza.recipe[jj];
            // recherche d'un ingrédient par ce son
            mongodb.getIngredientsByNameAction(ingredientName)
                .then(function (ingredient) {
                    pizzaObj.ingredients.push(ingredient);
                    nbIngredientToGet--;
                    if (nbIngredientToGet === 0) {
                        resolve(pizzaObj);
                    }
                })
                .catch(function (err) {
                    reject(err);
                })

        }
    });
}

