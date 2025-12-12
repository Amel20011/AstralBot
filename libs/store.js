class Store {
    async showProducts(sock, from, config) {
        const products = config.getProducts();
        
        if (products.length === 0) {
            await sock.sendMessage(from, { text: '🛒 *Toko Kosong*\n\nBelum ada produk.' });
            return;
        }
        
        let productList = '🛍️ *DAFTAR PRODUK*\n\n';
        products.forEach((product, index) => {
            productList += `*${index + 1}. ${product.name}*\n`;
            productList += `   💰 Rp ${product.price.toLocaleString()}\n`;
            productList += `   📦 Stok: ${product.stock}\n`;
            productList += `   🆔 ID: ${product.id}\n\n`;
        });
        
        productList += `\nGunakan .product [id] untuk detail produk.`;
        
        await sock.sendMessage(from, { 
            text: productList,
            buttons: [
                { buttonId: 'cart_button', buttonText: { displayText: '🛒 Keranjang' }, type: 1 },
                { buttonId: 'checkout_button', buttonText: { displayText: '💳 Checkout' }, type: 1 }
            ]
        });
    }

    async showProductDetails(sock, from, args, config) {
        const productId = args.trim();
        const products = config.getProducts();
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            await sock.sendMessage(from, { text: '❌ *Produk tidak ditemukan*' });
            return;
        }
        
        const detail = `📦 *DETAIL PRODUK*\n\n` +
                      `*Nama:* ${product.name}\n` +
                      `*Harga:* Rp ${product.price.toLocaleString()}\n` +
                      `*Stok:* ${product.stock}\n` +
                      `*Deskripsi:* ${product.description}\n` +
                      `*ID:* ${product.id}\n\n` +
                      `Gunakan: .addcart ${product.id} [jumlah]`;
        
        await sock.sendMessage(from, { text: detail });
    }

    async addToCart(sock, from, sender, args, config) {
        const [productId, qty = '1'] = args.split(' ');
        const products = config.getProducts();
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            await sock.sendMessage(from, { text: '❌ *Produk tidak ditemukan*' });
            return;
        }
        
        const carts = config.getCarts();
        if (!carts[sender]) carts[sender] = [];
        
        const existing = carts[sender].find(item => item.id === productId);
        if (existing) {
            existing.qty += parseInt(qty);
        } else {
            carts[sender].push({
                id: productId,
                name: product.name,
                price: product.price,
                qty: parseInt(qty)
            });
        }
        
        config.saveCarts(carts);
        await sock.sendMessage(from, { text: `✅ *Ditambahkan ke keranjang*\n\n${product.name} x${qty}` });
    }

    async showCart(sock, from, sender, config) {
        const carts = config.getCarts();
        const userCart = carts[sender] || [];
        
        if (userCart.length === 0) {
            await sock.sendMessage(from, { text: '🛒 *Keranjang kosong*' });
            return;
        }
        
        let cartText = '🛒 *KERANJANG ANDA*\n\n';
        let total = 0;
        
        userCart.forEach((item, index) => {
            const subtotal = item.price * item.qty;
            total += subtotal;
            cartText += `*${index + 1}. ${item.name}*\n`;
            cartText += `   💰 Rp ${item.price.toLocaleString()} x ${item.qty}\n`;
            cartText += `   🧾 Subtotal: Rp ${subtotal.toLocaleString()}\n\n`;
        });
        
        cartText += `*TOTAL: Rp ${total.toLocaleString()}*\n\n`;
        cartText += `Gunakan .checkout untuk bayar`;
        
        await sock.sendMessage(from, { text: cartText });
    }

    async removeFromCart(sock, from, sender, args, config) {
        const index = parseInt(args) - 1;
        const carts = config.getCarts();
        const userCart = carts[sender] || [];
        
        if (index < 0 || index >= userCart.length) {
            await sock.sendMessage(from, { text: '❌ *Item tidak ditemukan*' });
            return;
        }
        
        const removed = userCart.splice(index, 1)[0];
        config.saveCarts(carts);
        
        await sock.sendMessage(from, { text: `✅ *Item dihapus*\n\n${removed.name}` });
    }

    async showOrders(sock, from, sender, config) {
        const orders = config.getOrders();
        const userOrders = orders.filter(o => o.buyer === sender);
        
        if (userOrders.length === 0) {
            await sock.sendMessage(from, { text: '📦 *Belum ada pesanan*' });
            return;
        }
        
        let orderText = '📦 *PESANAN ANDA*\n\n';
        userOrders.forEach((order, index) => {
            orderText += `*${index + 1}. ID: ${order.id}*\n`;
            orderText += `   💰 Rp ${order.total.toLocaleString()}\n`;
            orderText += `   📅 ${new Date(order.date).toLocaleDateString()}\n`;
            orderText += `   📍 ${order.status}\n\n`;
        });
        
        await sock.sendMessage(from, { text: orderText });
    }
}

module.exports = new Store();
