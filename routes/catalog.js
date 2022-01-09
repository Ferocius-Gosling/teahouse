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

// // GET request for one Book.
// router.get('/book/:id', book_controller.book_detail);

// // GET request for list of all Book items.
// router.get('/books', book_controller.book_list);

// /// AUTHOR ROUTES ///

// // GET request for creating Author. NOTE This must come before route for id (i.e. display author).
// // GET-запрос для создания автора. Должен появиться до маршрута для id (для вывода автора)
// router.get('/author/create', author_controller.author_create_get);

// // POST request for creating Author.
// router.post('/author/create', author_controller.author_create_post);

// // GET request to delete Author.
// router.get('/author/:id/delete', author_controller.author_delete_get);

// // POST request to delete Author.
// router.post('/author/:id/delete', author_controller.author_delete_post);

// // GET request to update Author.
// router.get('/author/:id/update', author_controller.author_update_get);

// // POST request to update Author.
// router.post('/author/:id/update', author_controller.author_update_post);

// // GET request for one Author.
// router.get('/author/:id', author_controller.author_detail);

// // GET request for list of all Authors.
// router.get('/authors', author_controller.author_list);

// /// GENRE ROUTES ///

// // GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
// // GET-запрос для создания жанра. Должен появиться до маршрута, выводящего жанр (( с использованием id)
// router.get('/genre/create', genre_controller.genre_create_get);

// //POST request for creating Genre.
// router.post('/genre/create', genre_controller.genre_create_post);

// // GET request to delete Genre.
// router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// // POST request to delete Genre.
// router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// // GET request to update Genre.
// router.get('/genre/:id/update', genre_controller.genre_update_get);

// // POST request to update Genre.
// router.post('/genre/:id/update', genre_controller.genre_update_post);

// // GET request for one Genre.
// router.get('/genre/:id', genre_controller.genre_detail);

// // GET request for list of all Genre.
// router.get('/genres', genre_controller.genre_list);

// /// BOOKINSTANCE ROUTES ///

// // GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
// // GET-запрос для создания экземпляра книги. Должен появиться до маршрута, выводящего BookInstance с использованием id
// router.get('/bookinstance/create', book_instance_controller.bookinstance_create_get);

// // POST request for creating BookInstance.
// router.post('/bookinstance/create', book_instance_controller.bookinstance_create_post);

// // GET request to delete BookInstance.
// router.get('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_get);

// // POST request to delete BookInstance.
// router.post('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_post);

// // GET request to update BookInstance.
// router.get('/bookinstance/:id/update', book_instance_controller.bookinstance_update_get);

// // POST request to update BookInstance.
// router.post('/bookinstance/:id/update', book_instance_controller.bookinstance_update_post);

// // GET request for one BookInstance.
// router.get('/bookinstance/:id', book_instance_controller.bookinstance_detail);

// // GET request for list of all BookInstance.
// router.get('/bookinstances', book_instance_controller.bookinstance_list);

module.exports = router;