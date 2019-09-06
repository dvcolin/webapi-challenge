const express = require('express');

const router = express.Router();

const Projects = require('../data/helpers/projectModel.js');

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


module.exports = router;