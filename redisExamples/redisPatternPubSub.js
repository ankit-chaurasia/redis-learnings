const redis = require('redis');

const { redisEvents } = require('../constants/redisConstants');

const patternPubSubClient = redis.createClient();
const patternPubSubPublisher1 = redis.createClient();
const patternPubSubPublisher2 = redis.createClient();

patternPubSubClient.on(redisEvents.CONNECT, function() {
    console.log('Redis patternPubSubClient connected');
});

patternPubSubClient.on(redisEvents.PSUBSCRIBE, function(pattern, count) {
    console.log(`patternPubSubClient psubscribed to ${pattern}, ${count} total subscriptions`);
    patternPubSubPublisher1.publish('channelthree', 'patternPubSubPublisher1');
    patternPubSubPublisher2.publish('channelfour', 'patternPubSubPublisher2');
});

patternPubSubClient.on(redisEvents.PUNSUBSCRIBE, function(pattern, count) {
    console.log(`patternPubSubClient punsubscribed from ${pattern}, ${count} total subscriptions`);
    patternPubSubPublisher2.end();
    patternPubSubPublisher1.end();
    patternPubSubClient.end();
});

patternPubSubClient.on(redisEvents.PMESSAGE, function(pattern, channel, message) {
    console.log(`Pattern:${pattern} => patternPubSubClient received message on ${channel}: ${message}`);
});

patternPubSubClient.on(redisEvents.READY, function() {
    // if you need auth, do it here
    patternPubSubClient.psubscribe('channel*');
});
