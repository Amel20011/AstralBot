const fs = require('fs-extra');
const path = require('path');

class Config {
    constructor() {
        this.prefix = '.';
        this.ownerNumber = '13658700681@s.whatsapp.net';
        this.botName = 'Liviaa Astranica';
        this.botNumber = '';
        
        this.welcomeMessage = `👋 Welcome @user to @group!\n\nSelamat bergabung! Total member: @membercount\n\nJangan lupa baca deskripsi grup ya!`;
        this.goodbyeMessage = `👋 Goodbye @user!\n\nSemoga sukses selalu!`;
        this.welcomeVideo = 'https://files.catbox.moe/4v1p38.mp4';
        
        this.dataPath = path.join(__dirname, 'database');
        this.initDatabase();
    }
    
    initDatabase() {
        if (!fs.existsSync(this.dataPath)) {
            fs.mkdirSync(this.dataPath, { recursive: true });
        }
        
        const defaultFiles = {
            'users.json': [],
            'products.json': [
                {
                    "id": "PROD001",
                    "name": "Baju Kaos Premium",
                    "price": 75000,
                    "stock": 50,
                    "description": "Baju kaos katun premium"
                },
                {
                    "id": "PROD002",
                    "name": "Celana Jeans",
                    "price": 150000,
                    "stock": 30,
                    "description": "Celana jeans slim fit"
                }
            ],
            'orders.json': [],
            'groups.json': {},
            'carts.json': {},
            'admins.json': [this.ownerNumber]
        };
        
        for (const [filename, defaultData] of Object.entries(defaultFiles)) {
            const filePath = path.join(this.dataPath, filename);
            if (!fs.existsSync(filePath)) {
                fs.writeJsonSync(filePath, defaultData, { spaces: 2 });
            }
        }
    }
    
    // User methods
    getUsers() {
        return fs.readJsonSync(path.join(this.dataPath, 'users.json'));
    }
    
    saveUsers(users) {
        fs.writeJsonSync(path.join(this.dataPath, 'users.json'), users, { spaces: 2 });
    }
    
    getUser(jid) {
        const users = this.getUsers();
        return users.find(u => u.jid === jid);
    }
    
    registerUser(jid, name) {
        const users = this.getUsers();
        let user = users.find(u => u.jid === jid);
        
        if (!user) {
            user = {
                jid,
                name,
                verified: true,
                registeredAt: new Date().toISOString(),
                balance: 0,
                limit: 20,
                orders: []
            };
            users.push(user);
        } else {
            user.verified = true;
            user.name = name || user.name;
        }
        
        this.saveUsers(users);
        return user;
    }
    
    isRegistered(jid) {
        const user = this.getUser(jid);
        return user && user.verified === true;
    }
    
    // Product methods
    getProducts() {
        return fs.readJsonSync(path.join(this.dataPath, 'products.json'));
    }
    
    saveProducts(products) {
        fs.writeJsonSync(path.join(this.dataPath, 'products.json'), products, { spaces: 2 });
    }
    
    // Cart methods
    getCarts() {
        return fs.readJsonSync(path.join(this.dataPath, 'carts.json'));
    }
    
    saveCarts(carts) {
        fs.writeJsonSync(path.join(this.dataPath, 'carts.json'), carts, { spaces: 2 });
    }
    
    // Order methods
    getOrders() {
        return fs.readJsonSync(path.join(this.dataPath, 'orders.json'));
    }
    
    saveOrders(orders) {
        fs.writeJsonSync(path.join(this.dataPath, 'orders.json'), orders, { spaces: 2 });
    }
    
    // Group methods
    loadGroupSettings(groupId) {
        const groups = fs.readJsonSync(path.join(this.dataPath, 'groups.json'));
        return groups[groupId] || {
            welcome: true,
            goodbye: true,
            antilink: false,
            antivirtex: false,
            antidelete: false
        };
    }
    
    saveGroupSettings(groupId, settings) {
        const groups = fs.readJsonSync(path.join(this.dataPath, 'groups.json'));
        groups[groupId] = settings;
        fs.writeJsonSync(path.join(this.dataPath, 'groups.json'), groups, { spaces: 2 });
    }
    
    // Admin methods
    getAdmins() {
        return fs.readJsonSync(path.join(this.dataPath, 'admins.json'));
    }
    
    isOwner(jid) {
        return jid === this.ownerNumber;
    }
    
    isAdmin(jid) {
        const admins = this.getAdmins();
        return admins.includes(jid) || this.isOwner(jid);
    }
}

module.exports = new Config();
