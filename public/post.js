const socket = io.connect();
socket.on('comment-update', () => {
    readAndDisplayComment()
})


let post_id = query.get("post")
let count = 0; 


async function readAndDisplayComment() {
    let contents = await readComments(parseInt(post_id), count)
    displayComments(contents, document.querySelector("#comment"))
}

readAndDisplayComment()

//start of comment service
//fetch post id to backend to get comments
async function readComments(post_id, offset, comment_id = null) {

    let res = await fetch('/getComment',
        {
            method: "POST",
            headers: {

                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ post_id, offset, comment_id }),
        }
    );
    let contents = await res.json();
    return contents
}


//show comments in dom
function displayComments(contents, container) {
    let commentNode = document.createElement('div')
    commentNode.classList.add("radius", "row", "comment-container", "my-3")
    commentNode.innerHTML =
        ` <div class="col-3 p-3 comment-user">
        <div class="photo-wrapper d-flex justify-content-center align-items-center">
            <div  class="border rounded-circle comment-user-photo user-photo"></div>
        </div>
        <div class="comment-user-info user-info">
            <p  class="comment-username text-center">李露眉</p>
            <div>
                <span>等級</span>
                <span class="comment-user-score">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </span>
            </div>
            <div><span>帖子:</span> <span class="comment-user-totalPost"> 200 </span> </div>
            <div><span>註冊時間:</span> <span class="comment-user-createdAt"> 2020-12-22 </span> </div>
        </div>
    </div>
    <div class="col-9 comment-content-wrapper">
        <div class="comment-content d-flex flex-column h-100">
            <div class="px-3 py-2 h-100">

                <div class="comment-info">
                    <span class="floor"></span>
                    <span>發表於</span>
                    <span class="comment-created-at">2020-12-27 04:23 PM </span>
                </div>

                <div class="quote-container my-2 none radius">
                <div class="p-1 quote-user">
                    引用 呀邊個 於 2020-12-26 04:23 PM發表：
                </div>
                <div class="p-2 quote">
                    C6 仲要話由得佢哋加，我自己幫佢除，即係無解決過個問題，打電話去醫院問姑娘，姑娘都話bb 唔使著太多，仲解釋埋原因，但奶奶覺得唔啱聽走咗去唔聽，勁煩囉...而家仲要坐緊月又唔可以走返外家，再係屋企對住佢兩個不停比佢哋轟炸，仲要講到好似我有衫唔比個女著咁，想死
                </div>
            </div>



                <div class="main-comment my-2 ql-editor">五花腩片我用打邊爐嗰隻，好薄
                    我冇其他調味
                    多小小油茄子拉油，盛起
                    炒香豆板醬，加小小糖調味，炒到五花腩大半熟，加茄子，加小小水，加蓋炆下佢
                </div>
            </div>

            <div class="comment-icon-wrapper icon-wrapper p-2">
                <div class="icon">
                    <div class="start">
                    <button class="icons like-btn">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M10.0319 5.64044L9.60067 7.99998H11.9993H13.6306C14.0408 7.99998 14.5862 8.22433 15.1035 8.93471C15.6195 9.64326 16 10.7205 16 12C16 13.2794 15.6195 14.3567 15.1035 15.0653C14.5862 15.7756 14.0408 16 13.6306 16H6.00001V7.91478L6.48336 6.78908L8.20189 2.78674C8.31439 2.61536 8.57049 2.3975 8.99786 2.27752C9.46791 2.14556 9.86607 2.21255 10.0681 2.32024C10.363 2.47743 10.4733 2.59637 10.5057 2.63686C10.5293 2.66634 10.5326 2.67765 10.5373 2.70119C10.5458 2.74399 10.5556 2.84276 10.5319 3.04004C10.507 3.24781 10.4583 3.47315 10.3842 3.80463L10.3812 3.81835C10.3434 3.98727 10.2978 4.19093 10.2594 4.39572L10.2593 4.39571L10.2576 4.40547L10.0319 5.64044ZM11.0089 0.555344C9.5208 -0.237934 7.22587 0.360625 6.40938 1.89228L4.64561 5.99998L4 5.99998H1C0.447715 5.99998 0 6.4477 0 6.99998V17C0 17.5523 0.447715 18 1 18L4.00001 18H6.00001H13.6306C16.0437 18 18 15.3137 18 12C18 8.87022 16.2549 6.30014 14.0279 6.02446C13.8971 6.00826 13.7645 5.99998 13.6306 5.99998H11.9993L12.225 4.76501C12.2571 4.5942 12.2962 4.41903 12.336 4.24097L12.3361 4.24052C12.3539 4.16087 12.3719 4.08065 12.3894 3.99998C12.6481 2.80619 12.8091 1.51496 11.0089 0.555344ZM2 16V7.99998H4V16H2Z"
                                fill="#b8b2b2" />
                        </svg>

                        <p class="no_of_likes">12</p>
                    </button>

                    <button class="icons dislike-btn">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M7.96813 12.3596L8.39933 10H6.00071H4.36944C3.9592 10 3.41383 9.77567 2.8965 9.06529C2.3805 8.35674 1.99999 7.27948 1.99999 6.00002C1.99999 4.72055 2.3805 3.6433 2.8965 2.93474C3.41383 2.22436 3.9592 2.00002 4.36944 2.00002H12V10.0852L11.5166 11.2109L9.79811 15.2133C9.68561 15.3846 9.42951 15.6025 9.00214 15.7225C8.53209 15.8544 8.13393 15.7875 7.93192 15.6798C7.63703 15.5226 7.52671 15.4036 7.49428 15.3631C7.47067 15.3337 7.46742 15.3224 7.46273 15.2988C7.45421 15.256 7.44445 15.1572 7.46812 14.96C7.49304 14.7522 7.54168 14.5268 7.61578 14.1954L7.61885 14.1816C7.65662 14.0127 7.70215 13.8091 7.74063 13.6043L7.74065 13.6043L7.74243 13.5945L7.96813 12.3596ZM6.99109 17.4447C8.4792 18.2379 10.7741 17.6394 11.5906 16.1077L13.3544 12L14 12H17C17.5523 12 18 11.5523 18 11V1.00002C18 0.447733 17.5523 1.71603e-05 17 1.71603e-05L14 1.52529e-05H12H4.36944C1.95626 1.52529e-05 -5.72205e-06 2.68631 -5.72205e-06 6.00002C-5.72205e-06 9.12978 1.74511 11.6999 3.97206 11.9755C4.10294 11.9917 4.23549 12 4.36944 12H6.00071L5.77502 13.235C5.74293 13.4058 5.70377 13.581 5.66396 13.759L5.66386 13.7595C5.64606 13.8391 5.62812 13.9193 5.61063 14C5.35186 15.1938 5.19094 16.485 6.99109 17.4447ZM16 2.00002V10H14V2.00002H16Z"
                                fill="#b8b2b2" />
                        </svg>

                        <p class="no_of_dislikes">20</p>
                    </button>

                    <button class="icons viewComment-btn">
                        <svg class="relative text-gray-300 fill-current"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                                clip-rule="evenodd" />
                        </svg>
                        <p class="no_of_comments">20</p>
                    </button>
                    </div>


    
                    <div class="end">
                     
                    <button class="icons reply-btn">
                        <svg id="i-reply" viewBox="0 0 32 32" width="16px" height="16px" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M10 6 L3 14 10 22 M3 14 L18 14 C26 14 30 18 30 26" />
                        </svg>

                        <p class="reply">引用</p>
                    </button>



                    <button class="icons reportComment-btn">
                        <svg id="i-flag" viewBox="0 0 32 32" width="16px" height="16px" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 2 L6 30 M6 6 L26 6 20 12 26 18 6 18" />
                        </svg>

                        <p class="report">檢舉</p>
                    </button>
                </div>
                </div>
            </div>
        </div>
    </div>`


    container.innerHTML = ""

    for (const content of contents) {
        let userPhoto = commentNode.querySelector(".comment-user-photo");
        let commentUsername = commentNode.querySelector(".comment-username");
        let userCreatedAt = commentNode.querySelector(".comment-user-createdAt");
        let commentCreatedAt = commentNode.querySelector(".comment-created-at");
        let mainComment = commentNode.querySelector(".main-comment");
        let no_of_like = commentNode.querySelector(".no_of_likes");
        let no_of_comments = commentNode.querySelector(".no_of_comments")
        let floor = commentNode.querySelector(".floor")
        let replyBtn = commentNode.querySelector('.reply-btn')
        let likeBtn = commentNode.querySelector('.like-btn')
        let reportButton = commentNode.querySelector('.reportComment-btn')
        userPhoto.style.backgroundImage = `url('/userIcon/${content.userIcon}')`;
        commentUsername.innerText = `${content.username}`
        userCreatedAt.innerText = `${moment(content.user_created_at).format('lll')}`
        commentCreatedAt.innerText = `${moment(content.comment_created_at).format('lll')}`
        no_of_like.innerText = `${content.no_of_likes}`
        no_of_comments.innerText = `${content.no_of_comments}`
        floor.innerText = `#${content.id}`
        replyBtn.dataset.id = content.id
        likeBtn.dataset.id = content.id
        reportButton.dataset.id = content.id
        replyBtn.dataset.username = content.username
        commentNode.dataset.comment_id = content.id
        result(content.content, mainComment)

        container.innerHTML += ` <div> ${commentNode.outerHTML}  </div>`
    }

    let popups = document.querySelectorAll('.reportComment-btn');

    for (const popup of popups) {
        popup.addEventListener('click', async () => {
            document.querySelector("#reportCommentGo").classList.remove("none")
        })
    }
    let closeBtn = document.querySelector('#reportComment-close');
    closeBtn.addEventListener('click', async () => {
        document.querySelector("#reportCommentGo").classList.add("none")
    })

    showOriginalComment(contents)
    addQuote()
    checkLikedComment()
    addCommentLike()
}


