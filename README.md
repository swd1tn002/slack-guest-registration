# Slack guest registration demo

This is a proof-of-concept serverless guest registration application implemented with Azure functions. The two Azure functions provide a list of users on a workspace and a way of notifying a single user about an arriving guest with a private message.

## Requirements

* Slack workspace where the bot can see users and send messages
* Azure account for creating a functions app
* Node.js 12
* PowerShell for publishing the application


## Setting up the Slack bot

Create a new Slack app at https://api.slack.com/start/overview. You will need two OAuth scopes for your application:

OAuth scope | Usage
------------|-------
users:read  | Get the list of users in your workspace
chat:write  | Post a message about an arriving guest

You need to also "install" the app in your Slack workspace. After installation, you will be presented with a **"Bot User OAuth Access Token"**. This token needs to be copied to your Azure account as well as your `local.settings.json` file.


## Local settings

Create a new file `local.settings.json` with the following contents in your project root:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "{AzureWebJobsStorage}",
    "SLACK_TOKEN": COPY_THE_SLACK_TOKEN_HERE
  }
}
```

This file contains the secret token for authenticating your bot and **must not be included in your Git repository**.


## Setting up Azure functions app

Create a new Azure function app at https://portal.azure.com/. The demo app runs on recommended settings with Node.js runtime stack (Node.js version 12).

Set the Slack bot token in a configration variable `SLACK_TOKEN` in the portal: `Home > All resources > name-of-your-functions-app > Configuration`.


## Command line usage

To use the Azure functions command line tools, install the tools with NPM. Note that as of writing the most recent build of `azure-functions-core-tools` crashed when publishing, while the older version `2.7.1575` works properly:

```
> npm install -g azure-functions-core-tools@2.7.1575
```


## Start the local development server

Run the following command in the project root directory:

```
> func start
```

The function runtime will make two API endpoints available locally:

> Http Functions:
>
>        GetUsers: [GET,POST] http://localhost:7071/api/GetUsers
>
>        SendGuestNotification: [GET,POST] http://localhost:7071/api/SendGuestNotification


## GetUsers

`GetUsers` API endpoint is used for getting all users on the Slack workspace:

```
> curl -s -X GET http://localhost:7071/api/GetUsers
```

The resulting response includes ids, usernames, real names and profile pictures:

```json
[
  {
    "id": "UUJ818QJA",
    "name": "user1",
    "real_name": "Users Real Name",
    "image": "https://secure.gravatar.com/avatar/abcd.png"
  },
  {
    "id": "UUJ818QJQ",
    "name": "user2",
    "real_name": "Users Real Name",
    "image": "https://secure.gravatar.com/avatar/abcd.png"
  }
]
```

The `id` of each user can be used for sending a notification for that user about an arriving guest with the next endpoint.

## SendGuestNotification

Call the following URL with an `id` parameter to send a notification about an arriving guest:

```
> curl -s -X GET http://localhost:7071/api/SendGuestNotification?id=UUJ818QJQ
```

If sending the private Slack message succeeds, the endpoint will response with the following JSON object:

```json
{
  "ok": true
}
```

## Publish to cloud

If you haven't already, install the Azure PowerShell module and connect it to your Azure account using the following commands:

```
> Install-Module -Name Az -AllowClobber -Scope CurrentUser
> Connect-AzAccount
```

Then, use the core tools to publish your functions in Azure:

```
> func azure functionapp publish slack-guest-registration
```

Replace *slack-guest-registration* with the function app name you defined in Azure Portal.
