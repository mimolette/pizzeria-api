var express = require('express');
var mongodb = require('../db');

var router = express.Router();

// page d'index, la liste de toutes les pizzas
router.get('/pizzas', function (req, res) {
    mongodb.getAllPizzasAction()
        .then(function (pizzas) {
            res.json(pizzas);
        })
        .catch(function (err) {
            console.log(err)
        })
});

// page d'ajout d'une pizza
router.post('/pizzas', function (req, res) {
    var pizzaObj = req.body;

    mongodb.addPizzaAction(pizzaObj)
        .then(function (pizza) {
            mongodb.getPizzaAction(pizza._id)
                .then(function (pizza) {
                    res.json(pizza);
                })
        })
        .catch(function (err) {
            res.status(500).json({error: "La pizza " + pizzaObj.name + " existe déja !"});
        });
});

// page d'edition d'une pizza
router.put('/pizzas', function (req, res) {
    var pizzaObj = req.body;
    mongodb.editPizzaAction(pizzaObj)
        .then(function () {
            mongodb.getPizzaAction(pizzaObj._id)
                .then(function (pizza) {
                    res.json(pizza);
                })
        })
        .catch(function (err) {
            res.status(500).json({error: "La pizza " + pizzaObj.name + " existe déja !"});
        });
});

// page de suppression d'une pizza
router.delete('/pizzas/:id', function (req, res) {
    var idPizza = req.params.id;
    if (idPizza && idPizza !== '') {
        mongodb.deletePizzaAction(idPizza)
            .then(function (result) {
                res.json({success: true});
            })
            .catch(function (err) {
                console.error(err);
            })
    } else {

    }
});

module.exports = router;