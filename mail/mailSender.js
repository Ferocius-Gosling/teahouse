const mailer = require('nodemailer');

var testAccount = mailer.createTestAccount();

var transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS
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