const knex = require('knex');
const path = require('path');
const sampleTemplates = require('./seeds/templatesData');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'database.sqlite');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: dbPath
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb);
    }
  }
});

async function initDb() {
  // 1. Users Table
  const hasUsers = await db.schema.hasTable('users');
  if (!hasUsers) {
    await db.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    console.log('✅ Created "users" table.');
  }

  // 2. Templates Table
  const hasTemplates = await db.schema.hasTable('templates');
  if (!hasTemplates) {
    await db.schema.createTable('templates', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description').notNullable();
      table.text('thumbnail_url').notNullable();
      table.string('category').notNullable();
      table.string('price').defaultTo('Free');
      table.string('live_demo_url').nullable();
      table.text('tags').defaultTo('[]');
      table.text('features').defaultTo('[]');
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    console.log('✅ Created "templates" table.');
  }

  // 3. Favorites Table
  const hasFavorites = await db.schema.hasTable('favorites');
  if (!hasFavorites) {
    await db.schema.createTable('favorites', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE');
      table.integer('template_id').unsigned().notNullable()
        .references('id').inTable('templates').onDelete('CASCADE');
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.unique(['user_id', 'template_id']);
    });
    console.log('✅ Created "favorites" table.');
  }

  // 4. Seed sample templates if table is empty
  const countRes = await db('templates').count('id as count').first();
  const count = countRes ? Number(countRes.count) : 0;
  if (count === 0) {
    console.log('🌱 Seeding initial sample templates...');
    await db('templates').insert(sampleTemplates);
    console.log(`✅ Seeded ${sampleTemplates.length} sample templates.`);
  }
}

module.exports = {
  db,
  initDb
};
