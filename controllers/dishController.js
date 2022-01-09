var Dish = require('../models/dish');
var Table = require('../models/table');

var async = require('async');

exports.index = function(req, res) {
    async.parallel({
        dish_count: function(callback) {
            Dish.count({}, callback);
        },
        table_count: function(callback){
            Table.count({}, callback);
        },
        available_table_count: function(callback) {
            Table.count({datesReservation: []}, callback);
        }
    },
    function(err, results) {
        res.render('index', {title: 'Чайная "Жасминовый дракон"', error: err, data: results});
    });
};

// Показать список всех блюд.
exports.dish_list = function(req, res, next) {
    Dish.find({}, 'dish name')
    .sort({price : -1})
    .populate('description')
    .populate('price')
    .exec(function (err, list_dishes) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('dish_list', { title: 'Список блюд', dish_list: list_dishes });
    });
};

// Показать подробную страницу для данного блюда.
exports.dish_detail = function(req, res, next) {
    async.parallel({
        dish: function(callback){
            Dish.findById(req.params.id)
            .exec(callback);
        }
    },
    function(err, results) {
        if (err) { return next(err); }
        if (results.dish==null) { // No results.
            var err = new Error('Блюдо не найдено');
            err.status = 404;
            return next(err);
        }
        res.render('dish_detail', {title: 'Блюдо', dish: results.dish})
    });
};

// // Показать форму создания автора по запросу GET.
// exports.author_create_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: Author create GET');
// };

// // Создать автора по запросу POST.
// exports.author_create_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: Author create POST');
// };

// // Показать форму удаления автора по запросу GET.
// exports.author_delete_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: Author delete GET');
// };

// // Удалить автора по запросу POST.
// exports.author_delete_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: Author delete POST');
// };

// // Показать форму обновления автора по запросу GET.
// exports.author_update_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: Author update GET');
// };

// // Обновить автора по запросу POST.
// exports.author_update_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: Author update POST');
// };
