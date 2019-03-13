/**
 * Students model abstraction
 */

const db = require('./firestore');
const PATH = 'mhs';

/**
 * Get student by NIM
 */
exports.get = async function(nim) {
    let snapshot = await db.collection(PATH).where('nim', '==', nim).get();

    let items = snapshot.docs.map(item => {
        return {'id':item.id, ...item.data()};
    });

    return items;
};

/**
 * Add a student
 * @param nim NIM
 * @param name Student name
 */
exports.add = async function(nim, name) {
    let stdata = await exports.get(nim);

    // Check if student with that NIM exists
    if(stdata.length > 0) {
        return null;
    }

    let ref = await db.collection(PATH).add({
        nim: nim,
        name: name
    });

    return ref.id;
};

/**
 * Update a student by ID
 */
exports.update = async function(id, nim, name) {
    let stdata = await exports.get(nim);

    // Check if a different student with that NIM exists
    if(stdata.length > 0) {
        if(stdata[0].id !== id)
            return null;
    }

    let ref = await db.collection(PATH).doc(id);
    let updateSingle = ref.update({name: name, nim: nim});

    return updateSingle;
};

/**
 * Delete a student by ID
 */
exports.delete = async function(id) {
    let deleteDoc = await db.collection(PATH).doc(id).delete();
    return deleteDoc;
};