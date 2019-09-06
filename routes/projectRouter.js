const express = require('express');

const router = express.Router();

const Projects = require('../data/helpers/projectModel.js');
const Actions = require('../data/helpers/actionModel.js');

// GET /projects

router.get('/', (req, res) => {
    Projects.get()
    .then(projects => {
        res.status(200).json(projects);
    })
    .catch(err => {
        res.status(500).json({ error: 'Projects data could not be retrieved from the server' })
    })
})

// GET /projects/id

router.get('/:id', validateProjectId, (req, res) => {
    const project = req.project;

    Projects.get(project.id)
    .then(project => {
        res.status(200).json(project);
    })
    .catch(err => {
        res.status(500).json({ error: 'Project data could not be retrieved from the server' })
    })
})

// GET /projects/id/actions

router.get('/:id/actions', validateProjectId, (req, res) => {
    const project = req.project;

    Projects.getProjectActions(project.id)
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(err => {
        res.status(500).json({ error: 'Project data could not be retrieved from the server' })
    })
})


// POST /projects

router.post('/', validateProject, (req, res) => {
    const project = req.project;

    Projects.insert(project)
    .then(added => {
        res.status(201).json(added);
    })
    .catch(err => {
        res.status(500).json({ error: 'Project could not be added to server' })
    })

})


// POST /projects/id/actions

router.post('/:id/actions', validateProjectId, validateAction, (req, res) => {
    const project = req.project;
    const action = req.action;

    Actions.insert({ ...action, project_id: project.id })
    .then(added => {
        res.status(201).json(added);
    })
    .catch(err => {
        res.status(500).json({ error: 'Action could not be added to the server.' });
        console.log(action);
    })
})


// DEL /projects/id

router.delete('/:id', validateProjectId, (req, res) => {
    const project = req.project;

    Projects.remove(project.id)
    .then(deleted => {
        res.status(200).json(deleted);
    })
    .catch(err => {
        res.status(500).json({ message: 'Project could not be deleted.' });
    })
})


// PUT /projects/id

router.put('/:id', validateProjectId, (req, res) => {
    const project = req.project;
    const changes = req.body;

    if(!changes.name && !changes.description) {
        res.status(400).json({ message: 'Please update name or description field' })
    } else {

        Projects.update(project.id, changes)
        .then(updated => {
            res.status(200).json(updated);
        })
        .catch(err => {
            res.status(500).json({ error: 'Project could not be updated.' });
        })
    }



})


// middleware

function validateProjectId(req, res, next) {
    const { id } = req.params;

    Projects.get(id)
    .then(project => {
        if (project) {
            req.project = project;
            next();
        } else {
            res.status(404).json({ message: 'A project with that ID could not be found.' });        }
    })
    .catch(err => {
        res.status(500).json({ message: 'Project data could not be accessed.' });
    })
}

function validateProject(req, res, next) {
    const projectBody = req.body;

    if(!projectBody.name || !projectBody.description) {
        res.status(400).json({ message: 'Please add all required fields' })
    } else {
        req.project = projectBody;
        next();
    }
}

function validateAction(req, res, next) {
    const actionBody = req.body;

    if (!actionBody.description || !actionBody.notes) {
        res.status(400).json({ message: 'Description and notes fields are required.' });
    } else {
        req.action = actionBody;
        next();
    }
}


module.exports = router;