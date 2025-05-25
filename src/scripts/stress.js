// scripts/stress.js
import http from 'node:http';
import { randomUUID } from 'node:crypto';

const USERS = 1000;
let sold = 0;

const makePurchase = () =>
  /** @type {Promise<void>} */(/** @type {Promise<void>} */(new Promise((resolve) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/purchase',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': randomUUID(),
        },
      },
      (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            sold += 1;
          }
          resolve();
        });
      }
    );

    req.on('error', (err) => {
      console.error('Request failed:', err.message);
      resolve();
    });

    req.write(JSON.stringify({ quantity: 1 }));
    req.end();
  })));

const runStressTest = async () => {
  console.log(`Starting stress test with ${USERS} users...`);
  await Promise.all(Array.from({ length: USERS }, () => makePurchase()));
  console.log(`Sold seats: ${sold}/${USERS}`);
};

runStressTest();


