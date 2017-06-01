var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

const DATABASE_URL = "mongodb://localhost/pizzeria";

// ingrédients
var schemaIngredient = new Schema({
    name: {type: String, unique: true}
});
var Ingredients = mongoose.model('Ingredient', schemaIngredient);

// pizzas
var schemaPizza = new Schema({
    name: {type: String, unique: true},
    price: Number,
    ingredients: [{type: Schema.Types.ObjectId, ref: 'Ingredient'}]
});
var Pizzas = mongoose.model('Pizza', schemaPizza);

module.exports = {
    connectDB: function () {
        mongoose.connect(DATABASE_URL);
    },

    dropDataBase: function () {
        return new Promise(function (resolve, reject) {
            var nbCollectionToDrop = 2;

            Pizzas.remove({}, function (err) {
                if (err) {
                    reject(err);
                }
                nbCollectionToDrop--;
                if (nbCollectionToDrop === 0) {
                    resolve(true);
                }
                console.log('collection pizzas drop !!!');
            });

            Ingredients.remove({}, function (err) {
                if (err) {
                    reject(err);
                }
                nbCollectionToDrop--;
                if (nbCollectionToDrop === 0) {
                    resolve(true);
                }
                console.log('collection ingredients drop !!!');
            });
        });
    },

    getAllIngredientsAction: function () {
        var query = Ingredients.find();
        query.sort('name');

        return query.exec();
    },
    getIngredientsByNameAction: function (name) {
        var query = Ingredients.findOne({name: name});
        return query.exec();
    },
    addIngredientAction: function (ingredient) {
        var ingredientModel = new Ingredients({name: ingredient.name});

        return ingredientModel.save();
    },
    deleteIngredientAction: function (idIngredient) {
        return Ingredients.remove({'_id': idIngredient}).exec();
    },

    getAllPizzasAction: function () {
        var query = Pizzas.find();

        query
            .populate({
                path: 'ingredients',
                select: 'name',
                options: {sort: {name: -1}}
            })
        ;

        return query.exec();
    },
    getPizzaAction: function (idPizza) {
        var query = Pizzas.findOne();

        query
            .where('_id')
            .equals(idPizza)
            .populate({
                path: 'ingredients',
                select: 'name',
                options: {sort: {name: -1}}
            })
        ;

        return query.exec();
    },

    addPizzaAction: function (pizza) {
        var pizzaModel = new Pizzas({
            name: pizza.name,
            price: pizza.price,
            ingredients: pizza.ingredients.slice()
        });

        return pizzaModel.save();
    },
    deletePizzaAction: function (idPizza) {
        return Pizzas.remove({'_id': idPizza}).exec();
    }
};