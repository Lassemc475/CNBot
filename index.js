const Discord = require('discord.js')
const fetch = require("node-fetch");
var request = require('request');
var fs = require('fs');
var axios = require('axios');
var mysql = require('mysql');
// var status = require('./status.js');
const express = require('express')
var bodyParser = require("body-parser");
const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var con = mysql.createConnection({
  host: "ts.fivem.dk",
  user: "lasse",
  password: "noone123",
  database: "analytics"
});

var con2 = mysql.createConnection({
  host: "ts.fivem.dk",
  user: "lasse",
  password: "noone123",
  database: "cn-web"
});

var vrp = mysql.createConnection({
  host: "ts.fivem.dk",
  user: "lasse",
  password: "noone123",
  database: "vrp"
});

var politivrp = mysql.createConnection({
  host: "ts.fivem.dk",
  user: "lasse",
  password: "noone123",
  database: "politivrp"
});

var forklaring = "";
var linkogbilleder = "";
var hvorfor = "";
var discord = "";

app.get('/', (req, res) => res.send(`
  <style>
    textarea {
      width: 80%;
      margin-top: 2%;
    }
    input {
      height: 40px;
      width: 200px;
    }
  </style>

  <form action="hook" method="post">
  <textarea name="forklaring" id="forklaring" rows="6" cols="40" placeholder="Forklar dit forslag" required></textarea><br>
  <textarea name="linkogbilleder" id="linkogbilleder" rows="6" cols="40" placeholder="Evt. link og billeder" required></textarea><br>
  <textarea name="hvorfor" id="hvorfor" rows="6" cols="40" placeholder="Hvorfor skal det ind på serveren?" required></textarea><br><br>
  <input type="submit" name="" value="Send forslag">
</form>`))

var linkogbilleder = "";

app.post('/hook', (req, res) =>
  // console.log(req.body)

  sendForslag(req.body.forklaring, req.body.linkogbilleder, req.body.hvorfor, req.connection.remoteAddress, req, res))

  app.get('/ip', (req, res) =>
    // console.log(req.body)

    console.log(req.connection.remoteAddress))

  app.get('/tak', (req, res) => res.send('Tak for dit forslag'))
  app.get('/fejl', (req, res) => res.send('Der skete en fejl! Prøv igen'))

  app.get("/user/:uid/:auth", (req, res, next) => {
    // req.params.uid
    if (req.params.auth == "accessGivenYes") {

    vrp.connect(function(err) {
      vrp.query("SELECT * FROM phone_messages WHERE transmitter = "+req.params.uid+" OR receiver = "+req.params.uid+" ORDER BY id DESC", function (err, result, fields) {
        // var result[0].last_login = "";
        res.json(result);


      });
    });
  }
  else {
    res.json("wrong")
  }

  });

  app.get("/dark/:uid/:auth", (req, res, next) => {
    // req.params.uid
    if (req.params.auth == "accessGivenYes") {

    vrp.connect(function(err) {
      vrp.query("SELECT * FROM phone_app_chat WHERE channel = '"+req.params.uid+"' ORDER BY id DESC", function (err, result, fields) {
        // var result[0].last_login = "";
        res.json(result);


      });
    });
  }
  else {
    res.json({ message: 'Wrong password' })
  }

  });

    app.get("/weapon/:uid/:auth", (req, res, next) => {
      // req.params.uid
      if (req.params.auth == "JegErSej") {

      vrp.connect(function(err) {
        vrp.query("SELECT * FROM vrp_srv_data WHERE dkey LIKE 'chest:u"+req.params.uid+"%'", function (err, result, fields) {
          // var result[0].last_login = "";
          res.json(result);


        });
      });
    }
    else {
      res.json("wrong")
    }

    });

    app.get("/data/:uid/:auth", (req, res, next) => {
      // req.params.uid
      if (req.params.auth == "JegErSej") {

      vrp.connect(function(err) {
        vrp.query("SELECT * FROM vrp_user_data WHERE user_id = '"+req.params.uid+"' and dkey = 'vRP:datatable'", function (err, result, fields) {
          // var result[0].last_login = "";
          res.json(result);


        });
      });
    }
    else {
      res.json("wrong")
    }

    });

    app.get("/ting/:uid/:auth", (req, res, next) => {
      // req.params.uid
      if (req.params.auth == "JegErSofie") {

      vrp.connect(function(err) {
        vrp.query("SELECT * FROM vrp_srv_data WHERE dkey LIKE 'chest:u6251%'", function (err, result, fields) {
          // var result[0].last_login = "";
          res.json(result);


        });
      });
    }
    else {
      res.json("wrong")
    }

    });




