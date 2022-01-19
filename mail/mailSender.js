const mailer = require('nodemailer');

var transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS
    }
});

var configureMessageOptions = function(to, position, id) {
    return {
        from: '"Чайная" <titovstepan.shpora@gmail.com>',
        to: to,
        subject: 'Бронь столика',
        text: "Вы хотели забронировать столик " + position + 
        ". \n Для этого перейдите по ссылке https://teahousedragon.herokuapp.com/catalog/reservations/confirm/" + id,
        html:  "<p>Вы хотели забронировать столик <strong>" + position + "</strong>.\n" 
        +". \n Для этого перейдите по ссылке https://teahousedragon.herokuapp.com/catalog/reservations/confirm/" + id + "</p>"
    }
};

module.exports.transporter = transporter;
module.exports.configureMessageOptions = configureMessageOptions;