import * as Knex from "knex";
import bcrypt from 'bcrypt'
import fs from 'fs'
const SALT_ROUNDS = 10
export async function seed(knex: Knex): Promise<void> {

    await knex.transaction(async (trx) => {
        // Deletes ALL existing entries
       


       
        // await trx("post_photopaths").del()
        // await trx("fav_post").del();
        // await trx('post_report').del()
        // await trx('comment_report').del()
        // await trx("comments").del();
        // await trx("posts").del();
        // await trx("report_cats").del();
        // await trx("categories").del();
        // await trx("users").del();
        // await trx("reported").del()
        // await trx("post_photopaths").del()

        // await trx("fav_post").del();
        // await trx('post_report').del()
        // await trx('comment_report').del()
        // await trx("comments").del();
        // await trx("posts").del();
        // await trx("report_cats").del();
        // await trx("categories").del();
        // await trx("users").del();
       
       
        const hash = await bcrypt.hash("123", SALT_ROUNDS);

        const users = await trx.insert([{
            email: "ian@tecky.io",
            username: "Zeus",
            password: hash
        }, {
            email: "li@tecky.io",
            username: "li",
            password: hash
        }, {
            email: "lee@gmail.com",
            username: "lee",
            password: hash
        },
        {
            email: "admin@gmail.com",
            username: "admin",
            password: hash,
            admin: true 
        }
        ]).into('users').returning('id');

    await trx.insert([{
        report_type:'暴力或令人反感的內容'
     },{
         report_type:'宣傳恐怖主義'
     },{
        report_type:'垃圾內容或誤導性內容'
     },{
         report_type:'仇恨或惡意內容'
     }
     ]).into('report_cats').returning('*')

     


        await trx.insert([{
            category: "政治"
        }, {
            category: "科技"
        },
        {
            category: "生活"
        },
        {
            category: "興趣"
        }

        ]).into('categories');



        function run() {
            return new Promise(function (resolve, reject) {
                let newArray: {}[] = [];
                fs.readFile('./lihkgdata.txt', 'utf-8', (err, data) => {
                    if (err) reject(err);
                    let array = data.split(/\r\n|\r|\n/)
                    for (const item of array) {
                        let user_id;
                        let tag = item.substring(0, 11)
                        let title = item.substring(12, 20)
                        let content = item.substring(21, 600)
                        let category_id;
                        let no_of_likes = 10;
                        let no_of_dislikes = 3;
                        let no_of_bookmarked = 4;
                        

                        switch (tag) {

                            case '__label__時事':
                            case '__label__Wo':
                            case '__label__政事':
                            case '__label__財經':
                            case '__label__娛樂':
                            case '__label__房屋':
                                user_id = 1
                                category_id = 1
                                break;

                            case '__label__手機':
                            case '__label__硬件':
                            case '__label__Ap':
                            case '__label__軟件':
                            case '__label__電訊':
                                user_id = 2
                                category_id = 2
                                break;

                            case '__label__創意':
                            case '__label__健康':
                            case '__label__飲食':
                            case '__label__感情':
                            case '__label__旅遊':
                            case '__label__上班':
                            case '__label__活動':
                            case '__label__校園':
                                user_id = 3
                                category_id = 3
                                break

                            case '__label__體育':
                            case '__label__學術':
                            case '__label__講故':
                            case '__label__遊戲':
                            case '__label__影視':
                            case '__label__動漫':
                            case '__label__攝影':
                            case '__label__音樂':
                            case '__label__汽車':
                            case '__label__寵物':
                            case '__label__潮流':
                            case '__label__玩具':
                            case '__label__直播':
                                user_id = 3
                                category_id = 4
                                break;

                            default:
                                continue
                        }

                        newArray.push({ user_id, category_id, title, no_of_likes, no_of_dislikes, no_of_bookmarked, content })

                    }

                    resolve(newArray)
                })
            })
        }
    //     await trx.insert([{
    //         post_id:'4444',
    //         post_type_id:1
    //     },{

    //         post_id:'4445',
    //         post_type_id:2
    //     },{
    //         post_id:'4447',
    //         post_type_id:3
    //     },{
    //         post_id:'4448',
    //         post_type_id:4
    //     }
    // ]).into('post_report').returning('*')

        await run().then(async response => {
            console.log(response)
            await trx.insert(response).into('posts').returning('id')
        }


        )

       

        // await trx.insert([{
        //     post_id: 2,
        //     user_id: 2,
        //     content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc",
        //     no_of_likes: 100,
        //     refer_id: null
        // },

        // {
        //     post_id: 2,
        //     user_id: 2,
        //     content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc",
        //     no_of_likes: 100,
        //     refer_id: 1
        // },


        // {
        //     post_id: 2,
        //     user_id: 2,
        //     content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc",
        //     no_of_likes: 100,
        //     refer_id: 1
        // }
        //     ,


        // {
        //     post_id: 2,
        //     user_id: 2,
        //     content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc",
        //     no_of_likes: 100,
        //     refer_id: 1
        // },


        // {
        //     post_id: 2,
        //     user_id: 2,
        //     content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc",
        //     no_of_likes: 100,
        //     refer_id: 1
        // },


        // {
        //     post_id: 2,
        //     user_id: 2,
        //     content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc",
        //     no_of_likes: 100,
        //     refer_id: 1
        // },


        // {
        //     post_id: 2,
        //     user_id: 2,
        //     content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc",
        //     no_of_likes: 100,
        //     refer_id: 1
        // }
        // ]).into('comments')



    })

};







//    await trx.insert([{
//     user_id:1,
//     category_id:1,
//     title:"test1",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:1,
//     category_id:1,
//     title:"test2",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:1,
//     category_id:1,
//     title:"test3",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:1,
//     category_id:1,
//     title:"test4",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:1,
//     category_id:1,
//     title:"test5",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:1,
//     category_id:1,
//     title:"test6",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:1,
//     category_id:1,
//     title:"test7",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:1,
//     category_id:1,
//     title:"test8",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:1,
//     category_id:1,
//     title:"test9",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:1,
//     category_id:1,
//     title:"test10",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:1,
//     category_id:1,
//     title:"test11",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:2,
//     category_id:2,
//     title:"test12",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:2,
//     category_id:2,
//     title:"test13",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:2,
//     category_id:2,
//     title:"test14",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:2,
//     category_id:2,
//     title:"test15",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:2,
//     category_id:2,
//     title:"test16",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:2,
//     category_id:2,
//     title:"test17",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:2,
//     category_id:2,
//     title:"test18",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:2,
//     category_id:2,
//     title:"test19",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:2,
//     category_id:2,
//     title:"test20",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:2,
//     category_id:2,
//     title:"test21",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:2,
//     category_id:2,
//     title:"test22",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
//    {
//     user_id:2,
//     category_id:2,
//     title:"test23",
//     no_of_likes:10,
//     no_of_dislikes:3,
//     no_of_bookmarked:4,
//     content:"test_1_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//    },
// ]).into('posts').returning('id');