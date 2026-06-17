import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/issues_db',
});

const db = drizzle(pool, { schema });

async function main() {
  console.log('Seeding database...');

  // 1. Clean tables
  await db.delete(schema.aiAnalyses);
  await db.delete(schema.comments);
  await db.delete(schema.issues);

  // 2. Insert 5 issues
  const insertedIssues = await db
    .insert(schema.issues)
    .values([
      {
        title: 'Authentication bypass on login endpoint',
        description: 'Under certain conditions, passing a null or blank token skips OAuth verification. This is a severe security issue.',
        status: 'open',
        priority: 'high',
      },
      {
        title: 'Database connection timeout under high load',
        description: 'When traffic spikes to 500 req/sec, the database connection pool exhausts, causing 504 gateway timeouts.',
        status: 'in-progress',
        priority: 'high',
      },
      {
        title: 'Minor UI alignment issue in sidebar navigation',
        description: 'The dashboard link icon is shifted 2px to the left compared to other items.',
        status: 'open',
        priority: 'low',
      },
      {
        title: 'Incorrect coupon code discount calculation',
        description: 'Applying a 10% coupon to a cart with a free item discounts the entire cart price by 10% instead of ignoring the free item.',
        status: 'closed',
        priority: 'medium',
      },
      {
        title: 'Add search functionality to issues page',
        description: 'Users should be able to search for issues by title or keyword. This will improve navigation and issue discovery.',
        status: 'in-progress',
        priority: 'medium',
      },
    ])
    .returning();

  console.log(`Inserted ${insertedIssues.length} issues`);

  // 3. Insert comments
  const commentsToInsert = [
    // Issue 0
    {
      issueId: insertedIssues[0].id,
      authorName: 'Alice Security',
      body: 'I reproduced this locally. We need to validate that the token is not null or undefined BEFORE passing it to the validation library.',
    },
    {
      issueId: insertedIssues[0].id,
      authorName: 'Bob Dev',
      body: 'Working on a fix right now. I will submit a PR with a unit test to verify this behaviour.',
    },
    // Issue 1
    {
      issueId: insertedIssues[1].id,
      authorName: 'Charlie Ops',
      body: 'Can we increase the max connection limit from 10 to 50 in our NestJS pool configuration?',
    },
    {
      issueId: insertedIssues[1].id,
      authorName: 'Dave Backend',
      body: 'Yes, but we also need to optimize our queries. The issues list endpoint is fetching comments in a loop, which is causing N+1 query problems.',
    },
    // Issue 2
    {
      issueId: insertedIssues[2].id,
      authorName: 'Emily Frontend',
      body: 'It looks like a simple CSS flexbox gap/alignment issue. I will take a look.',
    },
    // Issue 3
    {
      issueId: insertedIssues[3].id,
      authorName: 'Frank Business',
      body: 'Thanks for fixing this so quickly! Our sales numbers were slightly off because of this.',
    },
    // Issue 4
    {
      issueId: insertedIssues[4].id,
      authorName: 'Grace Product',
      body: 'Could we also search within comments, or just title and description?',
    },
    {
      issueId: insertedIssues[4].id,
      authorName: 'Dave Backend',
      body: 'Initially, we will support search on title and description. Adding full-text search on comments can be a fast follow.',
    },
  ];

  await db.insert(schema.comments).values(commentsToInsert);
  console.log(`Inserted ${commentsToInsert.length} comments`);

  console.log('Seeding complete!');
  await pool.end();
}

main().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
