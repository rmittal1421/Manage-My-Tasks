const sgmail = require ('@sendgrid/mail')
const sendGridAPIKey = process.env.SGMAILKEY

sgmail.setApiKey(sendGridAPIKey)

function sendWelcomeMessage (user) {
    sgmail.send ({
        to: user.email,
        from: 'hello@raghavmittal.ca',
        subject: 'Thank you for joining!',
        text: `Welcome to the world where tasks are managed easily ${user.name}, we are pleased to have you`,
        html: '<h1>U R PRECIOUS TO US</h1>'
    })
}

function sendLeavingMessage (user) {
    sgmail.send ({
        to: user.email,
        from: 'hello@raghavmittal.ca',
        subject: 'We are sad to see you leaving!',
        text: `Tell us the reason why are you leaving ${user.name}, we will be honoured to provide you better experience`
    })
}

module.exports = {
    sendWelcomeMessage,
    sendLeavingMessage
}