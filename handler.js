const { getContentType } = require("@whiskeysockets/baileys");
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
const chalk = require('chalk');

// Import modules
const menu = require('./libs/menu');
const store = require('./libs/store');
const owner = require('./libs/owner');
const payment = require('./libs/payment');
const admin = require('./libs/admin');
const group = require('./libs/group');
const utils = require('./libs/utils');

async function handler(sock, msg, storeData, config) {
    try {
        const from = msg.key.remoteJid;
        const type = getContentType(msg.message);
        const isGroup = from.endsWith('@g.us');
        const sender = isGroup ? (msg.key.participant || from) : from;
        const pushname = msg.pushName || 'User';
        
        // Extract message text
        let body = '';
        if (type === 'conversation') {
            body = msg.message.conversation;
        } else if (type === 'extendedTextMessage') {
            body = msg.message.extendedTextMessage.text;
        } else if (type === 'imageMessage') {
            body = msg.message.imageMessage.caption || '';
        } else if (type === 'videoMessage') {
            body = msg.message.videoMessage.caption || '';
        }
        
        // Log message
        console.log(chalk.cyan(`[${moment().format('HH:mm:ss')}] ${isGroup ? 'GRUP' : 'PV'} ${pushname}: ${body.substring(0, 50)}`));
        
        // Handle button response
        if (type === 'buttonsResponseMessage') {
            const buttonId = msg.message.buttonsResponseMessage.selectedButtonId;
            
            if (buttonId === 'verify_account') {
                config.registerUser(sender, pushname);
                await sock.sendMessage(from, {
                    text: `✅ *Verifikasi Berhasil!*\n\nHalo ${pushname}, akun Anda telah diverifikasi.\n\nGunakan *.menu* untuk melihat command.`,
                    buttons: [
                        { buttonId: 'menu_button', buttonText: { displayText: '📋 Buka Menu' }, type: 1 },
                        { buttonId: 'store_button', buttonText: { displayText: '🛍️ Lihat Produk' }, type: 1 }
                    ]
                });
                return;
            } else if (buttonId === 'menu_button') {
                await menu.sendMainMenu(sock, from, config);
                return;
            } else if (buttonId === 'store_button') {
                await store.showProducts(sock, from, config);
                return;
            } else if (buttonId === 'owner_button') {
                await owner.contactOwner(sock, from, config);
                return;
            } else if (buttonId === 'group_button') {
                await group.joinGroup(sock, from, config);
                return;
            }
        }
        
        // Check if user is registered
        if (!config.isRegistered(sender) && !body.startsWith('.verify')) {
            await sock.sendMessage(from, {
                text: `🔐 *Verifikasi Diperlukan*\n\nHalo ${pushname}, verifikasi dulu ya!\n\nKlik tombol di bawah:`,
                buttons: [
                    { buttonId: 'verify_account', buttonText: { displayText: '✅ Verify My Account' }, type: 1 }
                ],
                footer: config.botName
            });
            return;
        }
        
        // Handle commands
        if (body && body.startsWith(config.prefix)) {
            const command = body.slice(config.prefix.length).trim().split(' ')[0].toLowerCase();
            const args = body.slice(config.prefix.length + command.length).trim();
            
            console.log(chalk.yellow(`Command: ${command}, Args: ${args}`));
            
            // MAIN MENU
            if (command === 'menu' || command === 'help') {
                await menu.sendMainMenu(sock, from, config);
            } else if (command === 'allmenu') {
                await menu.sendAllMenu(sock, from, config);
            } else if (command === 'owner') {
                await owner.contactOwner(sock, from, config);
            } else if (command === 'donate') {
                await sock.sendMessage(from, { text: '💝 *Donasi*\n\nSupport pengembangan bot:\n📱 WhatsApp: +1 (365) 870-0681' });
            } else if (command === 'runtime') {
                const uptime = process.uptime();
                await sock.sendMessage(from, { 
                    text: `⏱️ *Runtime*\n\nBot aktif: ${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s` 
                });
            } else if (command === 'ping') {
                const start = Date.now();
                await sock.sendMessage(from, { text: `🏓 Pong! ${Date.now() - start}ms` });
            } else if (command === 'profile') {
                await utils.showProfile(sock, from, sender, config);
            } else if (command === 'limit') {
                const user = config.getUser(sender);
                await sock.sendMessage(from, { 
                    text: `🎫 *Limit Anda*\n\nSisa: ${user?.limit || 20}\nGunakan .claim untuk tambah limit` 
                });
            } else if (command === 'saldo') {
                const user = config.getUser(sender);
                await sock.sendMessage(from, { 
                    text: `💰 *Saldo Anda*\n\nRp ${(user?.balance || 0).toLocaleString()}\nGunakan .topup untuk tambah saldo` 
                });
            } else if (command === 'topup') {
                await payment.showTopupMethods(sock, from, config);
            } else if (command === 'claim') {
                await claimDaily(sock, from, sender, config);
            }
            
            // STORE MENU
            else if (command === 'store' || command === 'toko') {
                await store.showProducts(sock, from, config);
            } else if (command === 'product' || command === 'produk') {
                await store.showProductDetails(sock, from, args, config);
            } else if (command === 'cart' || command === 'keranjang') {
                await store.showCart(sock, from, sender, config);
            } else if (command === 'addcart') {
                await store.addToCart(sock, from, sender, args, config);
            } else if (command === 'removecart') {
                await store.removeFromCart(sock, from, sender, args, config);
            } else if (command === 'checkout') {
                await payment.processCheckout(sock, from, sender, config);
            } else if (command === 'order' || command === 'pesanan') {
                await store.showOrders(sock, from, sender, config);
            } else if (command === 'pay' || command === 'bayar') {
                await payment.showPaymentMethods(sock, from, config);
            } else if (command === 'qris') {
                await payment.showQRIS(sock, from, config);
            }
            
            // GROUP MENU
            else if (isGroup && command === 'add') {
                await group.addMember(sock, from, args, config, sender);
            } else if (isGroup && command === 'kick') {
                await group.kickMember(sock, from, args, config, sender);
            } else if (isGroup && command === 'promote') {
                await group.promoteMember(sock, from, args, config, sender);
            } else if (isGroup && command === 'demote') {
                await group.demoteMember(sock, from, args, config, sender);
            } else if (isGroup && command === 'hidetag') {
                await group.hiddenTag(sock, from, args, config, sender);
            } else if (isGroup && command === 'tagall') {
                await group.tagAll(sock, from, config, sender);
            } else if (isGroup && command === 'welcome') {
                await group.toggleWelcome(sock, from, args, config, sender);
            } else if (isGroup && command === 'antilink') {
                await group.toggleAntilink(sock, from, args, config, sender);
            } else if (isGroup && command === 'group') {
                await group.toggleGroup(sock, from, args, config, sender);
            } else if (isGroup && command === 'setnamegc') {
                await group.setGroupName(sock, from, args, config, sender);
            } else if (isGroup && command === 'linkgc') {
                await group.getGroupLink(sock, from, config, sender);
            } else if (isGroup && command === 'kickme') {
                await group.kickMe(sock, from, sender, config);
            }
            
            // DOWNLOADER
            else if (command === 'ytmp3') {
                await utils.downloadYoutubeMP3(sock, from, args, config);
            } else if (command === 'ytmp4') {
                await utils.downloadYoutubeMP4(sock, from, args, config);
            } else if (command === 'tiktok') {
                await utils.downloadTikTok(sock, from, args, config);
            } else if (command === 'igdl') {
                await utils.downloadInstagram(sock, from, args, config);
            } else if (command === 'fbdl') {
                await utils.downloadFacebook(sock, from, args, config);
            }
            
            // Jika command tidak dikenali
            else {
                await sock.sendMessage(from, { 
                    text: `❌ *Command Tidak Dikenali*\n\nGunakan .menu untuk melihat daftar command.` 
                });
            }
        }
        
    } catch (error) {
        console.error(chalk.red('❌ Handler Error:'), error);
        try {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '❌ *Terjadi Kesalahan*\n\nMohon maaf, terjadi error.' 
            });
        } catch (e) {}
    }
}

async function claimDaily(sock, from, sender, config) {
    const users = config.getUsers();
    const user = users.find(u => u.jid === sender);
    
    if (user) {
        user.limit += 20;
        config.saveUsers(users);
        await sock.sendMessage(from, { 
            text: `🎁 *Claim Berhasil!*\n\n+20 Limit!\nTotal: ${user.limit}` 
        });
    }
}

module.exports = handler;
