const redisEvents = {
    CONNECT: 'connect',
    ERROR: 'error',
    SUBSCRIBE: 'subscribe',
    UNSUBSCRIBE: 'unsubscribe',
    MESSAGE: 'message',
    READY: 'ready',
    PSUBSCRIBE: 'psubscribe',
    PUNSUBSCRIBE: 'punsubscribe',
    PMESSAGE: 'pmessage'
}

module.exports = { redisEvents }
