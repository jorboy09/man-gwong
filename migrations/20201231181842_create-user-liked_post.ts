import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users_liked', (table)=>{
        table.increments()
        // Need to call notNullable()
        table.integer('user_id').notNullable;
        table.integer('liked_post_id').notNullable;
        table.foreign('user_id').references('users.id')
        table.foreign('liked_post_id').references('posts.id')
    })

    await knex.schema.createTable('users_unliked', (table)=>{
        table.increments();
        table.integer('user_id').notNullable;
        table.integer('unliked_post_id').notNullable;
        table.foreign('user_id').references('users.id');
        table.foreign('unliked_post_id').references('posts.id')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('users_unliked');
    await knex.schema.dropTableIfExists('users_liked');
}

