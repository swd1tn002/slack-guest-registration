const fetch = require("node-fetch");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let SLACK_TOKEN = process.env['SLACK_TOKEN'];

    let response = await fetch(`https://slack.com/api/users.list?token=${SLACK_TOKEN}`);
    let json = await response.json();

    let users = json.members.filter(user => !user.is_bot && !user.deleted).map(user => {
        return {
            id: user.id,
            name: user.name,
            real_name: user.real_name,
            image: user.profile.image_512
        };
    });

    context.res = {
        status: 200,
        body: users
    };
};