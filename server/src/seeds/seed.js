require('dotenv').config();
const { db, initDb } = require('../db');
const sampleTemplates = require('./templatesData');

async function seed(exitOnComplete = true) {
  try {
    await initDb();
    await db('favorites').del();
    await db('templates').del();
    try {
      await db.raw("DELETE FROM sqlite_sequence WHERE name IN ('templates', 'favorites')");
    } catch (e) {
      // Ignored if table doesn't use sequence
    }
    await db('templates').insert(sampleTemplates);
    console.log(`🎉 Successfully seeded ${sampleTemplates.length} templates!`);
    if (exitOnComplete) {
      process.exit(0);
    }
    return true;
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    if (exitOnComplete) {
      process.exit(1);
    }
    throw error;
  }
}

if (require.main === module) {
  seed(true);
}

module.exports = { seed };
