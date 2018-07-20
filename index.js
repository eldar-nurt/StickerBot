const Discord = require('discord.js');
const client = new Discord.Client();
client.login('NDY5NTIxNDUzNDE5NTkzNzQw.DjI7eg.chTwkchiBJGoB80DGcF_PUpFMc4');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

function getSticker(stickerName){
    const sticker = db
                        .get(stickerName)
                        .value()
    return sticker;
};

function checkSticker (stickerName){
    const checkresult = db
                        .has(stickerName)
                        .value()
    return checkresult;
};

function addSticker(NameSticker,Sticker){
    db.set(NameSticker,Sticker)
    .write()
}

function removeSticker (stickerName){
    db.unset(stickerName)
    .write()
}

function stickersList (){
    const stickeslist = db
                        .keys()
                        .value()
    return stickeslist;
};

function isValidUrl(url){
  var objRE = /(^https?:\/\/)?[a-z0-9~_\-\.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/i;
  return objRE.test(url);
}

client.on('message', message => {
    if(message.author.bot) return;
    if(message.content.indexOf('!') !== 0) return;
    let userMessage = message.content.replace(/\s+/g, ' ');
    let msgArr = userMessage.split(' ');
    let msg = msgArr[0];
    if (msg === '!s'){
        if (checkSticker(msgArr[1])){
            message.reply(msgArr[1])
            message.channel.send({files: [getSticker(msgArr[1])]});
        }
        else{
            message.reply('Стикера ' + msgArr[1] + ' не существует');
        }
    }

    if (msg === '!add'){
        if(message.member.roles.find('name', 'elite') && msgArr.length >= 2 && isValidUrl(msgArr[2])){
            if (checkSticker(msgArr[1])){
                message.reply('стикер c таким названием существует');
            }
            else{
                addSticker(msgArr[1], msgArr[2]);
                message.reply('стикер добавлен');
            }
        }
        else{
            message.reply('у вас нет прав, или не выполнены условия');
        }
    }

    if (msg === '!remove'){ 
        if(message.member.roles.find('name', 'elite') && checkSticker(msgArr[1])){
            removeSticker(msgArr[1]);
            message.reply('стикер удален');
        }
        else{
            message.reply('у вас нет прав, или такого стикера нет');
        }
    }

    if (msg === '!list'){ 
        message.author.send(stickersList());
    }

    if (msg === '!help'){ 
        message.author.send('!s [название стикера] - отправить стикер \n !add [название стикера] [ссылка на картинку] - добавить стикер (требуются права) \n !remove [название стикера] - удалить стикер (требуются права) \n !list - список имен стикеров')
    }
});


