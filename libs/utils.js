class Utils {
    async showProfile(sock, from, sender, config) {
        const user = config.getUser(sender);
        
        if (!user) {
            await sock.sendMessage(from, { text: '❌ *User tidak ditemukan*' });
            return;
        }
        
        const profile = `👤 *PROFIL ANDA*\n\n` +
                       `*Nama:* ${user.name}\n` +
                       `*Saldo:* Rp ${user.balance.toLocaleString()}\n` +
                       `*Limit:* ${user.limit}\n` +
                       `*Terdaftar:* ${new Date(user.registeredAt).toLocaleDateString()}\n` +
                       `*Status:* ${user.verified ? '✅ Verified' : '❌ Unverified'}`;
        
        await sock.sendMessage(from, { text: profile });
    }

    async downloadYoutubeMP3(sock, from, args, config) {
        if (!args) {
            await sock.sendMessage(from, { text: '❌ *Masukkan link YouTube*' });
            return;
        }
        
        await sock.sendMessage(from, { 
            text: `🎵 *YouTube MP3*\n\nLink: ${args}\n\nFitur downloader dalam pengembangan.` 
        });
    }

    async downloadYoutubeMP4(sock, from, args, config) {
        if (!args) {
            await sock.sendMessage(from, { text: '❌ *Masukkan link YouTube*' });
            return;
        }
        
        await sock.sendMessage(from, { 
            text: `🎬 *YouTube MP4*\n\nLink: ${args}\n\nFitur downloader dalam pengembangan.` 
        });
    }

    async downloadTikTok(sock, from, args, config) {
        if (!args) {
            await sock.sendMessage(from, { text: '❌ *Masukkan link TikTok*' });
            return;
        }
        
        await sock.sendMessage(from, { 
            text: `📱 *TikTok Downloader*\n\nLink: ${args}\n\nFitur downloader dalam pengembangan.` 
        });
    }

    async downloadInstagram(sock, from, args, config) {
        if (!args) {
            await sock.sendMessage(from, { text: '❌ *Masukkan link Instagram*' });
            return;
        }
        
        await sock.sendMessage(from, { 
            text: `📸 *Instagram Downloader*\n\nLink: ${args}\n\nFitur downloader dalam pengembangan.` 
        });
    }

    async downloadFacebook(sock, from, args, config) {
        if (!args) {
            await sock.sendMessage(from, { text: '❌ *Masukkan link Facebook*' });
            return;
        }
        
        await sock.sendMessage(from, { 
            text: `📘 *Facebook Downloader*\n\nLink: ${args}\n\nFitur downloader dalam pengembangan.` 
        });
    }
}

module.exports = new Utils();
