var express = require('express');
var router = express.Router();

// Требующиеся модули контроллеров.
var dish_controller = require('../controllers/dishController');
var table_controller = require('../controllers/tableController');

/// BOOK ROUTES МАРШРУТЫ КНИГ///

// GET catalog home page.
router.get('/', dish_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
// GET запрос для создания книги. Должен появиться до маршрута, показывающего книгу(использует id)
router.get('/menu', dish_controller.dish_list);

// GET request for one Book.
router.get('/menu/:id', dish_controller.dish_detail);

// GET request to delete Book.
router.get('/reservations', table_controller.table_list);

// POST request to delete Book.
router.get('/reservations/table/:id', table_controller.table_detail);

// GET request to reserve table.
router.get('/reservations/table/:id/reserve', table_controller.table_reserve_get);

 // POST request to update Book.
router.post('/reservations/table/:id/reserve', table_controller.table_reserve_post);

module.exports = router;