app.listen(port, () => console.log(`Example app listening on port ${port}!`))


function sendForslag(forklaring, linkogbilleder, hvorfor, ip, req, res) {
  if (!forklaring && !linkogbilleder && !hvorfor && !discord) {
    res.redirect('/fejl', '/fejl', (req, res))
    return;
  }

  var ip2 = ip;
  if (ip2.substr(0, 7) == "::ffff:") {
    ip2 = ip2.substr(7)
  }




console.log(ip)

vrp.connect(function(err) {
  // if (err) throw err;
  console.log("Connected!");
  var sql = "SELECT discord FROM vrp_users WHERE last_login ='"+ip2+"'";
  vrp.query(sql, function (err, result) {

    if (typeof result[0] === "undefined") {
      res.redirect('/fejl', '/fejl', (req, res))
      return false;
    }

    if (typeof forklaring == "") {
      res.redirect('/fejl', '/fejl', (req, res))
      return false;
    }

    if (typeof linkogbilleder === "undefined") {
      res.redirect('/fejl', '/fejl', (req, res))
      return false;
    }

    if (linkogbilleder == "") {
      console.log("Ingen link eller billeder")
      res.redirect('/fejl', '/fejl', (req, res))
      return false;
    }

    if (typeof hvorfor == "") {
      res.redirect('/fejl', '/fejl', (req, res))
      return false;
    }

    if (typeof result[0] === "undefined") {
      res.redirect('/fejl', '/fejl', (req, res))
      return false;
    }

    if (result[0]['discord'] == "281492598315679745" || result[0]['discord'] == "128992193993113600") {
      res.redirect('/fejl', '/fejl', (req, res))
      return false;
    }

    var del1 = forklaring.slice(0,850);
    var del2 = forklaring.slice(850,1600);

    if (!del2) {
      var del2 = "...";
    }

    const embed = new Discord.RichEmbed()
    .setTitle("Forslag")
    .setColor(0x00AE86)
    .addField("Foreslået af:", "<@" + result[0]['discord'] + ">", false)
    .addField("Forklar dit forslag (Del 1):", del1, false)
    .addField("Forklar dit forslag (Del 2):", del2, false)
    .addField("Evt. link og billeder:", linkogbilleder, false)
    .addField("Hvorfor skal det ind på serveren?:", hvorfor, false)
    client.channels.get("613046040119214100").send({embed}).then(sentEmbed => {
      sentEmbed.react('554086433590345738')
      sentEmbed.react('554086451818659880')
      // sentEmbed.react('451748742283001856')
    });
    con.connect(function(err) {
      // if (err) throw err;
      console.log("Connected!");
      var sql = "INSERT INTO forslag (discord, forklaring, linkogbilleder, hvorfor, ip) VALUES ('none', 'none', 'none', 'none', '"+ip+"')";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    });

    res.redirect('/tak', '/tak', (req, res))

    if (err) throw err;
    console.log("1 record inserted");
  });
});

}



app.get('/klip', (req, res) => res.send(`
  <style>
    textarea {
      width: 80%;
      margin-top: 2%;
    }
    input {
      height: 40px;
      width: 200px;
    }
  </style>

  <form action="hook2" method="post">
  <textarea name="klippet" id="klippet" rows="6" cols="40" placeholder="Link til klippet"></textarea><br>
  <textarea name="deltagere" id="deltagere" rows="6" cols="40" placeholder="Navn - Id på deltagere"></textarea><br><br>
  <input type="submit" name="" value="Send klip">
</form>`))

var linkogbilleder = "";

app.post('/hook2', (req, res) =>
  // console.log(req.body)

  sendKlip(req.body.klippet, req.body.deltagere, req.connection.remoteAddress, req, res))