//show rich text in comments
function result(content, container, refer) {
    let el = document.createElement("div");
    let ql = new Quill(el, {});
    ql.setContents(content.ops);
    if (refer) {
        container.innerText = ql.root.innerText.substring(0, 300) + "...";
    } else {
        container.innerHTML = ql.root.innerHTML;
    }

}


//add a quote if comment is refering to another one
function showOriginalComment(contents) {
    for (let i = 0; i < contents.length; i++) {
        let refer = contents[i].original_comment
        let commentContainer = document.querySelector(`[data-comment_id='${contents[i].id}']`)
        if (refer) {
            commentContainer.querySelector(".quote-container").classList.remove("none");
            commentContainer.querySelector('.quote-user').innerText = `#${refer.id} 引用 ${refer.username} 於${moment(refer.created_at).format('lll')}發表：`
            result(refer.content, commentContainer.querySelector(".quote"), refer)
        }
    }
}

//check the color of like btn on page initiation
async function checkLikedComment() {
    let buttons = document.querySelectorAll(".comment-container .like-btn")

    for (const button of buttons) {
        let res = await fetch('/checklikedComment',
            {
                method: "POST",
                headers: {

                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({ comment_id: parseInt(button.dataset.id) }), // Specify the Request Body
            }

        );
        let result = await res.json();
        if (result.result) {
            button.querySelector("svg path").setAttribute('fill', '#E9E942')
            button.querySelector("svg path").setAttribute('d', 'M11.0089 0.555344C9.5208 -0.237934 7.22587 0.360625 6.40938 1.89228L4.64561 5.99998L4 5.99998H1C0.447715 5.99998 0 6.4477 0 6.99998V17C0 17.5523 0.447715 18 1 18L4.00001 18H6.00001H13.6306C16.0437 18 18 15.3137 18 12C18 8.87022 16.2549 6.30014 14.0279 6.02446C13.8971 6.00826 13.7645 5.99998 13.6306 5.99998H11.9993L12.225 4.76501C12.2571 4.5942 12.2962 4.41903 12.336 4.24097L12.3361 4.24052C12.3539 4.16087 12.3719 4.08065 12.3894 3.99998C12.6481 2.80619 12.8091 1.51496 11.0089 0.555344ZM2 16V7.99998H4V16H2Z')

        }
    }

}




//add click event for comments like submission
function addCommentLike() {
    let buttons = document.querySelectorAll(".comment-content-wrapper .like-btn")
    for (const button of buttons) {
        button.addEventListener("click", async (event) => {
            event.stopPropagation()
            let res = await fetch('/likeComment',    //send comment_id for immediate comment info update
                {
                    method: "POST",
                    headers: {

                        "Content-Type": "application/json; charset=utf-8",
                    },
                    body: JSON.stringify({ comment_id: parseInt(button.dataset.id) }),
                }
            );

            let result = res.json();
            let updatedComment = await readComments(parseInt(post_id), count, parseInt(button.dataset.id))
            displayComments(updatedComment, button.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode)
        }
        )
    }

}
//end of comment service



//start of post service
//show post content according to page's search param
async function readPost() {
    let res = await fetch('/getCommentPost',
        {
            method: "POST",
            headers: {

                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ post_id: parseInt(post_id) }),
        }
    );
    let result = await res.json();




    let post = document.createElement('div')
    post.innerHTML = `

<div id="post-wrap" class="radius">
<div id="title" class=" row">
    <div id="post-stat"
        class=" col-3 row  d-flex flex-row justify-content-center align-items-center">

        <i class="far fa-thumbs-up"></i> <span id="no-of-likes">100</span>
        <span>|</span>
        <i class="far fa-comments"></i> <span id="no-of-comments">20 </span>

    </div>
    <div id="post-title" class="col-9 px-3 py-2">
        <h1 class="text-center">今晚食乜餸</h1>
    </div>
</div>
<div id="post-container" class="row">
    <div id="post-user" class="col-3 p-3">
        <div id="photo-wrapper" class=" d-flex justify-content-center align-items-center">
            <div id="post-user-photo" class="border rounded-circle user-photo"></div>
        </div>
        <div id="post-user-info" class="user-info">
            <p id="post-username" class="text-center">李露眉</p>
            <div>
                <span>等級</span>
                <span id="post-user-score">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </span>
            </div>
            <div><span>帖子:</span> <span id="post-user-totalPost"> 200 </span> </div>
            <div><span>註冊時間:</span> <span id="post-user-createdAt"> 2020-12-22 </span> </div>
        </div>
    </div>
    <div id="post-content-wrapper" class="col-9">
        <div id="post-content" class="d-flex flex-column h-100">
            <div class="px-3 py-2 h-100">
                <div class="">
                    <span>發表於</span>
                    <span id="post-created-at">2020-12-27 04:23 PM </span>
                </div>
                <div id="main-post-content" class="my-2">

                    今日係Facebook見到人哋整呢個餸上星期日試吓整。。好似都唔係幾難整而且仲可以自己選擇南瓜入面個餡配搭。。好似幾大體。。。咁啱星期日同埋奶奶一家一齊食飯
                </div>

                <div id="post-image" class="d-flex flex-column align-items-center">
                   
                </div>

            </div>





            <div class="post-icon-wrapper p-2">
                <div class="icon">
                    <div class="start">
                        <button class="icons like-btn">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M10.0319 5.64044L9.60067 7.99998H11.9993H13.6306C14.0408 7.99998 14.5862 8.22433 15.1035 8.93471C15.6195 9.64326 16 10.7205 16 12C16 13.2794 15.6195 14.3567 15.1035 15.0653C14.5862 15.7756 14.0408 16 13.6306 16H6.00001V7.91478L6.48336 6.78908L8.20189 2.78674C8.31439 2.61536 8.57049 2.3975 8.99786 2.27752C9.46791 2.14556 9.86607 2.21255 10.0681 2.32024C10.363 2.47743 10.4733 2.59637 10.5057 2.63686C10.5293 2.66634 10.5326 2.67765 10.5373 2.70119C10.5458 2.74399 10.5556 2.84276 10.5319 3.04004C10.507 3.24781 10.4583 3.47315 10.3842 3.80463L10.3812 3.81835C10.3434 3.98727 10.2978 4.19093 10.2594 4.39572L10.2593 4.39571L10.2576 4.40547L10.0319 5.64044ZM11.0089 0.555344C9.5208 -0.237934 7.22587 0.360625 6.40938 1.89228L4.64561 5.99998L4 5.99998H1C0.447715 5.99998 0 6.4477 0 6.99998V17C0 17.5523 0.447715 18 1 18L4.00001 18H6.00001H13.6306C16.0437 18 18 15.3137 18 12C18 8.87022 16.2549 6.30014 14.0279 6.02446C13.8971 6.00826 13.7645 5.99998 13.6306 5.99998H11.9993L12.225 4.76501C12.2571 4.5942 12.2962 4.41903 12.336 4.24097L12.3361 4.24052C12.3539 4.16087 12.3719 4.08065 12.3894 3.99998C12.6481 2.80619 12.8091 1.51496 11.0089 0.555344ZM2 16V7.99998H4V16H2Z"
                                    fill="#b8b2b2" />
                            </svg>

                            <p class="no_of_likes">12</p>
                        </button>

                        <button class="icons dislike-btn">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M7.96813 12.3596L8.39933 10H6.00071H4.36944C3.9592 10 3.41383 9.77567 2.8965 9.06529C2.3805 8.35674 1.99999 7.27948 1.99999 6.00002C1.99999 4.72055 2.3805 3.6433 2.8965 2.93474C3.41383 2.22436 3.9592 2.00002 4.36944 2.00002H12V10.0852L11.5166 11.2109L9.79811 15.2133C9.68561 15.3846 9.42951 15.6025 9.00214 15.7225C8.53209 15.8544 8.13393 15.7875 7.93192 15.6798C7.63703 15.5226 7.52671 15.4036 7.49428 15.3631C7.47067 15.3337 7.46742 15.3224 7.46273 15.2988C7.45421 15.256 7.44445 15.1572 7.46812 14.96C7.49304 14.7522 7.54168 14.5268 7.61578 14.1954L7.61885 14.1816C7.65662 14.0127 7.70215 13.8091 7.74063 13.6043L7.74065 13.6043L7.74243 13.5945L7.96813 12.3596ZM6.99109 17.4447C8.4792 18.2379 10.7741 17.6394 11.5906 16.1077L13.3544 12L14 12H17C17.5523 12 18 11.5523 18 11V1.00002C18 0.447733 17.5523 1.71603e-05 17 1.71603e-05L14 1.52529e-05H12H4.36944C1.95626 1.52529e-05 -5.72205e-06 2.68631 -5.72205e-06 6.00002C-5.72205e-06 9.12978 1.74511 11.6999 3.97206 11.9755C4.10294 11.9917 4.23549 12 4.36944 12H6.00071L5.77502 13.235C5.74293 13.4058 5.70377 13.581 5.66396 13.759L5.66386 13.7595C5.64606 13.8391 5.62812 13.9193 5.61063 14C5.35186 15.1938 5.19094 16.485 6.99109 17.4447ZM16 2.00002V10H14V2.00002H16Z"
                                    fill="#b8b2b2" />
                            </svg>

                            <p class="no_of_dislikes">20</p>
                        </button>






                        <button class="icons viewComment-btn">
                            <svg class="relative text-gray-300 fill-current"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                                    clip-rule="evenodd" />
                            </svg>
                            <p class="no_of_comments">20</p>
                        </button>

                        <button class="icons bookmark-btn">
                            <svg class="text-gray-300 fill-current"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                                    clip-rule="evenodd" />
                            </svg>
                            <p class="no_of_bookmarked">1</p>
                        </button>
                    </div>



                    <div class="end">



                        <button class="icons report-btn">
                            <svg id="i-flag" viewBox="0 0 32 32" width="16px" height="16px"
                                fill="none" stroke="currentcolor" stroke-linecap="round"
                                stroke-linejoin="round" stroke-width="2">
                                <path d="M6 2 L6 30 M6 6 L26 6 20 12 26 18 6 18" />
                            </svg>

                            <p class="report">檢舉</p>
                        </button>
                    </div>



                </div>
            </div>


        </div>


    </div>
</div>`
    post.querySelector("#no-of-likes").innerText = result.no_of_likes;
    post.querySelector("#no-of-comments").innerText = result.no_of_comments;
    post.querySelector("#post-title h1").innerText = result.title;
    post.querySelector("#post-user-photo").style.backgroundImage = `url('/userIcon/${result.userIcon}')`;
    post.querySelector("#post-username").innerText = result.username;
    post.querySelector("#post-user-totalPost").innerText = result.userPostRecord;
    post.querySelector("#post-user-createdAt").innerText = moment(result.user_createdAt).format('lll');

    post.querySelector("#post-created-at").innerText = moment(result.post_createdAt).format('lll');
    post.querySelector("#main-post-content").innerText = result.content;
    for (const each of result.filepaths) {
        post.querySelector("#post-image").innerHTML += `<img src="./postImg/${each.filepath}">`
    }

    post.querySelector(".no_of_likes").innerText = result.no_of_likes;
    post.querySelector(".no_of_dislikes").innerText = result.no_of_dislikes;
    post.querySelector(".no_of_comments").innerText = result.no_of_comments;
    post.querySelector(".no_of_bookmarked").innerText = result.no_of_bookmarked;

    document.querySelector('#post').innerHTML = post.innerHTML

    let popups = document.querySelector('.report-btn');

    popups.addEventListener('click', async () => {

        document.querySelector("#reportPostGo").classList.remove("none")
    })

    let closeBtn = document.querySelector('#report-close');
    closeBtn.addEventListener('click', async () => {

        document.querySelector("#reportPostGo").classList.add("none")
    })


    checkPostLiked()
    likePost()
    checkPostDislike()
    disLikePost()
}


