import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users',(table)=>{
        table.increments()
        table.string('username')
        table.string('email')
        table.string('password')
        table.integer("admin").defaultTo(0).unsigned()
        table.string("userIcon").defaultTo('none')
        table.timestamps(false, true)

    
    })

    await knex.schema.createTable('categories',(table)=>{
        table.increments()
        table.string('category')
    
    })

    await knex.schema.createTable("report_cats",(table)=>{
        table.increments();
        table.string("report_type").notNullable;

    })

    await knex.schema.createTable('posts',(table)=>{
        table.increments();
        table.integer('user_id').notNullable().unsigned();
        table.integer('category_id').notNullable().unsigned();
        table.string('title').notNullable();
        table.integer('no_of_likes').notNullable().unsigned();
        table.integer('no_of_dislikes').notNullable().unsigned();
        table.integer('no_of_bookmarked').notNullable().unsigned();
        table.integer('report_cat_id').unsigned();
        table.text("content").notNullable();
        table.timestamps(false, true);

        table.foreign('user_id').references('users.id');
        table.foreign('category_id').references('categories.id');
        table.foreign("report_cat_id").references('report_cats.id')

    })

    await knex.schema.createTable('comments',(table)=>{
        table.increments();
        table.integer("post_id").notNullable;
        table.integer("user_id").notNullable;
        table.text("content").notNullable;
        table.integer("no_of_likes").notNullable;
        table.integer("refer_id").notNullable;
        table.integer('report_cat_id').unsigned();
        table.timestamps(false, true);

        // table.integer("post_id").unsigned();
        // table.integer("user_id").unsigned();
        table.foreign('post_id').references('posts.id');
        table.foreign('user_id').references('users.id');
        table.foreign("report_cat_id").references('report_cats.id');
    })

    await knex.schema.createTable('fav_post',(table)=>{
        table.increments();
        table.integer("user_id").notNullable;
        table.integer("post_id").notNullable;
        table.foreign('user_id').references('users.id');
         table.foreign('post_id').references('posts.id');
    })



    await knex.schema.createTable('post_photopaths',(table)=>{
        table.increments();
        table.integer("post_id").notNullable;
        table.string("filepath").notNullable;
        table.foreign('post_id').references('posts.id');

    })

    await knex.schema.createTable('comment_report',(table)=>{
        table.increments();
        table.integer('comment_id').notNullable
        table.integer('comment_type_id').notNullable

        table.foreign('comment_id').references('comments.id');
        table.foreign("comment_type_id").references('report_cats.id');


    })

    await knex.schema.createTable('post_report',(table)=>{
        table.increments();
        table.integer('post_id').notNullable
        table.integer('post_type_id').notNullable

        table.foreign('post_id').references('posts.id');
        table.foreign("post_type_id").references('report_cats.id');
    })


}



export async function down(knex: Knex): Promise<void> {
    
    await knex.schema.dropTableIfExists("post_report");
    await knex.schema.dropTableIfExists("comment_report");
    await knex.schema.dropTableIfExists("post_photopaths");
    await knex.schema.dropTableIfExists("fav_post");
    await knex.schema.dropTableIfExists("comments");
    await knex.schema.dropTableIfExists("posts");
    await knex.schema.dropTableIfExists("categories");
    await knex.schema.dropTableIfExists("report_cats");
    await knex.schema.dropTableIfExists("users");
}






  
    // await knex.schema.createTable('reported',(table)=>{
    //     table.increments();
    //     table.integer("post_id").notNullable;
    //     table.integer("comment_id").notNullable;
    //     table.integer('comment_of_comment_id').notNullable
    //     table.integer("reported_category").notNullable;
    //     table.text('content').notNullable
    //     // table.integer("reported_cat2").notNullable;
    //     // table.integer("reported_cat3").notNullable;
    //     // table.integer("reported_cat4").notNullable;
    //     // table.integer("no_of_reported").notNullable;

    //     table.foreign('post_id').references('posts.id');
    //     table.foreign('comment_id').references('comments.id');
    //     table.foreign('comment_of_comment_id').references('comment_of_comment.id')
    //     table.foreign('reported_category').references('report_cats.id');

    //     // table.foreign('reported_cat2').references('report_cats.id');
    //     // table.foreign('reported_cat3').references('report_cats.id');
    //     // table.foreign('reported_cat4').references('report_cats.id');

    // })









