'use strict';

// Server-zone packets
this.chat                          = require('./chat.js');
this.directorPopUp                 = require('./directorPopUp.js');
this.examineSearchInfo             = require('./examineSearchInfo.js');
this.freeCompanyEvent              = require('./freeCompanyEvent.js');
this.freeCompanyUpdateShortMessage = require('./freeCompanyUpdateShortMessage.js');
this.logMessage                    = require('./logMessage.js');
this.marketBoardItemListing        = require('./marketBoardItemListing.js');
this.messageFC                     = require('./messageFC.js');
this.playtime                      = require('./playtime.js');
this.playerSpawn                   = require('./playerSpawn.js');
this.playerStats                   = require('./playerStats.js');
this.updateHpMpTp                  = require('./updateHpMpTp.js');

// Client-zone packets
this.chatHandler                   = require('./chatHandler.js');
this.emoteEventHandler             = require('./emoteEventHandler.js');
this.inventoryModifyHandler        = require('./inventoryModifyHandler.js');

module.exports.parse = (struct) => {
    if (struct.segmentType !== 0x03) return; // No IPC data

    // Testing
    /*let testSequence = new Uint8Array([]);
    if (hasSubArray(struct.data, testSequence)) {
        if (struct.type === "unknown") {
            console.log(`Found data in IPC ${struct.operation} type ${struct.type} (${this.getUint16(struct.data, 0x12)})`);
        } else {
            console.log(`Found data in IPC ${struct.operation} type ${struct.type}`);
        }

        console.log(struct.data.toString());
        console.log(String.fromCodePoint(...struct.data));
    }

    /*switch (this.getUint16(struct.data, 0x12)) {
        case 0x0123:
            struct.type = "freeCompanyUpdateShortMessageHandler";
            break;
        case 0x0157:
            struct.type = "freeCompanyUpdateShortMessage";
            break;
    }*/

    // FC message opcodes overlap with Ping/PingHandler, and Machina cuts off
    // the header that tells us whether a packet is a zone packet or a chat
    // packet, so we use a different marker. Further, FC chat doesn't have the
    // same packet structure as a regular chat packet, so it gets miscategorized
    // as CharProgress if you feed it through the chat event handler.
    if (struct.type.startsWith("ping") && (struct.packetSize === 1064 /* pingHandler */ || struct.packetSize === 1112 /* ping */)) {
        struct.superType = "message";
        struct.type = "messageFC";
    }

    // Read IPC data
    if (this[struct.type]) {
        this[struct.type](struct);
    }
};

module.exports.uint8ArrayToHexArray = (array) => {
    let newArray = [];
    for (let i; i < array.length; i++) {
        let temp = array[i].toString(16);
        if (temp.length === 1) temp = `0${temp}`;
        newArray[i] = temp;
    }
    return newArray;
};

module.exports.getUint16 = (uint8Array, offset) => {
    let buffer = new DataView(new ArrayBuffer(2));
    for (let i = 0; i < 2; i++) {
        buffer.setUint8(i, uint8Array[offset + i]);
    }
    return buffer.getUint16(0, true);
};

module.exports.getUint32 = (uint8Array, offset) => {
    let buffer = new DataView(new ArrayBuffer(4));
    for (let i = 0; i < 4; i++) {
        buffer.setUint8(i, uint8Array[offset + i]);
    }
    return buffer.getUint32(0, true);
};

function hasSubArray(master, sub) {
    return sub.every((i => v => i = master.indexOf(v, i) + 1)(0));
}

// https://github.com/SapphireServer/Sapphire/blob/develop/src/common/Common.h#L731-L834
module.exports.chatType = [
    "LogKindError",
    "ServerDebug",
    "ServerUrgent",
    "ServerNotice",
    "Unused4",
    "Unused5",
    "Unused6",
    "Unused7",
    "Unused8",
    "Unused9",
    "Say",
    "Shout",
    "Tell",
    "TellReceive",
    "Party",
    "Alliance",
    "LS1",
    "LS2",
    "LS3",
    "LS4",
    "LS5",
    "LS6",
    "LS7",
    "LS8",
    "FreeCompany",
    "Unused25",
    "Unused26",
    "NoviceNetwork",
    "CustomEmote",
    "StandardEmote",
    "Yell",
    "Unknown31",
    "PartyUnk2",
    "Unused33",
    "Unused34",
    "Unused35",
    "Unused36",
    "Unused37",
    "Unused38",
    "Unused39",
    "Unused40",
    "BattleDamage",
    "BattleFailed",
    "BattleActions",
    "BattleItems",
    "BattleHealing",
    "BattleBeneficial",
    "BattleDetrimental",
    "BattleUnk48",
    "BattleUnk49",
    "Unused50",
    "Unused51",
    "Unused52",
    "Unused53",
    "Unused54",
    "Unused55",
    "Echo",
    "SystemMessage",
    "SystemErrorMessage",
    "BattleSystem",
    "GatheringSystem",
    "NPCMessage",
    "LootMessage",
    "Unused63",
    "CharProgress",
    "Loot",
    "Crafting",
    "Gathering",
    "NPCAnnouncement",
    "FCAnnouncement",
    "FCLogin",
    "RetainerSale",
    "PartySearch",
    "PCSign",
    "DiceRoll",
    "NoviceNetworkNotice",
    "Unknown76",
    "Unused77",
    "Unused78",
    "Unused79",
    "GMTell",
    "GMSay",
    "GMShout",
    "GMYell",
    "GMParty",
    "GMFreeCompany",
    "GMLS1",
    "GMLS2",
    "GMLS3",
    "GMLS4",
    "GMLS5",
    "GMLS6",
    "GMLS7",
    "GMLS8",
    "GMNoviceNetwork",
    "Unused95",
    "Unused96",
    "Unused97",
    "Unused98",
    "Unused99",
    "Unused100"
];