readPost()

//check like btn color on post div on generation
async function checkPostLiked() {

    let button = document.querySelector("#post-wrap .like-btn")
    let res = await fetch('/checkPostLike',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ post_id: parseInt(post_id) }), // Specify the Request Body
        }
    );

    let result = await res.json()

    if (result.result) {
        button.querySelector("svg path").setAttribute('fill', '#E9E942')
        button.querySelector("svg path").setAttribute('d', 'M11.0089 0.555344C9.5208 -0.237934 7.22587 0.360625 6.40938 1.89228L4.64561 5.99998L4 5.99998H1C0.447715 5.99998 0 6.4477 0 6.99998V17C0 17.5523 0.447715 18 1 18L4.00001 18H6.00001H13.6306C16.0437 18 18 15.3137 18 12C18 8.87022 16.2549 6.30014 14.0279 6.02446C13.8971 6.00826 13.7645 5.99998 13.6306 5.99998H11.9993L12.225 4.76501C12.2571 4.5942 12.2962 4.41903 12.336 4.24097L12.3361 4.24052C12.3539 4.16087 12.3719 4.08065 12.3894 3.99998C12.6481 2.80619 12.8091 1.51496 11.0089 0.555344ZM2 16V7.99998H4V16H2Z')

    } else {
        button.querySelector("svg path").setAttribute('fill', '#b8b2b2')
        button.querySelector("svg path").setAttribute('d', 'M10.0319 5.64044L9.60067 7.99998H11.9993H13.6306C14.0408 7.99998 14.5862 8.22433 15.1035 8.93471C15.6195 9.64326 16 10.7205 16 12C16 13.2794 15.6195 14.3567 15.1035 15.0653C14.5862 15.7756 14.0408 16 13.6306 16H6.00001V7.91478L6.48336 6.78908L8.20189 2.78674C8.31439 2.61536 8.57049 2.3975 8.99786 2.27752C9.46791 2.14556 9.86607 2.21255 10.0681 2.32024C10.363 2.47743 10.4733 2.59637 10.5057 2.63686C10.5293 2.66634 10.5326 2.67765 10.5373 2.70119C10.5458 2.74399 10.5556 2.84276 10.5319 3.04004C10.507 3.24781 10.4583 3.47315 10.3842 3.80463L10.3812 3.81835C10.3434 3.98727 10.2978 4.19093 10.2594 4.39572L10.2593 4.39571L10.2576 4.40547L10.0319 5.64044ZM11.0089 0.555344C9.5208 -0.237934 7.22587 0.360625 6.40938 1.89228L4.64561 5.99998L4 5.99998H1C0.447715 5.99998 0 6.4477 0 6.99998V17C0 17.5523 0.447715 18 1 18L4.00001 18H6.00001H13.6306C16.0437 18 18 15.3137 18 12C18 8.87022 16.2549 6.30014 14.0279 6.02446C13.8971 6.00826 13.7645 5.99998 13.6306 5.99998H11.9993L12.225 4.76501C12.2571 4.5942 12.2962 4.41903 12.336 4.24097L12.3361 4.24052C12.3539 4.16087 12.3719 4.08065 12.3894 3.99998C12.6481 2.80619 12.8091 1.51496 11.0089 0.555344ZM2 16V7.99998H4V16H2Z')
    }
}

