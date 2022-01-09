var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var dishSchema = new Schema(
    {
        name: {type: String, required: true, max: 32},
        description: {type: String, required: true, max: 128},
        price: {type: Number, required: true},
        weight: {type: Number, required: true},
        dishType: {type: String, enum: ['Tea', 'Bakery']},
        filename: {type: String, required: true}
    }
);

dishSchema
.virtual('url')
.get(function(){
    return '/catalog/menu/' + this._id;
});

dishSchema
.virtual('file')
.get(function(){
    return '/resources/' + this.filename;
})

module.exports = mongoose.model('Dish', dishSchema);