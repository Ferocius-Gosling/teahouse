var Table = require('../models/table');
var console = require('console');
var Reservation = require('../models/reservation')
var async = require('async');
// var console = require('console');
// var mailSender = require('../mail/mailSender');

exports.table_reserve_accept_get = function(req, res, next) {
    async.parallel({
        reservation: function(callback){
            Reservation.findById(req.params.id)
            .populate('table')
            .populate('date')
            .exec(callback);
        }
    }, function(err, results){
        if(err) {return next(err);}
        if (results.reservation == null) { // No results.
            var err = new Error('Бронь не найдена');
            err.status = 404;
            return next(err);
        }
        console.log(results.reservation.table);
        Table.findById(results.reservation.table)
        .populate('datesReservation')
        .exec(function(err, tab) {
            if (err) {return next(err);}
            
            tab.datesReservation.push(results.reservation.date);
            tab.save(function(err, table) {
                if (err) {return next(err); }
        });
        });
        
        results.reservation.remove(function(err, reservation) {
            if (err) {return next(err); }

            res.render('reserve_confirm', {title: "Подтверждение"});
            });
        })
}