//check dislike btn color on post div
async function checkPostDislike() {

    let button = document.querySelector("#post-wrap .dislike-btn")
    let res = await fetch('/checkPostDislike',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ post_id: parseInt(post_id) }),
        }
    );

    let result = await res.json()

    if (result.result) {
        button.querySelector("svg path").setAttribute('fill', '#EF1414')
        button.querySelector("svg path").setAttribute('d', 'M6.99109 17.4447C8.4792 18.2379 10.7741 17.6394 11.5906 16.1077L13.3544 12L14 12H17C17.5523 12 18 11.5523 18 11V1.00002C18 0.447733 17.5523 1.71603e-05 17 1.71603e-05L14 1.52529e-05H12H4.36944C1.95626 1.52529e-05 -5.72205e-06 2.68631 -5.72205e-06 6.00002C-5.72205e-06 9.12978 1.74511 11.6999 3.97206 11.9755C4.10294 11.9917 4.23549 12 4.36944 12H6.00071L5.77502 13.235C5.74293 13.4058 5.70377 13.581 5.66396 13.759L5.66386 13.7595C5.64606 13.8391 5.62812 13.9193 5.61063 14C5.35186 15.1938 5.19094 16.485 6.99109 17.4447ZM16 2.00002V10H14V2.00002H16Z')

    } else {
        button.querySelector("svg path").setAttribute('fill', '#b8b2b2')
        button.querySelector("svg path").setAttribute('d', 'M7.96813 12.3596L8.39933 10H6.00071H4.36944C3.9592 10 3.41383 9.77567 2.8965 9.06529C2.3805 8.35674 1.99999 7.27948 1.99999 6.00002C1.99999 4.72055 2.3805 3.6433 2.8965 2.93474C3.41383 2.22436 3.9592 2.00002 4.36944 2.00002H12V10.0852L11.5166 11.2109L9.79811 15.2133C9.68561 15.3846 9.42951 15.6025 9.00214 15.7225C8.53209 15.8544 8.13393 15.7875 7.93192 15.6798C7.63703 15.5226 7.52671 15.4036 7.49428 15.3631C7.47067 15.3337 7.46742 15.3224 7.46273 15.2988C7.45421 15.256 7.44445 15.1572 7.46812 14.96C7.49304 14.7522 7.54168 14.5268 7.61578 14.1954L7.61885 14.1816C7.65662 14.0127 7.70215 13.8091 7.74063 13.6043L7.74065 13.6043L7.74243 13.5945L7.96813 12.3596ZM6.99109 17.4447C8.4792 18.2379 10.7741 17.6394 11.5906 16.1077L13.3544 12L14 12H17C17.5523 12 18 11.5523 18 11V1.00002C18 0.447733 17.5523 1.71603e-05 17 1.71603e-05L14 1.52529e-05H12H4.36944C1.95626 1.52529e-05 -5.72205e-06 2.68631 -5.72205e-06 6.00002C-5.72205e-06 9.12978 1.74511 11.6999 3.97206 11.9755C4.10294 11.9917 4.23549 12 4.36944 12H6.00071L5.77502 13.235C5.74293 13.4058 5.70377 13.581 5.66396 13.759L5.66386 13.7595C5.64606 13.8391 5.62812 13.9193 5.61063 14C5.35186 15.1938 5.19094 16.485 6.99109 17.4447ZM16 2.00002V10H14V2.00002H16Z')
    }
}


