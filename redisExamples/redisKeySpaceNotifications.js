const redis = require('redis');
const { redisEvents } = require('../constants/redisConstants');

const KSNSubscriber = redis.createClient();
const KSNPublisher = redis.createClient();

const EVENT_SET = '__keyevent@0__:set';
const SPACE_KEY = '__keyspace@0__:mykey';

KSNPublisher.config("SET", "notify-keyspace-events", "AKE");

KSNSubscriber.on(redisEvents.CONNECT, function() {
    console.log('Redis KSNSubscriber connected');
});

KSNSubscriber.on(redisEvents.ERROR, function(err) {
    console.log(`Something went wrong ${err}`);
});

KSNSubscriber.on(redisEvents.PSUBSCRIBE, function(channel, count) {
    console.log(`KSNSubscriber subscribed to ${channel} , ${count} total subscriptions`);
    KSNPublisher.set("mykey", "my value", redis.print);
    console.log(`Notification: ${KSNPublisher.config('GET','notify-keyspace-events')}`);
});

KSNSubscriber.on(redisEvents.PUNSUBSCRIBE, function(channel, count) {
    console.log(`KSNSubscriber unsubscribed from ${channel}, ${count} total subscriptions`);
    KSNSubscriber.end();
});

KSNSubscriber.on(redisEvents.PMESSAGE, function(pattern, channel, key) {
    switch (channel) {
        case EVENT_SET:
            console.log(`EVENT_SET channel: ${channel}, key: ${key}`);
            break;
        case SPACE_KEY:
            console.log(`SPACE_KEY channel: ${channel}, key: ${key}`);
            break;
    }
});

KSNSubscriber.on(redisEvents.READY, function() {
    // if you need auth, do it here
    KSNSubscriber.psubscribe('__key*__:*');
});
