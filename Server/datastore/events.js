/**
 * Events model abstraction
 */

const db = require('./firestore');
const PATH = 'events';

/**
 * List all events
 */
exports.list = async function() {
    let snapshot = await db.collection(PATH).get();
    let items = snapshot.docs.map(item => {
        return {'id':item.id, ...item.data()};
    });

    return items;
};

/**
 * Get event by ID
 * @param eventId event ID
 */
exports.get = async function(eventId) {
    let snapshot = await db.collection(PATH).doc(eventId).get();

    if(!snapshot.exists) {
        return null;
    } else {
        return snapshot.data();
    }
};

/**
 * Edit event by ID
 * @param eventId event ID
 * @param eventName event name
 */
exports.edit = async function(eventId, eventName) {
    let result = await db.collection(PATH).doc(eventId).update({
        name: eventName
    });

    return result;
};

/**
 * Add an event
 * @param eventName Event name
 */
exports.add = async function(eventName) {
    let ref = await db.collection(PATH).add({
        name: eventName
    });

    return ref.id;
};