//click like on post div
async function likePost() {
    document.querySelector("#post-wrap .like-btn").addEventListener("click", async (event) => {
        let res = await fetch('/likePost',
            {
                method: "POST",
                headers: {

                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({ post_id: parseInt(post_id) }),
            }
        );

        let result = await res.json();
        readPost()   //immediate update post
    })

}



//click dislike on post div
async function disLikePost() {
    document.querySelector("#post-wrap .dislike-btn").addEventListener("click", async (event) => {
        let res = await fetch('/disLikePost',
            {
                method: "POST",
                headers: {

                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({ post_id: parseInt(post_id) }),
            }
        );

        let result = await res.json();
        readPost() //immediate refresh post div
    })

}

//end of post service


//start of comment adding
let replyUser = document.querySelector('.reply-to') //the reply-div in form

let commentShadow = document.querySelector(".form-shadow")
document.querySelector(".commentBtn").addEventListener("click", (e) => {
    commentShadow.classList.remove("none")
})

//clear the reply-target
document.querySelector(".close-comment").addEventListener("click", (e) => {
    commentShadow.classList.add("none")
    replyUser.classList.add('none')
    replyUser.innerText = ""
    replyUser.removeAttribute('data-reply-id')
})

//add reply target in comment form
function addQuote() {
    let replyBtn = document.querySelectorAll(".reply-btn")
    for (const btn of replyBtn) {
        btn.addEventListener("click", (event) => {
            commentShadow.classList.remove("none")
            replyUser.dataset.replyId = event.currentTarget.dataset.id
            replyUser.classList.remove('none')
            replyUser.innerText = `回覆${event.currentTarget.dataset.username}的帖子：`
        })
    }
}


//add submit event for comment submission
document.querySelector("#comment-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    let DATA = quill.getContents();

    // 1. Loop over each insert item in ops array
    // 2. use fetch(img).then(res=>res.blob()).then(blob=> new File([blob],'abc.png'))
    // 3. Server side use multer receive file, get back filename
    // 4. Replace the base64 data url stirng <img src="/path/to/file" alt="" />

    let refer_id;
    if (replyUser.dataset.replyId) {
        refer_id = parseInt(replyUser.dataset.replyId);
    } else {
        refer_id = null;
    }
    let res = await fetch('/addComment',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ comment: DATA, post_id: post_id, refer_id: refer_id }),
        }
    );

    let result = await res.json()

    if (result.result == false) {
        alert("Please Log in")
    } else {
        let check = document.querySelector('.success-checkmark');
        commentShadow.querySelector(".submit-comment").classList.add("none")
        setTimeout(() => check.classList.remove("none"), 10);
        commentShadow.querySelector("#editor .ql-editor").innerHTML = "";
        setTimeout(() => {
            commentShadow.classList.add("none");
            commentShadow.querySelector(".submit-comment").classList.remove("none")
            check.classList.add("none")
        }, 1000);
        await readPost()
        await readAndDisplayComment()
        socket.emit("renew-comment-toServer");
    }

})

