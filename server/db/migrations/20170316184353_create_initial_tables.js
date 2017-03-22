exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('pg_tweets', t => {
      t.increments('id');
      t.string('poster_name', 15).notNullable().defaultTo('Anonymous');
      t.string('company', 20).notNullable();
      t.string('location', 15).notNullable().defaultTo('');
      t.string('country', 15).notNullable().defaultTo('');
      t.string('title', 20).notNullable().defaultTo('');
      t.string('content', 1500).notNullable();
      t.integer('like_count').notNullable().defaultTo(0);
      t.integer('flag_count').notNullable().defaultTo(0);
      t.timestamps(true, true);
      t.timestamp('deleted_at');
    }),
    knex.schema.createTableIfNotExists('twitter_ids', t => {
      t.increments('id');
      t.bigInteger('pg_tweet_id').notNullable().references('pg_tweets.id');
      t.bigInteger('twitter_id').notNullable();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('twitter_ids'),
    knex.schema.dropTable('pg_tweets')
  ]);
};
