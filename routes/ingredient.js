var express = require('express');
var mongodb = require('../db');

var router = express.Router();

// la liste de tous les ingrédients
router.get('/ingredients', function (req, res) {
    mongodb.getAllIngredientsAction()
        .then(function (ingredients) {
            res.json(ingredients);
        })
        .catch(function (err) {
            console.log(err)
        })
});

// un ingrédients par son nom
router.get('/ingredients/name/:name', function (req, res) {
    var ingredientName = req.params.name;
    if (ingredientName && ingredientName !== '') {
        mongodb.getIngredientsByNameAction(ingredientName)
            .then(function (ingredient) {
                res.json(ingredient);
            })
            .catch(function (err) {
                console.log(err)
            })
    }
});

// page d'ajout d'un ingrédient
router.post('/ingredients', function (req, res) {
    if (req.body.name && req.body.name !== '') {
        var ingredient = {name: req.body.name};
        mongodb.addIngredientAction(ingredient)
            .then(function (ingredient) {
                res.json(ingredient);
            })
            .catch(function (err) {
                console.error(err);
            })
        ;
    }
});

// page de suppression d'un ingrédient
router.delete('/ingredients/:id', function (req, res) {
    var idIngredient = req.params.id;
    if (idIngredient && idIngredient !== '') {
        mongodb.deleteIngredientAction(idIngredient)
            .then(function (result) {
                res.json({success: true});
            })
            .catch(function (err) {
                console.error(err);
            })
    }
});

module.exports = router;