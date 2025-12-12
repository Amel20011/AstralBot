class Payment {
    async showPaymentMethods(sock, from, config) {
        const methods = `💳 *METODE PEMBAYARAN*

1. *QRIS* (Recommended)
   - Scan QR code
   - Support semua bank & e-wallet

2. *Transfer Bank*
   - BCA: 1234567890
   - BRI: 0987654321
   - Mandiri: 1122334455

3. *E-Wallet*
   - OVO: 081234567890
   - Dana: 081234567890
   - Gopay: 081234567890

*Instruksi:*
1. Lakukan pembayaran
2. Kirim bukti ke owner
3. Pesanan diproses

Gunakan .qris untuk QRIS`;

        await sock.sendMessage(from, { text: methods });
    }

    async showQRIS(sock, from, config) {
        await sock.sendMessage(from, {
            text: `📱 *QRIS PAYMENT*\n\nScan QR code di bawah untuk pembayaran:\n\nhttps://api.qrserver.com/v1/create-qr-code/?size=300x300&data=LIVIAA-STORE-PAYMENT\n\n*Cara bayar:*\n1. Buka app bank/e-wallet\n2. Pilih bayar dengan QRIS\n3. Scan QR di atas\n4. Konfirmasi pembayaran`
        });
    }

    async showTopupMethods(sock, from, config) {
        await sock.sendMessage(from, {
            text: `💰 *TOPUP SALDO*\n\n*Metode:*\n1. Transfer Bank\n2. QRIS\n3. E-Wallet\n\n*Minimal:* Rp 10,000\n\n*Cara:*\n1. Transfer ke nomor rekening\n2. Kirim bukti ke owner\n3. Saldo ditambahkan dalam 5 menit\n\nHubungi owner untuk topup.`
        });
    }

    async processCheckout(sock, from, sender, config) {
        const carts = config.getCarts();
        const userCart = carts[sender] || [];
        
        if (userCart.length === 0) {
            await sock.sendMessage(from, { text: '❌ *Keranjang kosong*' });
            return;
        }
        
        let total = 0;
        userCart.forEach(item => {
            total += item.price * item.qty;
        });
        
        const orderId = 'ORD' + Date.now().toString().slice(-8);
        const orders = config.getOrders();
        
        orders.push({
            id: orderId,
            buyer: sender,
            items: userCart,
            total: total,
            date: new Date().toISOString(),
            status: 'pending'
        });
        
        config.saveOrders(orders);
        carts[sender] = [];
        config.saveCarts(carts);
        
        await sock.sendMessage(from, {
            text: `✅ *CHECKOUT BERHASIL*\n\n*Order ID:* ${orderId}\n*Total:* Rp ${total.toLocaleString()}\n*Status:* Menunggu pembayaran\n\nGunakan .pay untuk melihat metode pembayaran.`
        });
    }
}

module.exports = new Payment();
