const { Boom } = require('@hapi/boom');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const handler = require('./handler');
const config = require('./config');

async function startBot() {
    console.log(chalk.green('🚀 Starting Liviaa Astranica Bot...'));
    
    try {
        const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
        
        const sock = makeWASocket({
            printQRInTerminal: false,
            auth: state,
            logger: pino({ level: 'silent' }),
            browser: ['Liviaa Astranica', 'Chrome', '1.0.0'],
        });
        
        sock.ev.on('creds.update', saveCreds);
        
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            
            if (qr) {
                console.log(chalk.yellow('\n══════════════════════════════════════'));
                console.log(chalk.yellow('📱 SCAN QR CODE INI DENGAN WHATSAPP'));
                console.log(chalk.yellow('══════════════════════════════════════\n'));
                qrcode.generate(qr, { small: true });
                console.log(chalk.cyan('\nScan QR di atas, lalu tunggu...'));
            }
            
            if (connection === 'close') {
                let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
                console.log(chalk.red('❌ Koneksi terputus, reason:', reason));
                
                if (reason !== DisconnectReason.loggedOut) {
                    console.log(chalk.yellow('🔄 Menghubungkan ulang dalam 3 detik...'));
                    setTimeout(startBot, 3000);
                }
            }
            
            if (connection === 'open') {
                console.log(chalk.green('\n══════════════════════════════════════'));
                console.log(chalk.green('✅ BOT BERHASIL TERHUBUNG!'));
                console.log(chalk.green(`🤖 Nama: ${sock.user?.name || 'Liviaa Astranica'}`));
                console.log(chalk.green(`📞 Nomor: ${sock.user?.id?.split(':')[0] || 'Unknown'}`));
                console.log(chalk.green('══════════════════════════════════════\n'));
                
                if (config.ownerNumber) {
                    setTimeout(async () => {
                        try {
                            await sock.sendMessage(config.ownerNumber, {
                                text: `✅ *${config.botName} AKTIF!*\n\nBot telah online dan siap digunakan!\n⏰ ${new Date().toLocaleString()}\n\nGunakan .menu untuk melihat command.`
                            });
                        } catch (e) {
                            console.log(chalk.yellow('⚠️  Tidak bisa kirim notifikasi ke owner'));
                        }
                    }, 2000);
                }
            }
        });
        
        sock.ev.on('messages.upsert', async (m) => {
            const msg = m.messages[0];
            if (!msg.message || msg.key.fromMe) return;
            
            try {
                await handler(sock, msg, {}, config);
            } catch (error) {
                console.error(chalk.red('❌ Handler Error:'), error.message);
            }
        });
        
        sock.ev.on('group-participants.update', async (update) => {
            const { id, participants, action } = update;
            
            if (action === 'add') {
                for (const participant of participants) {
                    if (participant === sock.user.id) {
                        await sock.sendMessage(id, {
                            text: `🤖 *Terima kasih telah menambahkan saya!*\n\nSaya adalah ${config.botName}\n\nGunakan *${config.prefix}menu* untuk melihat semua command.\n\nOwner: ${config.ownerNumber.split('@')[0]}`
                        });
                    }
                }
            }
        });
        
        return sock;
        
    } catch (error) {
        console.error(chalk.red('❌ Gagal memulai bot:'), error);
        console.log(chalk.yellow('🔄 Restart dalam 5 detik...'));
        setTimeout(startBot, 5000);
    }
}

startBot();

process.on('uncaughtException', (err) => {
    console.error(chalk.red('⚠️  Uncaught Exception:'), err);
});

process.on('unhandledRejection', (err) => {
    console.error(chalk.red('⚠️  Unhandled Rejection:'), err);
});