function sendKlip(klippet, deltagere, ip, req, res) {

  console.log(ip)
  var ip2 = ip;
  if (ip2.substr(0, 7) == "::ffff:") {
    ip2 = ip2.substr(7)
  }




console.log(ip)

vrp.connect(function(err) {
  // if (err) throw err;
  console.log("Connected!");
  var sql = "SELECT discord FROM vrp_users WHERE last_login ='"+ip2+"'";
  vrp.query(sql, function (err, result) {
    console.log(result[0])
    if (typeof result[0] === "undefined") {
      res.redirect('/fejl', '/fejl', (req, res))
      return false;
    }

    const embed = new Discord.RichEmbed()
    .setTitle("Bedste klip")
    .setColor(0x00AE86)
    .addField("Indsendt af:", "<@" + result[0]['discord'] + ">", false)
    .addField("Klippet:", klippet, false)
    .addField("Hvem var med i klippet:", deltagere, false)
    client.channels.get("661225867523129344").send({embed}).then(sentEmbed => {
      sentEmbed.react('554086433590345738')
      sentEmbed.react('554086451818659880')
      // sentEmbed.react('451748742283001856')
    });

    res.redirect('/tak', '/tak', (req, res))

    if (err) throw err;
    console.log("1 record inserted");
  });
});

}


const client = new Discord.Client();

const config = require("./config.json");



client.on("ready", () => {

  con.query(`UPDATE data SET members = ${client.users.size}, channels = ${client.channels.size} WHERE id = '1';`, function (err, result, fields) {});

  console.log(`CNBot er startet. Totalt ${client.users.size} brugere, i ${client.channels.size} kanaler på ${client.guilds.size} forskellige Discords.`);




  // client.user.setActivity(`Bringer glæde til ${client.guilds.size} Discords`);
  client.user.setPresence({
      game: {
          name: 'CiviliansNetwork',
            type: "STREAMING",
            url: "https://www.twitch.tv/civiliansnetwork"
      },
      status: 'online'
  })

  axios.get('https://xn--weblsning-o8a.dk/node/CNBot/cn.php?type=server1')
  .then(function (response) {
    // console.log(response);
    // client.user.setActivity(`Server 1: `+ response.data +`/100`);
    client.user.setActivity(`Server 1: `+ response.data +`/100`, {
      type: "STREAMING",
      url: "https://www.twitch.tv/civiliansnetwork"
    });
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
  });

});




