const app = require('./app');

const server = require('http').createServer(app);
const PORT = process.env.PORT || 443;

server.listen(PORT, () => {
    console.clear();
    process.stdout.write('\033c');
    console.log('\n Starting server...');
    console.log('\x1b[31m' + ' server.js' + '\x1b[0m' + ' listening to port ' + '\x1b[33m' + PORT + '\x1b[0m');
    console.log('\x1b[96m' + ' http://localhost:' + PORT + '\x1b[0m');
    console.log('\n /**logs**/\n');
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});