//end of comment adding



async function goReport(post_id, value) {

    const res = await fetch('/report', {

        method: "POST",
        headers: {

            "Content-Type": "application/json; charset=utf-8",
            'accept': 'application/json'
        },
        body: JSON.stringify({
            post_id: post_id, CatId: value
        }),
    })


    const json = await res.json();


    if (json.result) {
        alert('Report Successfully!')
    } else {
        alert('Please login!')
    }
}


async function goReportComment(comment_id, value) {

    let button = document.querySelectorAll('.reportComment-btn')

    const res = await fetch('/reportComment', {

        method: "POST",
        headers: {

            "Content-Type": "application/json; charset=utf-8",
            'accept': 'application/json'
        },
        body: JSON.stringify({
            comment_id: parseInt(comment_id), CatId: parseInt(value)
        }),
    })


    const json = await res.json();


    if (json.result) {
        alert('Report Successfully!')
    } else {
        alert('Please login!')
    }


}




const reportCommentForm = document.querySelector('#reportedComment-form')



reportCommentForm.addEventListener('submit', async (event) => {
    let buttons = document.querySelectorAll('.reportComment-btn')
    for (const button of buttons) {
        event.preventDefault();

        let repCats = document.querySelectorAll('.repCCat')

        for (let repCat of repCats) {
            if (repCat.checked) {

                document.querySelector("#reportCommentGo").classList.add("none")
                return goReportComment(button.dataset.id, repCat.name)
            }
        }


    }

})





