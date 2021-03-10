const express = require('express');

const router = express.Router();

const models = require('../../models');

router.get('/', async function(req, res) {
    const rows = await models.Skill.findAll();
    // An object in JavaScript we can define with curly braces
    res.json(rows);
});

router.post('/', async function (req, res) {
    // Build a new Skill row in memory from the form data in the body of the request
    const row = models.Skill.build(req.body)
    try {
        // Wait for the database to save the new row
        await row.save();
        // If successful, return 201 status (CREATED), and the JSON data of the row
        res.status(201).json(row);
    } catch (error) {
        // If the database returned an error, print it to the console
        console.log(error);
        // Send back the UNPROCESSABLE ENTITY error code and the error message itself
        res.status(422).json(error);
    }
});

module.exports = router;