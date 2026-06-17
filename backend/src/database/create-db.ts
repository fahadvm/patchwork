import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Replace target DB with 'postgres' default database to allow creation
const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:fahad@localhost:5432/issues_db';
const connectionString = dbUrl.replace(/\/issues_db(\?.*)?$/, '/postgres$1');

const client = new Client({
  connectionString,
});

async function main() {
  console.log('Checking and creating database "issues_db" if it does not exist...');
  await client.connect();
  
  try {
    await client.query('CREATE DATABASE issues_db');
    console.log('Database "issues_db" successfully created.');
  } catch (err: any) {
    if (err.code === '42P04') {
      console.log('Database "issues_db" already exists.');
    } else {
      throw err;
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Failed to create database:', err);
  process.exit(1);
});
