var Table = require('../models/table');
var Reservation = require('../models/reservation')
var async = require('async');
// var console = require('console');
// var mailSender = require('../mail/mailSender');

exports.table_reserve_accept_get = function(req, res, next) {
    async.parallel({
        reservation: function(callback){
            Reservation.findById(req.params.id)
            .populate('table')
            .populate('datesReservation')
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

        results.reservation.table.datesReservation.push(results.reservation.date);
        results.reservation.table.save(function(err, table) {
            if (err) {return next(err); }
        });
        
        results.reservation.remove(function(err, reservation) {
            if (err) {return next(err); }
            mailSender.transporter.sendMail(
                mailSender.configureMessageOptions(req.body.email, results.table.position)
            )
            res.render('reserve_confirm', {title: "Подтверждение"});
            });
        })
}