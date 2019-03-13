/**
 * Attendances model abstraction
 */

const db = require('./firestore');
const PATH = 'attendances';

/**
 * get attendance by event id
 * @param eventId event id
 */
exports.listByEvent = async function(eventId) {
    let snapshot = await db.collection(PATH).where('event','==',eventId).get();
    let items = snapshot.docs.map(item => {
        return item.data().nim;
    });

    return items;
};

/**
 * get attendance by student nim
 * @param NIM student NIM
 */
exports.listByNIM = async function(NIM) {
    let snapshot = await db.collection(PATH).where('nim','==',String(NIM)).get();
    let items = snapshot.docs.map(item => {
        return item.data().event;
    });

    return items;
};

/**
 * Add new attendance
 * @param eventId event id
 * @param NIM student NIM
 */
exports.add = async function(eventId,NIM) {
    let ref = await db.collection(PATH).add({
        event: eventId,
        nim:String(NIM)
    });

    return ref.id;
}