/**
 * Users model abstraction
 */

const db = require('./firestore');
const bcrypt = require('bcrypt');

const PATH = 'users';
const HASH_SALT = 10;

exports.HASH_SALT = HASH_SALT;

/**
 * Get user by username
 */
exports.get = async function(username) {
    let snapshot = await db.collection(PATH).where('username', '==', username).get();

    let items = snapshot.docs.map(item => {
        return {'id':item.id, ...item.data()};
    });

    if(items.length > 0)
        return items[0];
    else
        return null;
};

/**
 * Add a user
 * @param name User name
 * @param username username login credential
 * @param password password
 */
exports.add = async function(name, username, password) {
    let stdata = await exports.get(username);

    // Check if a user with that username exists
    if(stdata) {
        return null;
    }

    let hash = bcrypt.hashSync(password, HASH_SALT);

    let ref = await db.collection(PATH).add({
        username: username,
        password: hash,
        name: name
    });

    return ref.id;
};

/**
 * Update a user by ID
 */
exports.update = async function(id, name, username, password) {
    let ref = await db.collection(PATH).doc(id);

    let stdata = await exports.get(username);

    // Check if a different user with the same username exists
    if(stdata) {
        if(stdata[0].id !== id)
            return null;
    }

    let toUpdate = {};

    if(name)
        toUpdate['name'] = name;

    if(username)
        toUpdate['username'] = username;

    if(password) {
        let hash = bcrypt.hashSync(password, HASH_SALT);
        toUpdate['password'] = hash;
    }

    let updateSingle = ref.update(toUpdate);

    return updateSingle;
};

/**
 * Delete a user by ID
 */
exports.delete = async function(id) {
    let deleteDoc = await db.collection(PATH).doc(id).delete();
    return deleteDoc;
};

/**
 * Initialize users
 */
async function init() {
    let adminUsername = process.env.ADMIN_USERNAME;
    let adminPassword = process.env.ADMIN_PASSWORD;

    // Try to see if admin user exists
    try{
        let user = await exports.get(adminUsername);
        if(!user) {
            console.log(" [*] Creating Administrator user...");
            // Not exists, create one
            await exports.add("Administrator", adminUsername, adminPassword);
            console.log(" [x] Administrator user created!");
        }
    }catch(err){
        console.error(err);
    }
}

init();