const reportForm = document.querySelector('#reported-form')
reportForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    let repCats = document.querySelectorAll('.repCat')

    for (let repCat of repCats) {
        if (repCat.checked) {


            document.querySelector("#reportPostGo").classList.add("none")
            return goReport(post_id, repCat.name)
        }
    }

})



window.onscroll = function () { progressBar() };

function progressBar() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
}



//rich-text editor
var ColorClass = Quill.import('attributors/class/color');
var SizeStyle = Quill.import('attributors/style/size');

var direction = Quill.import('attributors/attribute/direction');
var align = Quill.import('attributors/class/align');
var background = Quill.import('attributors/class/background');
var directions = Quill.import('attributors/class/direction');
var fonts = Quill.import('attributors/class/font');
var size = Quill.import('attributors/class/size');
var aligns = Quill.import('attributors/style/align');
var backgrounds = Quill.import('attributors/style/background');
var color = Quill.import('attributors/style/color');
var directiones = Quill.import('attributors/style/direction');
var font = Quill.import('attributors/style/font');
Quill.register(ColorClass, true);
Quill.register(SizeStyle, true);
Quill.register(direction, true);
Quill.register(align, true);
Quill.register(background, true);
Quill.register(directions, true);
Quill.register(fonts, true);
Quill.register(ColorClass, true);
Quill.register(size, true);
Quill.register(aligns, true);
Quill.register(backgrounds, true);
Quill.register(color, true);
Quill.register(directiones, true);
Quill.register(font, true);

let quill = new Quill("#editor", {
    theme: "snow",
    modules: {
        toolbar: [

            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ]
    }
})