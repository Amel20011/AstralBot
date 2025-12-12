class Group {
    async addMember(sock, from, args, config, sender) {
        if (!config.isAdmin(sender)) {
            await sock.sendMessage(from, { text: '❌ *Hanya admin*' });
            return;
        }
        
        await sock.sendMessage(from, { 
            text: `✅ *Fitur Add Member*\n\nReply pesan dengan .add @tag` 
        });
    }

    async kickMember(sock, from, args, config, sender) {
        if (!config.isAdmin(sender)) {
            await sock.sendMessage(from, { text: '❌ *Hanya admin*' });
            return;
        }
        
        await sock.sendMessage(from, { 
            text: `✅ *Fitur Kick Member*\n\nReply pesan dengan .kick @tag` 
        });
    }

    async promoteMember(sock, from, args, config, sender) {
        if (!config.isOwner(sender)) {
            await sock.sendMessage(from, { text: '❌ *Hanya owner*' });
            return;
        }
        
        await sock.sendMessage(from, { 
            text: `✅ *Fitur Promote Member*\n\nReply pesan dengan .promote @tag` 
        });
    }

    async demoteMember(sock, from, args, config, sender) {
        if (!config.isOwner(sender)) {
            await sock.sendMessage(from, { text: '❌ *Hanya owner*' });
            return;
        }
        
        await sock.sendMessage(from, { 
            text: `✅ *Fitur Demote Member*\n\nReply pesan dengan .demote @tag` 
        });
    }

    async hiddenTag(sock, from, args, config, sender) {
        if (!config.isAdmin(sender)) {
            await sock.sendMessage(from, { text: '❌ *Hanya admin*' });
            return;
        }
        
        await sock.sendMessage(from, { 
            text: args || 'Hidden tag message',
            mentions: []
        });
    }

    async tagAll(sock, from, config, sender) {
        if (!config.isAdmin(sender)) {
            await sock.sendMessage(from, { text: '❌ *Hanya admin*' });
            return;
        }
        
        try {
            const group = await sock.groupMetadata(from);
            const mentions = group.participants.map(p => p.id);
            
            await sock.sendMessage(from, {
                text: '📢 *TAG ALL*\n\nHalo semua member!',
                mentions: mentions
            });
        } catch (error) {
            await sock.sendMessage(from, { text: '❌ *Gagal tag all*' });
        }
    }

    async toggleWelcome(sock, from, args, config, sender) {
        if (!config.isAdmin(sender)) {
            await sock.sendMessage(from, { text: '❌ *Hanya admin*' });
            return;
        }
        
        const settings = config.loadGroupSettings(from);
        settings.welcome = args === 'on';
        config.saveGroupSettings(from, settings);
        
        await sock.sendMessage(from, { 
            text: `✅ *Welcome ${args === 'on' ? 'diaktifkan' : 'dimatikan'}*` 
        });
    }

    async toggleAntilink(sock, from, args, config, sender) {
        if (!config.isAdmin(sender)) {
            await sock.sendMessage(from, { text: '❌ *Hanya admin*' });
            return;
        }
        
        const settings = config.loadGroupSettings(from);
        settings.antilink = args === 'on';
        config.saveGroupSettings(from, settings);
        
        await sock.sendMessage(from, { 
            text: `✅ *Antilink ${args === 'on' ? 'diaktifkan' : 'dimatikan'}*` 
        });
    }

    async toggleGroup(sock, from, args, config, sender) {
        if (!config.isAdmin(sender)) {
            await sock.sendMessage(from, { text: '❌ *Hanya admin*' });
            return;
        }
        
        if (args === 'buka') {
            await sock.groupSettingUpdate(from, 'not_announcement');
            await sock.sendMessage(from, { text: '✅ *Grup dibuka*' });
        } else if (args === 'tutup') {
            await sock.groupSettingUpdate(from, 'announcement');
            await sock.sendMessage(from, { text: '🔒 *Grup ditutup*' });
        }
    }

    async setGroupName(sock, from, args, config, sender) {
        if (!config.isAdmin(sender)) {
            await sock.sendMessage(from, { text: '❌ *Hanya admin*' });
            return;
        }
        
        if (!args) {
            await sock.sendMessage(from, { text: '❌ *Masukkan nama grup*' });
            return;
        }
        
        await sock.groupUpdateSubject(from, args);
        await sock.sendMessage(from, { text: `✅ *Nama grup diubah: ${args}*` });
    }

    async getGroupLink(sock, from, config, sender) {
        if (!config.isAdmin(sender)) {
            await sock.sendMessage(from, { text: '❌ *Hanya admin*' });
            return;
        }
        
        try {
            const code = await sock.groupInviteCode(from);
            const link = `https://chat.whatsapp.com/${code}`;
            await sock.sendMessage(from, { text: `🔗 *Link grup:*\n\n${link}` });
        } catch (error) {
            await sock.sendMessage(from, { text: '❌ *Gagal dapatkan link*' });
        }
    }

    async kickMe(sock, from, sender, config) {
        await sock.groupParticipantsUpdate(from, [sender], 'remove');
    }

    async joinGroup(sock, from, config) {
        await sock.sendMessage(from, {
            text: `👥 *JOIN GRUP*\n\nBergabung dengan grup kami:\n\nhttps://chat.whatsapp.com/example`,
            buttons: [
                {
                    buttonId: 'join_group',
                    buttonText: { displayText: '📲 Join Grup' },
                    type: 1
                }
            ]
        });
    }
}

module.exports = new Group();
