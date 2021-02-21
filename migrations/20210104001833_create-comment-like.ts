import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('user_liked_comment', (table)=>{
        table.increments()
        table.integer('user_id').notNullable;
        table.integer('liked_comment_id').notNullable;
        table.foreign('user_id').references('users.id')
        table.foreign('liked_comment_id').references('comments.id')
    })
    await knex.schema.alterTable('comments',(table)=>{
        table.dropColumn('no_of_likes');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('user_liked_comment');
    await knex.schema.alterTable('comments',(table)=>{
        table.integer("no_of_likes").defaultTo(0).nullable()
    })
}