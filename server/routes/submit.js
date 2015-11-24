var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/graces_kitchen';

router.get('/recipeInfo', function(req,res,next){
    var results = [];

    pg.connect(connectionString, function (err, client) {
        var query = client.query("SELECT id FROM recipes ORDER BY id DESC LIMIT 1");

        // Stream results back one row at a time, push into results array
        query.on('row', function (row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if (err) {
            console.log(err);
        }
    });
});

router.post('/recipeInfo', function(req, res, next){

    var recipeInfo = {
        "name": req.body.name,
        "source":req.body.source
    };

    pg.connect(connectionString, function(err, client){
        client.query("INSERT INTO recipes (recipe_name, recipe_source) VALUES ($1, $2)",
            [recipeInfo.name, recipeInfo.source],
            function (err, result) {
                if (err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                }
                res.send(true);
            });
    });
});

router.delete('/recipeInfo', function(req,res,next){
    pg.connect(connectionString, function(err, client){
        client.query("DELETE FROM recipes WHERE id = (SELECT id FROM recipes ORDER BY id DESC LIMIT 1)",
            function (err, result) {
                if (err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                }
                res.send(true);
            });
    });
});

router.post('/ingredient', function(req, res, next){

    var ingredient = {
        "name": req.body.name,
        "amount":req.body.amount
    };

    pg.connect(connectionString, function(err, client){
        client.query("INSERT INTO ingredients (ingredient_name, ingredient_amount, recipe_id) VALUES ($1, $2, (SELECT id FROM recipes ORDER BY id DESC LIMIT 1))",
            [ingredient.name, ingredient.amount],
            function (err, result) {
                if (err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                }
                res.send(true);
            });
    });
});

router.delete('/ingredient', function(req,res,next){
    pg.connect(connectionString, function(err, client){
        client.query("DELETE FROM ingredients WHERE recipe_id = $1 AND ingredient_name ILIKE $2 AND ingredient_amount ILIKE $3",
            [req.query.recipeId, req.query.name, req.query.amount],
            function (err, result) {
                if (err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                }
                res.send(true);
            });
    });
});

router.post('/instruction', function(req, res, next){

    var instructions = {
        "step": req.body.step,
        "instruction":req.body.instruction
    };

    pg.connect(connectionString, function(err, client){
        client.query("INSERT INTO instructions (step, instruction, recipe_id) VALUES ($1, $2, (SELECT id FROM recipes ORDER BY id DESC LIMIT 1))",
            [instructions.step, instructions.instruction],
            function (err, result) {
                if (err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                }
                res.send(true);
            });
    });
});

router.delete('/instruction', function(req,res,next){

    console.log(req.query);
    pg.connect(connectionString, function(err, client){
        client.query("DELETE FROM instructions WHERE recipe_id = $1",
            [req.query.recipeId],
            function (err, result) {
                if (err) {
                    console.log("Error deleting data: ", err);
                    res.send(false);
                }
                res.send(true);
            });
    });
});

router.post('/categories', function(req, res, next){

    var categories = {
        "name": req.body.name,
        "id": req.body.recipeId
    };

    pg.connect(connectionString, function(err, client){
        client.query("INSERT INTO categories (categories_name, recipe_id) VALUES ($1, $2)",
            [categories.name, categories.id],
            function (err, result) {
                if (err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                }
                res.send(true);
            });
    });
});

router.get('/recipeData', function(req,res,next){

    var results = [];

    pg.connect(connectionString, function (err, client) {
        var query = client.query("SELECT instructions.step, instructions.instruction, recipes.recipe_name, recipes.recipe_source FROM instructions JOIN recipes ON recipes.id = instructions.recipe_id WHERE recipes.id = 52");

        //[req.query.id]

        // Stream results back one row at a time, push into results array
        query.on('row', function (row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if (err) {
            console.log(err);
        }
    });
});

module.exports = router;