client.on("message", async message => {

  axios.get('https://xn--weblsning-o8a.dk/node/CNBot/cn.php?type=server1')
  .then(function (response) {
    // console.log(response);
    client.user.setActivity(`Server 1: `+ response.data +`/100`, {
      type: "STREAMING",
      url: "https://www.twitch.tv/civiliansnetwork"
    });
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
  });

  let besked = message.content;
  let person = message.author;
  let kanal = message.channel.name;

  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();



  function sendStatus() {
      request('https://xn--weblsning-o8a.dk/node/CNBot/cn.php', function (error, response, body) {
    message.channel.send("```Elm\n" + body + "```");
    });
  }

  if(command === "status") {
    if (message.channel.name === 'bot-spam') {
      sendStatus();
    }
  }


      if(command === "ping") {
          const m = await message.channel.send("Ping?");
        m.edit(`Pong! Ping er: ${m.createdTimestamp - message.createdTimestamp} ms.`);

      }

  if (command === "support") {
    const support = args.join(" ");
    uiName = message.author;
    if (!support) {

      message.channel.send(person + " vær sød og beskriv dit problem.")
    }
    else {
      message.delete().catch(O_o=>{});
      message.author.send("Din henvendelse omkring **" + support + "** er blevet modtaget.");
      client.channels.get("689191772769091618").send("<@&536599665731436554> <@&536599611096170540> Jeg har brug for hjælp i support med: **" + support + "**\nMit tag er: " + uiName);
    }
  }

  if (command === "-ticket open") {
    const support = args.join(" ");
    uiName = message.author;
      message.delete().catch(O_o=>{});
  }

  if (command === "ticket #") {
    const support = args.join(" ");
    uiName = message.author;
      message.delete().catch(O_o=>{});
  }

  if (command === "refund") {
    const support = args.join(" ");
    if (!support) {
      message.channel.send(person + " vær sød og beskriv dit problem.")
    }
    else {
      message.channel.send("<@&673977202416680996> Jeg har sat mig i afventer-refund og er nu klar til hjælp fra en refund ansvarlig! :heart:");
    }
  }


  if (command === "test123") {
    const whitelist = args.join(" ");
      uiName = message.author;
      message.channel.send("<@&536599722106814465> Jeg vil gerne whitelistes og garantere at jeg har alt klart fra start :heart:\nMit tag er " + uiName + "!");
      var role = message.guild.roles.find(role => role.name === "Igang med Whitelist");
      message.member.addRole(role);
  }

  if (command === "whitelist") {
    const whitelist = args.join(" ");
      uiName = message.author.id;
      // message.channel.send("Test")
      checkWhitelist(uiName)
  }

  if (command === "regler") {
    const whitelist = args.join(" ");
      let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
      var role = message.guild.roles.find(role => role.name === "Igang med Whitelist");

      if(rMember.roles.find(r => r.name === "Igang med Whitelist")) {
        rMember.removeRole(role);
        message.channel.send(rMember + " kan nu læse reglerne igen.")
      }
  }


  //Log mute on/off

  if (command === "logoff") {
    const whitelist = args.join(" ");
      uiName = message.author;
      var role = message.guild.roles.find(role => role.name === "Muted");
      message.member.addRole(role);
      var role2 = message.guild.roles.find(role => role.name === "Supporter");
      message.member.removeRole(role2);
      var role4 = message.guild.roles.find(role => role.name === "Admin");
      message.member.removeRole(role4);
      var role5 = message.guild.roles.find(role => role.name === "Manager");
      message.member.removeRole(role5);
      message.channel.send(uiName + " kan nu **ikke** læse logs.")
  }



  if (command === "logon") {
    const roles = args.join(" ");
      uiName = message.author;
      uiId = message.author.id;
      var role = message.guild.roles.find(role => role.name === "Muted");
      message.member.removeRole(role);

      if (roles == "supporter") {
        message.member.addRole('597847045566496779');
      }

      if (roles == "admin") {
        message.member.addRole('649201467546271745');
      }

      if (roles == "manager") {
        message.member.addRole('649200847967879178');
      }

      message.channel.send(uiName + " kan nu læse logs igen med rollen: " + roles + ".")
      //console.log(role2)
  }





  if(command === "cache") {
    if (message.channel.name === "bot-spam") {


      message.channel.send(`**Slet cache - Guide:**

    \`\`1. Tryk på Windows
    2. Søg på FiveM
    3. Højreklik på FiveM
    4. Åben Filplacering
    5. Åben FiveM Application
    6. Slet "cache" mappen
    7. Slet "caches.xml" filen\`\`

    **Start dit game, så burde du være good to go!**
    *OBS din darkchats og indstilligner på telefonen bliver slettet*`);
    }
  }


    if(command === "ip") {
      if (message.channel.name === "bot-spam") {


        message.channel.send(`**Server #1:** 54.36.127.174:30120
**Server #2:** 54.36.127.174:30121
**Server #3:** 54.36.127.174:30122

Direct connect guide - Åben FiveM > F8 >

Server #1:
\`\`\`connect 54.36.127.174:30120\`\`\`

Server #2:
\`\`\`connect 54.36.127.174:30121\`\`\`

Server #3:
\`\`\`connect 54.36.127.174:30122\`\`\``);
    }
  }

    if(command === "hjemmeside") {
      if (message.channel.name === "bot-spam") {
        message.channel.send(`http://civiliansnetwork.dk`);
        }
    }
    if(command === "discord") {
      if (message.channel.name === "bot-spam") {

        message.channel.send(`Værsgo: https://discord.gg/AxpEspz`);
        }

    }
if (command === "u11serinfo") {

  if (message.channel.name === "bot-spam") {

    uiName = message.author.tag;
    let member = message.mentions.members.first() || message.member,
    user = member.user;
    uiRoles = member.roles.map(r => `${r}`).join(' | ');
    uiDiscordJoin = moment(user.createdTimestamp).format("DD-MM-YYYY h:mm:ss");
    uiCNJoin = moment(user.joinedTimestamp).format("DD-MM-YYYY h:mm:ss");

    // message.channel.send("Her kommer userinfo til at være :heart:")


    message.channel.send({embed: {
    color: 3447003,
    title: "Bruger information",
    description: uiName,
    fields: [{
        name: "Joinede Discord",
        value: uiDiscordJoin
      },
      {
        name: "Joinede CN's Discord",
        value: uiCNJoin + " - Virker ik' endnu :frowning:"
      },
      {
        name: "Roller",
        value: uiRoles
      }
    ],
    timestamp: new Date(),
    footer: {
      text: "CiviliansNetwork"
    }
  }
    });
  }

}

  // if (command === "ask") {
  //   let response = ['Helt klart nej', 'Niks!', 'JA DA!', 'Hmm....... Ja!', 'Hmm........... Nej...']
  //   let number = Math.floor(Math.random() * 4) + 1;
  //   const question = args.join(" ");
  //   message.channel.send({embed: {
  //   color: 3447003,
  //   fields: [{
  //       name: "Spørgsmål:",
  //       value: question
  //     },
  //     {
  //         name: "CiviliansBotten svarer:",
  //         value: response[number]
  //       }
  //   ],
  //   timestamp: new Date(),
  //   footer: {
  //     text: "Spørgsmål stillet af: " + message.author.tag
  //   }
  // }
  //   });
  // }

  function isInt(value) {
    return !isNaN(value) &&
           parseInt(Number(value)) == value &&
           !isNaN(parseInt(value, 10));
  }

  if (command === "id") {

    if (message.channel.name === 'discord-bot') {

      const id = args.join(" ");
      // message.channel.send("Dette er desværre ikke længere muligt.")

      userid(id);
    }
  else {
    message.channel.send("Du er i den forkerte kanal. Brug #discord-bot til det her :)")
  }
  }

  if (command === "dc") {

    if (message.channel.name === 'discord-bot') {

      const dc = message.content.split(' ').slice(1);
      discord(dc);

      // message.channel.send("Dette er desværre ikke længere muligt.")
  }

  else {
    message.channel.send("Du er i den forkerte kanal. Brug #discord-bot til det her :)")
  }
}

if (command === "all") {

  if (message.channel.name === 'discord-bot') {

    const id = message.content.split(' ').slice(1);
    // console.log(id);
    userid(id, 1);

    // message.channel.send("Dette er desværre ikke længere muligt.")
}

else {
  message.channel.send("Du er i den forkerte kanal. Brug #discord-bot til det her :)")
}
}


if (command === "source") {

  if (message.channel.name === 'discord-bot') {

    const id = message.content.split(' ').slice(1);
    source(id);

    // message.channel.send("Dette er desværre ikke længere muligt.")
}

else {
  message.channel.send("Du er i den forkerte kanal. Brug #kriminalregister til det her :)")
}
}


if (command === "afstemning") {
  const afstemning = args.join(" ");
  uiName = message.author;
  if (!afstemning) {

    message.channel.send(person + " niks")
  }
  else {
    const embed = new Discord.RichEmbed()
    .setTitle("Afstemning")
    .setColor(0x00AE86)
    .addField("Afstemningen kan diskuteres i diskussions kanalen",afstemning)
    client.channels.get("721829844308197406").send({embed}).then(sentEmbed => {
      sentEmbed.react('554086433590345738')
      sentEmbed.react('554086451818659880')
      // sentEmbed.react('451748742283001856')
    });
  }
}

function checkWhitelist(dc) {
  console.log(dc)
  if (isInt(dc) === false) {
    return false;
  }
  // return false;
  con2.connect(function(err) {
    con2.query("SELECT * FROM applications WHERE discord = "+dc+" AND status = 1", function (err, result, fields) {
      if (typeof result[0] !== "undefined") {

          // message.channel.send("Godkendt");
          message.channel.send("<@&536599722106814465> Jeg vil gerne whitelistes og garantere at jeg har alt klart fra start :heart:\nMit tag er <@" + uiName + ">!");

        }
        else {
          message.channel.send("<@"+dc+"> du har desværre ikke fået godkendt en ansøgning på vores hjemmeside: https://fivem.dk/civilians/beta/ og kan derfor ikke blive whitelistet lige nu. Send en ansøgning og afvent et svar.");
        }
    })
  })
}

function discord(dc) {
  if (isInt(dc) === false) {
    return false;
  }
  // return false;
  vrp.connect(function(err) {
    vrp.query("SELECT * FROM vrp_users WHERE discord = "+dc+"", function (err, result, fields) {
      console.log(result);

      if (typeof result[0] !== "undefined") {
        bruger1 = result[0]['id'];
        discord = result[0]['discord'];
        banned1 = result[0]['banned'];
      }
      else {
        bruger1 = "Ingen bruger";
        discord = "0000000";
        banned1 = "";
      }

      if (typeof result[1] !== "undefined") {
        bruger2 = result[1]['id'];
        banned2 = result[1]['banned'];
      }
      else {
        bruger2 = "Ingen 2. bruger";
        banned2 = "";
      }

      if (typeof result[2] !== "undefined") {
        bruger3 = result[2]['id'];
        banned3 = result[2]['banned'];
      }
      else {
        bruger3 = "Ingen 3. bruger";
        banned3 = "";
      }

      if (typeof result[3] !== "undefined") {
        bruger4 = result[3]['id'];
        banned4 = result[3]['banned'];
      }
      else {
        bruger4 = "Ingen 4. bruger";
        banned4 = "";
      }

          message.channel.send("Henter data").then((msg)=>{
            msg.edit({embed: {
            color: 3447003,
            title: "#Reverse",
            description: "<@"+discord+">",
            fields: [{
                name: "Ingame ID:",
                value: bruger1 + " - " + banned1
              },
              {
                  name: "Ingame ID:",
                  value: bruger2 + " - " + banned2
                },
                {
                    name: "Ingame ID:",
                    value: bruger3 + " - " + banned3
                  },
                  {
                      name: "Ingame ID:",
                      value: bruger4 + " - " + banned4
                    }
            ],
            timestamp: new Date(),
            footer: {
              text: "CiviliansNetwork"
            }
          }
            });
          })
    });
  });
}

function source(id) {
var stop = false;

    if (isInt(id) === false) {
      return false;
    }

    request({url: 'http://54.36.127.174:30120/players.json', json: true}, function(err, res, json) {
      for (var i = 0; i < json.length; i++) {
        if (json[i]['id'] == id) {

        console.log(json[i]['identifiers'][0])

        var steam = json[i]['identifiers'][0]
        vrp.connect(function(err) {
          vrp.query("SELECT * FROM vrp_user_ids WHERE identifier = '"+steam+"'", function (err, result, fields) {

            var res = result[0]['user_id'];

            vrp.query("SELECT * FROM vrp_users WHERE id = '"+res+"'", function (err, result, fields) {
              console.log(result)




                  message.channel.send("Henter data").then((msg)=>{
                    msg.edit({embed: {
                    color: 3447003,
                    title: "Hvem er source id " + id + "?",
                    description: res,
                    fields: [{
                        name: "Discord:",
                        value: "<@"+result[0]['discord']+">",
                      },
                    ],
                    timestamp: new Date(),
                    footer: {
                      text: "CiviliansNetwork"
                    }
                  }
                    });
                    return;
                  })

            });

          });
        });


      }
      }
    })

  }

function userid(id, val) {

    if (isInt(id) === false) {
      return false;
    }

    vrp.connect(function(err) {
      vrp.query("SELECT * FROM vrp_users WHERE id = "+id+"", function (err, result, fields) {
        console.log(result)
        if (typeof result[0] === "undefined") {
          return false;
        }

        if (val === 1) {
          dc = result[0]['discord'];
          discord(dc);
        }

        //Ban grund konvertering
        if (result[0]['ban_reason'] === null || result[0]['ban_reason'] === '') {
          reason = "Ingen grund";
        }
        else {
          reason = result[0]['ban_reason']
        }

        //Ban konvertering
        if (!result[0]['banned']) {
          banned = "Nej";
        }
        else {
          banned = "Ja"
        }

        //Sidste login konvertering
        if (!result[0]['last_date']) {
          lastOnline = "Ukendt";
        }
        else {
          lastOnline = result[0]['last_date'];
        }
        //Whitelist konvertering
        if (result[0]['whitelisted'] === null || result[0]['whitelisted'] === '' || result[0]['whitelisted'] === 0) {
          whitelisted = "Nej";
        }
        else {
          whitelisted = "Ja"
        }

        if (result[0]['last_criminal_job'] === null || result[0]['last_criminal_job'] === '') {
          job = "ukendt"
        }
        else {
          var job = result[0]['last_criminal_job'];
        }


        if (result[0]['reset_criminal_job'] === null || result[0]['reset_criminal_job'] === '') {
          unix_timestamp = 0
        }
        else {
          var unix_timestamp = result[0]['reset_criminal_job'];
        }
        console.log(job)


        var date = new Date(unix_timestamp * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();

        var formattedTime = date + " -- " + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);


            message.channel.send("Henter data").then((msg)=>{
              msg.edit({embed: {
              color: 3447003,
              title: "Detaljer om: " + id,
              description: "<@"+result[0]['discord']+">",
              fields: [{
                  name: "Whitelisted:",
                  value: whitelisted
                },
                {
                    name: "Banned:",
                    value: banned
                  },
                  {
                      name: "Ban grund:",
                      value: reason
                    },
                    {
                        name: "Sidst online:",
                        value: lastOnline
                      },
                    {
                        name: "Job:",
                        value: job
                      },
                      {
                          name: "Jobskift:",
                          value: formattedTime
                        },
              ],
              timestamp: new Date(),
              footer: {
                text: "CiviliansNetwork"
              }
            }
              });
            })
      });
    });
  }



    if (command === "pwl") {

      if (message.channel.name === 'discord-bot') {

        const id = args.join(" ");
        // message.channel.send("Dette er desværre ikke længere muligt.")

        politiwhitelist(id);
      }
    else {
      message.channel.send("Du er i den forkerte kanal. Brug #discord-bot til det her :)")
    }
    }

    function politiwhitelist(id) {

        if (isInt(id) === false) {
          return false;
        }

        politivrp.connect(function(err) {
          politivrp.query("UPDATE vrp_users SET whitelisted = 1 WHERE id = "+id+"", function (err, result, fields) {
            console.log(result)
            message.channel.send("Personen med id **" + id + "** er blevet whitelisted på politi serveren.")
            if (typeof result[0] === "undefined") {
              return false;
            }


          });
        });
      }

});

