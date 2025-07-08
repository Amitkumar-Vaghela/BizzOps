// import fs from 'fs';
// import path from 'path';

// class Logger {
//     constructor() {
//         this.logDir = path.join(process.cwd(), 'logs');
//         this.ensureLogDirectory();
//     }

//     ensureLogDirectory() {
//         if (!fs.existsSync(this.logDir)) {
//             fs.mkdirSync(this.logDir, { recursive: true });
//         }
//     }

//     formatMessage(level, message, meta = {}) {
//         return JSON.stringify({
//             timestamp: new Date().toISOString(),
//             level,
//             message,
//             ...meta
//         }) + '\n';
//     }

//     writeToFile(filename, content) {
//         try {
//             const filepath = path.join(this.logDir, filename);
//             fs.appendFileSync(filepath, content);
//         } catch (error) {
//             console.error('Failed to write to log file:', error);
//         }
//     }

//     error(message, meta = {}) {
//         const logMessage = this.formatMessage('ERROR', message, meta);
//         console.error(logMessage.trim());
        
//         if (process.env.NODE_ENV === 'production') {
//             this.writeToFile('error.log', logMessage);
//         }
//     }

//     warn(message, meta = {}) {
//         const logMessage = this.formatMessage('WARN', message, meta);
//         console.warn(logMessage.trim());
        
//         if (process.env.NODE_ENV === 'production') {
//             this.writeToFile('combined.log', logMessage);
//         }
//     }

//     info(message, meta = {}) {
//         const logMessage = this.formatMessage('INFO', message, meta);
//         console.log(logMessage.trim());
        
//         if (process.env.NODE_ENV === 'production') {
//             this.writeToFile('combined.log', logMessage);
//         }
//     }

//     debug(message, meta = {}) {
//         if (process.env.NODE_ENV === 'development') {
//             const logMessage = this.formatMessage('DEBUG', message, meta);
//             console.log(logMessage.trim());
//         }
//     }
// }

// const logger = new Logger();
// export { logger };
