const express = require('express');

const router = express.Router();

const Actions = require('../data/helpers/actionModel.js');

// GET /actions

router.get('/', (req, res) => {
    Actions.get()
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(err => {
        res.status(500).json({ error: 'Actions data could not be retrieved from the server.' });
    })
})


// GET /actions/id

router.get('/:id', validateActionId, (req, res) => {
    const action = req.action;

    Actions.get(action.id)
    .then(action => {
        res.status(200).json(action);
    })
    .catch(err => {
        res.status(500).json({ error: 'Action data could not be retrieved from the server.' });
    })
})


// DEL /actions/id

router.delete('/:id', validateActionId, (req, res) => {
    const action = req.action;

    Actions.remove(action.id)
    .then(deleted => {
        res.status(200).json(deleted);
    })
    .catch(err => {
        res.status(500).json({ error: 'Action could not be deleted from the server.' });
    })
})


// middleware

function validateActionId (req, res, next) {
    const { id } = req.params;

    Actions.get(id)
    .then(action => {
        if (action) {
            req.action = action;
            next();
        } else {
            res.status(404).json({ message: 'An action with that ID could not be found.' });
        }
    })
    .catch(err => {
        res.status(500).json({ error: 'Action data could not be retrieved from the server.' });
    })
}




module.exports = router;