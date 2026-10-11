/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // 1. Users Table
  const hasUsers = await knex.schema.hasTable('users');
  if (!hasUsers) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }

  // 2. Templates Table
  const hasTemplates = await knex.schema.hasTable('templates');
  if (!hasTemplates) {
    await knex.schema.createTable('templates', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description').notNullable();
      table.text('thumbnail_url').notNullable();
      table.string('category').notNullable();
      table.string('price').defaultTo('Free');
      table.string('live_demo_url').nullable();
      table.text('tags').defaultTo('[]');
      table.text('features').defaultTo('[]');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }

  // 3. Favorites Table
  const hasFavorites = await knex.schema.hasTable('favorites');
  if (!hasFavorites) {
    await knex.schema.createTable('favorites', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE');
      table.integer('template_id').unsigned().notNullable()
        .references('id').inTable('templates').onDelete('CASCADE');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.unique(['user_id', 'template_id']);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('favorites');
  await knex.schema.dropTableIfExists('templates');
  await knex.schema.dropTableIfExists('users');
};
