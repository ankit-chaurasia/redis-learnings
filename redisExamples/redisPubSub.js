const redis = require('redis');
const { redisEvents } = require('../constants/redisConstants');

const pubSubClient = redis.createClient();
const pubSubPublisher = redis.createClient();

pubSubClient.on(redisEvents.CONNECT, function() {
    console.log('Redis pubSubClient connected');
});

pubSubClient.on(redisEvents.ERROR, function(err) {
    console.log(`Something went wrong ${err}`);
});

pubSubClient.on(redisEvents.SUBSCRIBE, function(channel, count) {
    console.log(`pubSubClient subscribed to ${channel} , ${count} total subscriptions`);
    pubSubPublisher.publish('myChannel', 'I am sending a message.');
});

pubSubClient.on(redisEvents.UNSUBSCRIBE, function(channel, count) {
    console.log(`pubSubClient unsubscribed from ${channel}, ${count} total subscriptions`);
    pubSubClient.end();
});

pubSubClient.on(redisEvents.MESSAGE, function(channel, message) {
    console.log(`pubSubClient received message on ${channel}: ${message}`);
});

pubSubClient.on(redisEvents.READY, function() {
    // if you need auth, do it here
    pubSubClient.subscribe('myChannel');
});
