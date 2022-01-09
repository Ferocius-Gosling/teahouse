var Table = require('../models/table');
var async = require('async');
var console = require('console');
var mailSender = require('../mail/mailSender');
const { body,validationResult } = require('express-validator');


// Показать список всех блюд.
exports.table_list = function(req, res, next) {
    Table.find()
    .populate('position')
    .exec(function (err, list_tables) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('table_list', { title: 'Список столов', table_list: list_tables });
    });
};

// Показать подробную страницу для данного блюда.
exports.table_detail = function(req, res) {
    async.parallel({
        table: function(callback){
            Table.findById(req.params.id)
            .exec(callback);
        }
    },
    function(err, results) {
        if (err) { return next(err); }
        if (results.table==null) { // No results.
            var err = new Error('Стол не найден');
            err.status = 404;
            return next(err);
        }
        res.render('table_detail', {title: 'Стол', table: results.table})
    });
};

// Display book update form on GET.
exports.table_reserve_get = function(req, res, next) {

    // Get book, authors and genres for form.
    async.parallel({
        table: function(callback) {
            Table.findById(req.params.id)
            .populate('table_num')
            .populate('position')
            .populate('datesReservation')
            .exec(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.table==null) { // No results.
                var err = new Error('Book not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            // Mark our selected genres as checked.
            // for (var all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
            //     for (var book_g_iter = 0; book_g_iter < results.book.genre.length; book_g_iter++) {
            //         if (results.genres[all_g_iter]._id.toString()==results.book.genre[book_g_iter]._id.toString()) {
            //             results.genres[all_g_iter].checked='true';
            //         }
            //     }
            // }
            res.render('table_form', { title: 'Бронь столика'});
        });
};

// Handle book update on POST.
exports.table_reserve_post = [

    // Convert the genre to an array
    // (req, res, next) => {
    //     if(!(req.body. instanceof Array)){
    //         if(typeof req.body.genre === 'undefined')
    //         req.body.genre=[];
    //         else
    //         req.body.genre=new Array(req.body.genre);
    //     }
    //     next();
    // },

    // Validate fields.
    body('time', 'Нужно выставить время')
    .trim()
    .escape(),

    body('date', 'Нужно выставить дату')
    .trim()
    .toDate()
    .escape(),
    
    body('email', 'Эта электронная почта некорректна')
    .trim()
    .isEmail()
    .normalizeEmail()
    .isLength({ min: 1 })
    .escape(),

    // Sanitize fields.
    // sanitizeBody('title').trim().escape(),
    // sanitizeBody('author').trim().escape(),
    // sanitizeBody('summary').trim().escape(),
    // sanitizeBody('isbn').trim().escape(),
    // sanitizeBody('genre.*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        // var book = new Book(
        //   { title: req.body.title,
        //     author: req.body.author,
        //     summary: req.body.summary,
        //     isbn: req.body.isbn,
        //     genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre,
        //     _id:req.params.id //This is required, or a new ID will be assigned!
        //    });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                table: function(callback){
                    Table.find(callback)
                },
            }, function(err, results) {
                if (err) { return next(err); }

                res.render('table_form', { title: 'Бронь столика', errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            async.parallel({
                table : function(callback) {
                    Table.findById(req.params.id)
                    .populate('position')
                    .populate('datesReservation')
                    .exec(callback);
                }
            }, function(err, results) {
                if(err) {return next(err);}
                var now = new Date();
                for (var i = 0; i < results.table.datesReservation.length; i++){
                    if (checkTimeBefore(results.table.datesReservation[i], now))
                        results.table.datesReservation.splice(i, 1); //удалить из массива всё что раньше этой даты.
                }
                var time = req.body.time.split(':');
                var hour = parseInt(time[0]);
                var minute = parseInt(time[1]);
                var date = new Date(req.body.date);
                date.setHours(hour + 5);
                date.setMinutes(minute);

                if (checkTimeBefore(date, now)) {
                    res.render('table_form', {title: "Бронь столика", 
                    errors: [{msg: "Нельзя забронировать столик в прошлом"}]});
                    return;
                }

                if (checkReservedDates(results.table.datesReservation, date)){
                    res.render('table_form', {title: "Бронь столика", 
                    errors: [{msg: "Столик на это время уже забронирован. Выберите другое время"}]});
                    return;
                }
                results.table.datesReservation.push(date);
                results.table.save(function(err, table) {
                    if (err) {return next(err); }
                    
                    mailSender.transporter.sendMail(
                        mailSender.configureMessageOptions(req.body.email, results.table.position)
                    )
                    
                    res.render('table_form', {title: "Бронь столика", 
                    errors: [{msg: "Столик успешно забронирован"}]});
                });
            });
        }
    }
];

var checkTimeBefore = function(dateBefore, dateAfter) {
    return dateBefore < dateAfter;
}

var checkReservedDates = function(reservedDates, dateToReserve){
    for(var i = 0; i < reservedDates.length; i++)
    {
        var reservedDatePlus = reservedDates[i].addHours(1);
        var reservedDateMinus = reservedDates[i].addHours(-1);
        console.log(reservedDateMinus, dateToReserve, reservedDatePlus);
        if (reservedDatePlus >= dateToReserve && reservedDateMinus <= dateToReserve)
            return true;
    }
    return false;
}

Date.prototype.addHours = function(h) {
    var time = this.getTime() + h * 60 * 60 * 1000;
    return new Date(time);
}