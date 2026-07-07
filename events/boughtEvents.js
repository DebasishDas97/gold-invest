import { EventEmitter } from 'node:events'
import { generateTransactionsPdf } from '../utils/generateTransactionsPdf.js';
import { sendMail } from '../utils/sendMail.js';

export const boughtEvents = new EventEmitter();

boughtEvents.on('bought', generateTransactionsPdf);
boughtEvents.on('pdf-ready', sendMail);