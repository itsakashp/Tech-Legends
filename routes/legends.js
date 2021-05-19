const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateLegend} = require('../middleware');
const legends = require('../controllers/legends');


router.get('/',catchAsync(legends.index))

router.get('/new', isLoggedIn, legends.renderNewForm)

router.get('/:id', catchAsync(legends.details))

router.post('/new', isLoggedIn, validateLegend, catchAsync(legends.createNewLegend))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(legends.renderEditForm))

router.put('/:id', validateLegend, isLoggedIn, isAuthor, catchAsync(legends.editLegend))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(legends.deleteLegend))

module.exports = router;