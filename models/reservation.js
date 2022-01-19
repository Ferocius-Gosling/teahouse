var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var reservationSchema = new Schema(
    {
        code: { type: Number, required: true, max: 32 },
        table: { type: Schema.ObjectId, required: true },
        date: { type: Date, required: true}
    }
);

reservationSchema
    .virtual('number')
    .get(function () {
        return this.code;
    });

reservationSchema
    .virtual('url')
    .get(function () {
        return '/catalog/reservations/table/reserve/' + this._id;
    });

module.exports = mongoose.model('Reservation', reservationSchema);