const mailer = require('nodemailer');

var testAccount = mailer.createTestAccount();

var transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: "titovstepan.shpora@gmail.com",
        pass: "Rfptrfutgtcrf1"
    }
});

var configureMessageOptions = function(to, position) {
    return {
        from: '"Чайная" <titovstepan.shpora@gmail.com>',
        to: to,
        subject: 'Бронь столика',
        text: "Ваш столик " + position + " успешно забронирован.",
        html:  "<p>Ваш столик <strong>" + position + "</strong> успешно забронирован.</p>"
    }
};

module.exports.transporter = transporter;
module.exports.configureMessageOptions = configureMessageOptions;