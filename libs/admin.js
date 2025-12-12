class Admin {
    async addProduct(sock, from, args, config, sender) {
        if (!config.isOwner(sender)) {
            await sock.sendMessage(from, { text: '❌ *Hanya owner*' });
            return;
        }
        
        const parts = args.split('|');
        if (parts.length < 3) {
            await sock.sendMessage(from, { 
                text: '❌ *Format: .addproduct nama|harga|stok|deskripsi*' 
            });
            return;
        }
        
        const products = config.getProducts();
        const productId = 'PROD' + Date.now().toString().slice(-6);
        
        products.push({
            id: productId,
            name: parts[0].trim(),
            price: parseInt(parts[1].trim()),
            stock: parseInt(parts[2].trim()),
            description: parts[3] ? parts[3].trim() : ''
        });
        
        config.saveProducts(products);
        
        await sock.sendMessage(from, { 
            text: `✅ *Produk ditambahkan*\n\nID: ${productId}\nNama: ${parts[0]}\nHarga: Rp ${parseInt(parts[1]).toLocaleString()}` 
        });
    }

    async listOrders(sock, from, config, sender) {
        if (!config.isOwner(sender)) {
            await sock.sendMessage(from, { text: '❌ *Hanya owner*' });
            return;
        }
        
        const orders = config.getOrders();
        
        if (orders.length === 0) {
            await sock.sendMessage(from, { text: '📦 *Belum ada order*' });
            return;
        }
        
        let orderText = '📦 *SEMUA ORDER*\n\n';
        orders.forEach((order, index) => {
            orderText += `*${index + 1}. ID: ${order.id}*\n`;
            orderText += `   Pembeli: ${order.buyer.split('@')[0]}\n`;
            orderText += `   Total: Rp ${order.total.toLocaleString()}\n`;
            orderText += `   Status: ${order.status}\n\n`;
        });
        
        await sock.sendMessage(from, { text: orderText });
    }

    async broadcast(sock, from, args, config, sender) {
        if (!config.isOwner(sender)) {
            await sock.sendMessage(from, { text: '❌ *Hanya owner*' });
            return;
        }
        
        if (!args) {
            await sock.sendMessage(from, { text: '❌ *Masukkan pesan*' });
            return;
        }
        
        const users = config.getUsers();
        let success = 0;
        
        for (const user of users) {
            try {
                await sock.sendMessage(user.jid, {
                    text: `📢 *BROADCAST*\n\n${args}\n\n_Pesan dari owner_`
                });
                success++;
            } catch (error) {
                console.log(`Gagal kirim ke ${user.jid}`);
            }
        }
        
        await sock.sendMessage(from, {
            text: `✅ *Broadcast selesai*\n\nBerhasil: ${success}\nTotal: ${users.length}`
        });
    }
}

module.exports = new Admin();
