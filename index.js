const SlackBot = require('slackbots');
const axios = require('axios')
const pingmydyno = require('pingmydyno');
require('dotenv').config();

const quotes = require("./encourageQuotes.js")

const bot = new SlackBot({
    token: `${process.env.API}`,
    name: 'SaltBot'
})

// Start Handler
bot.on('start', () => {
    const params = {
        icon_emoji: ':robot_face:'
    }

    bot.postMessageToChannel(
        'saltbottesting',
        ':zap: App started :robot_face:',
        params
    );
})

// Error Handler
bot.on('error', (err) => {
    console.log(err);
})

// Message Handler
bot.on('message', (data) => {
    if(data.type !== 'message') {
        return;
    }
        console.log("Message received")
        handleMessage(data);
})

// Response Handler
function handleMessage(data) {
    if(data.text.includes(' inspire me')) {
        inspireMe(data.user)
    } else if(data.text.includes(' random joke')) {
        randomJoke()
    } else if(data.text.includes(' help')) {
        runHelp()
    } else if(data.text.includes("encourage")) {
        encUser(data.user)
    } else if (data.text.includes("boots")) {
        sendBootsToUser(data.user);
    } else if (data.text.includes("users")) {
        bot.getUsers().then(data => console.log(data))
    } else if (data.text.includes("pomodoro")) {
        pomodoro(data.user)
    } else if (data.text.includes("dadjoke")) {
        dadJokes(data.user);
    }
}

function pomodoro(userId) {

    const minute = 60000;

    bot.postMessage(userId, "Pomodoro timer set for 25 minutes - time to start working, Champion :trophy:")

    setTimeout(() => {
        bot.postMessage(userId, "Time to take a break!")
    }, 25 * minute)
}

function sendBootsToUser(userId) {
    bot.postMessage(userId, "https://easyupload.io/8bcch8")
}

function encUser(userId) {
    const random = Math.floor(Math.random() * quotes.length);
    bot.postMessage(userId, quotes[random])
}

// Dad jokes please

const dadJokes = (userId) => {

    console.log("Userid: ", userId)

    axios({
        "method":"GET",
        "url":"https://dad-jokes.p.rapidapi.com/random/jokes",
        "headers":{
        "content-type":"application/octet-stream",
        "x-rapidapi-host":"dad-jokes.p.rapidapi.com",
        "x-rapidapi-key":"ab6f131638mshd9ccda499375f86p1a3471jsnb7698b37e834",
        "useQueryString":true
        }
        })
        .then((response)=>{  
          bot.postMessage("saltbottesting", response.data.setup)
          setTimeout(() => {
              bot.postMessage("saltbottesting", response.data.punchline)
          }, 7000)
        })
        .catch((error)=>{
          console.log(error)
        })
}
   
// inspire Me
function inspireMe(userId) {
    axios.get('https://raw.githubusercontent.com/BolajiAyodeji/inspireNuggets/master/src/quotes.json')
      .then(res => {
            const quotes = res.data;
            const random = Math.floor(Math.random() * quotes.length);
            const quote = quotes[random].quote
            const author = quotes[random].author

            const params = {
                icon_emoji: ':male-technologist:'
            }
        
            bot.postMessage(
                "saltbottesting",
                `:zap: ${quote} - *${author}*`,
                params
            );

      })
}

// Random Joke
function randomJoke() {
    axios.get('https://api.chucknorris.io/jokes/random')
      .then(res => {
            const joke = res.data.value;

            const params = {
                icon_emoji: ':smile:'
            }
        
            bot.postMessageToChannel(
                'saltbottesting',
                `:zap: ${joke}`,
                params
            );

      })
}

// Show Help
function runHelp() {
    const params = {
        icon_emoji: ':question:'
    }

    bot.postMessageToChannel(
        'saltbottesting',
        `Type *@saltbot* with *encourage* to get motivational quotes sent by pm -- type @saltbot with *boots* to get a download link for the boots document or *inspire me* to get an inspiring techie quote, *random joke* to get a Chuck Norris random joke and *help* to get this instruction again`,
        params
    );
}


// Slack App directory submission 302 server
/* const http = require('http');
const fs = require('fs');
 
http.createServer(function (req, res) {
    
    if (req.url == '/') {
        res.writeHead(302, { "Location": "https://" + 'slack.com' });
        return res.end();
    } else {
        fs.readFile(req.url.substring(1),
            function(err, data) { 
                if (err) throw err;
                res.writeHead(200);
                res.write(data.toString('utf8'));
                return res.end();
        });
    } 
}).listen(`${process.env.PORT}`, () => {
    pingmydyno('https://inspirenuggets-slackbot.herokuapp.com/');
}); */