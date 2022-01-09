var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tableSchema = new Schema(
    {
        table_num: { type: Number, required: true, max: 32 },
        position: { type: String, required: true, max: 128 },
        datesReservation: [{ type: Date, required: true}]
    }
);

tableSchema
    .virtual('number')
    .get(function () {
        return this.table_num;
    });

tableSchema
    .virtual('url')
    .get(function () {
        return '/catalog/reservations/table/' + this._id;
    });

module.exports = mongoose.model('Table', tableSchema);