class Menu {
    async sendMainMenu(sock, from, config) {
        const menuText = `🤖 *${config.botName} - Main Menu*

┌───〔 🌟 MAIN MENU 〕
│ • ${config.prefix}menu
│ • ${config.prefix}owner
│ • ${config.prefix}donate
│ • ${config.prefix}runtime
│ • ${config.prefix}ping 
│ • ${config.prefix}profile
│ • ${config.prefix}limit
│ • ${config.prefix}saldo
│ • ${config.prefix}topup
│ • ${config.prefix}claim
│ • ${config.prefix}store
│ • ${config.prefix}cart
│ • ${config.prefix}order

┌───〔 🛍️ STORE MENU 〕
│ • ${config.prefix}store
│ • ${config.prefix}product [id]
│ • ${config.prefix}addcart [id] [qty]
│ • ${config.prefix}cart
│ • ${config.prefix}removecart [id]
│ • ${config.prefix}checkout
│ • ${config.prefix}pay
│ • ${config.prefix}qris

┌───〔 💰 PAYMENT 〕
│ • ${config.prefix}topup
│ • ${config.prefix}pay
│ • ${config.prefix}qris

┌───〔 🎬 DOWNLOADER 〕
│ • ${config.prefix}ytmp3 [link]
│ • ${config.prefix}ytmp4 [link]
│ • ${config.prefix}tiktok [link]
│ • ${config.prefix}igdl [link]
│ • ${config.prefix}fbdl [link]

┌───〔 📱 SOSMED 〕
│ • Instagram: @liviaastranica
│ • WhatsApp: +1 (365) 870-0681

Ketik ${config.prefix}allmenu untuk semua command!`;

        await sock.sendMessage(from, {
            text: menuText,
            buttons: [
                { buttonId: 'store_button', buttonText: { displayText: '🛍️ Lihat Produk' }, type: 1 },
                { buttonId: 'owner_button', buttonText: { displayText: '👑 Hubungi Owner' }, type: 1 },
                { buttonId: 'group_button', buttonText: { displayText: '👥 Join Grup' }, type: 1 }
            ],
            footer: config.botName,
            headerType: 1
        });
    }

    async sendAllMenu(sock, from, config) {
        const allMenuText = `🤖 *${config.botName} - All Commands*

┌───〔 🌟 MAIN MENU 〕
│ • .menu
│ • .owner
│ • .donate
│ • .runtime
│ • .ping 
│ • .profile
│ • .limit
│ • .saldo
│ • .topup
│ • .claim
│ • .addprem @tag
│ • .delprem @tag
│ • .setprefix
│ • .broadcast
│ • .addlimit
│ • .addsaldo
│ • .ytmp3 link
│ • .ytmp4 link
│ • .tiktok link
│ • .igdl link
│ • .fbdl link

┌───〔 🛍️ STORE MENU 〕
│ • .store
│ • .product [id]
│ • .addcart [id] [qty]
│ • .cart
│ • .removecart [id]
│ • .checkout
│ • .pay
│ • .qris

┌───〔 👥 GROUP MENU 〕
│ • .add @tag
│ • .kick @tag
│ • .promote @tag
│ • .demote @tag
│ • .hidetag teks
│ • .tagall
│ • .welcome on/off
│ • .antilink on/off
│ • .antivirtex on/off
│ • .antidelete on/off
│ • .group buka/tutup
│ • .setppgc (reply foto)
│ • .setnamegc teks
│ • .setdescgc teks
│ • .linkgc
│ • .resetlinkgc
│ • .kickme
│ • .vote teks
│ • .devote

*Note:*
- Gunakan prefix "." sebelum command
- [] = wajib diisi
- () = opsional`;

        await sock.sendMessage(from, { text: allMenuText });
    }
}

module.exports = new Menu();
