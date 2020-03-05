const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const channel = req.query.id;
    const SLACK_TOKEN = process.env['SLACK_TOKEN'];

    let response = await fetch(`https://slack.com/api/chat.postMessage`,
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + SLACK_TOKEN

            },
            body: JSON.stringify({ 
                text: 'You have a guest waiting for you!',
                channel: channel
            })
        });

    let json = await response.json();

    context.log(json);

    context.res = {
        body: {
            ok: json.ok
        }
    };
};