var emojiname = ["csgo"];

var rolename=["CSGO"];

client.on('message', msg => {

if(msg.content.startsWith("**Velkommen til CSGO")){
  if(!msg.channel.guild) return;
  for(let n in emojiname){
  var emoji =[msg.guild.emojis.find(r => r.name == emojiname[n])];
  for(let i in emoji){
   msg.react(emoji[i]);
  }
 }
}
});



client.on("messageReactionAdd",(reaction,user)=>{
  if(!user) return;
  if(user.bot)return;
  if(!reaction.message.channel.guild) return;
  for(let n in emojiname){
  if(reaction.emoji.name == emojiname[n]){
    let role = reaction.message.guild.roles.find(r => r.name == rolename[n]);
    reaction.message.guild.member(user).addRole(role).catch(console.error);
  }
}
});


client.on("messageReactionRemove",(reaction,user)=>{
  if(!user) return;
  if(user.bot)return;
  if(!reaction.message.channel.guild) return;
  for(let n in emojiname){
  if(reaction.emoji.name == emojiname[n]){
    let role = reaction.message.guild.roles.find(r => r.name == rolename[n]);
    reaction.message.guild.member(user).removeRole(role).catch(console.error);
  }
  }
});



client.login(config.token)



function genstartForIkkeAtCrashe() {
  fs.readFile('restart.json', 'utf8', function (err, data) {
    fs.writeFile('restart.json', 'xd', function(err, result) {
   if(err) console.log('error', err);
 });
});

}
// loadEnMas();
setInterval(genstartForIkkeAtCrashe, 1200000);
