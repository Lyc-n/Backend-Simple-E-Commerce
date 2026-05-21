const fs = require('fs/promises');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

async function readUsers() {
    try {
        const raw = await fs.readFile(USERS_FILE, 'utf-8');

        return JSON.parse(raw || '[]');
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }

        throw error;
    }
}

async function writeUsers(users) {
    await fs.writeFile(
        USERS_FILE,
        JSON.stringify(users, null, 2),
        'utf-8'
    );
}

module.exports = {
    readUsers,
    writeUsers,
};