exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('tweets', t => {
      t.increments('id');
      t.string('poster_name', 20).notNullable().defaultTo('Anonymous');
      t.string('plant_name', 20).notNullable().defaultTo('Unknown_Plant');
      t.string('country', 20).notNullable().defaultTo('Unknown_Country');
      t.string('hashtags', 66).notNullable();
      t.string('content', 1500).notNullable();
      t.integer('like_count').notNullable().defaultTo(0);
      t.integer('flag_count').notNullable().defaultTo(0);
      t.timestamps(true, true);
      t.timestamp('deleted_at');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('tweets')
  ]);
};
