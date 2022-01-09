#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require('async')
var Dish = require('./models/dish')
var Table = require('./models/table')

var mongoose = require('mongoose');
const table = require('./models/table');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var dishes = []
var tables = []

function dishCreate(dish_name, description, price, weight, dishType, cb) {
    var dishTypes = ['Tea', 'Bakery'];
    dishDetail = {name: dish_name, description: description}
    if (weight > 0) dishDetail.weight = weight
    if (price > 0) dishDetail.price = price
    if (dishTypes.includes(dishType)) dishDetail.dishType = dishType
    
    var dish = new Dish(dishDetail);
         
    dish.save(function (err) {
      if (err) {
        cb(err, null)
        return
      }
      console.log('New Dish: ' + dish);
      dishes.push(dish)
      cb(null, dishes)
    });
  }

function areDatesNotCollide(dates){
    for (var i = 0; i < dates.length - 1; i++){
        if (dates[i].setHours(dates[i].getHours() + 2)  > dates[i+1])
            return false;
    }
    return true;
}
  
function tableCreate(table_num, position, dates,cb) {
    var tableDetail = { table_num: table_num, position: position };
    if (areDatesNotCollide(dates)) tableDetail.datesReservation = dates
    
    var table = new Table(tableDetail);
    
    table.save(function (err) {
      if (err) {
        cb(err, null);
        return;
      }
      console.log('New Table: ' + table);
      tables.push(table)
      cb(null, table);
    });
  }

function createDishes(cb){
    async.series([
        function(callback) { // dish_name, description, price, weight, dishType, cb
            dishCreate('Чёрный чай с бергамотом', 'Прекрасный чёрный чай с ароматом бергамота (кружка)', 75, 350, 'Tea', callback);
        },
        function(callback) {
            dishCreate('Чёрный чай с бергамотом', 'Прекрасный чёрный чай с ароматом бергамота (чайник)', 160, 950, 'Tea', callback);
        },
        function(callback) {
            dishCreate('Чёрный чай с лимоном', 'Чёрный чай без излишеств для любителей классики (кружка)', 55, 350, 'Tea', callback);
        },
        function(callback) {
            dishCreate('Чёрный чай с лимоном', 'Чёрный чай без излишеств для любителей классики (чайник)', 140, 950, 'Tea', callback);
        },
        function(callback) {
            dishCreate('Молочный улун', 'Чай с очень мягким вкусом и тонким молочным ароматом', 135, 450, 'Tea', callback);
        },
        function(callback) {
            dishCreate('Шу Пуэр', 'Сладковатый, с насыщенным ароматом, напоминающим сухофрукты', 135, 450, 'Tea', callback);
        },
        function(callback) {
            dishCreate('Жасминовый чай', 'Легендарный чай, имеющий тончайший вкус, выращенный в горах', 475, 350, 'Tea', callback);
        },
        function(callback) {
            dishCreate('Юэ Гуань Бай', 'Лёгкий белый чай, в переводе означает "Белый лунный свет", обладает тонким и сладким послевкусием', 375, 350, 'Tea', callback);
        },
        function(callback) {
            dishCreate('Сахарная булочка', 'Посыпанная сахарной пудрой, идеальное дополнение к крепкому чаю', 50, 250, 'Tea', callback);
        },
        function(callback) {
            dishCreate('Песочные рогалики', 'Лёгкая закуска к тёплому чаю', 75, 250, 'Tea', callback);
        },
        function(callback) {
            dishCreate('Булочка с корицей', 'Сладкое дополнение к чаю', 375, 350, 'Tea', callback);
        }
        ],
        // optional callback
        cb);
}

function createTables(cb) {
    async.series([
        function(callback){
            tableCreate(1, 'Недалеко от входа', [], callback);
        },
        function(callback){
            tableCreate(2, 'Ближе к входу, рядом с окном', [], callback);
        },
        function(callback){
            tableCreate(3, 'Ближе к туалету', [], callback);
        },
        function(callback){
            tableCreate(4, 'Ближе к туалету, рядом с окном', [], callback);
        },
        function(callback){
            tableCreate(5, 'В центре зала', [], callback);
        }
        ],
        cb)
}

async.series([
    createDishes,
    createTables
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err + err.stack);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});