//get Post content and set pagination
async function readPost() {
  const query = new URLSearchParams(location.search);
  let page = query.get("page")
  let category = query.get("category")
  let search = query.get('search')

  if (page == null) {
    page = 1
  } else {
    page = parseInt(page)
  }
  if (category == null && search != null) {
    await searchtext(search, page)
  } else if (category == null) {
    category = 0
    await getPosts(category, page)
  } else {
    category = parseInt(category)
    await getPosts(category, page)
  }
}

async function getPosts(category, page) {
  const res = await fetch('/getPost', {
    method: "POST",
    headers: {
     
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      page: page,
      category: category
    }), 
  });
  const contents = await res.json();
  displayPost(contents.current_page_content)
  pagination(page, contents.no_of_page, category)
}

readPost()


function displayPost(contents) {


  let postContainer = document.querySelector("#post-inner-container")
  postContainer.innerHTML = ""


  for (const content of contents) {
    let postNode = document.createElement('div')
    postNode.innerHTML = `
  <div class="title-row">
      <div class="marking">
          <div class="politics-mark"><i class="fas fa-exclamation"></i></div>
          <div class="cat-mark"></div>
      </div>
      <p class="title"></p>
      <div class="report">
          
          <svg viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M21 25L11 18.3333L1 25V3.66667C1 2.95942 1.30102 2.28115 1.83684 1.78105C2.37266 1.28095 3.09938 1 3.85714 1H18.1429C18.9006 1 19.6273 1.28095 20.1632 1.78105C20.699 2.28115 21 2.95942 21 3.66667V25Z"
                  stroke="#24292E" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
          </svg>
      </div>
  </div>
  <p class="post-content"> 
  </p>
  <div class="footer">
      <div class="icon">
          <div class="icons">
              <svg class="text-gray-300 fill-current" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd" />
              </svg>
              <p class="created_at"></p>
          </div>

          <div class="icons">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0319 5.64044L9.60067 7.99998H11.9993H13.6306C14.0408 7.99998 14.5862 8.22433 15.1035 8.93471C15.6195 9.64326 16 10.7205 16 12C16 13.2794 15.6195 14.3567 15.1035 15.0653C14.5862 15.7756 14.0408 16 13.6306 16H6.00001V7.91478L6.48336 6.78908L8.20189 2.78674C8.31439 2.61536 8.57049 2.3975 8.99786 2.27752C9.46791 2.14556 9.86607 2.21255 10.0681 2.32024C10.363 2.47743 10.4733 2.59637 10.5057 2.63686C10.5293 2.66634 10.5326 2.67765 10.5373 2.70119C10.5458 2.74399 10.5556 2.84276 10.5319 3.04004C10.507 3.24781 10.4583 3.47315 10.3842 3.80463L10.3812 3.81835C10.3434 3.98727 10.2978 4.19093 10.2594 4.39572L10.2593 4.39571L10.2576 4.40547L10.0319 5.64044ZM11.0089 0.555344C9.5208 -0.237934 7.22587 0.360625 6.40938 1.89228L4.64561 5.99998L4 5.99998H1C0.447715 5.99998 0 6.4477 0 6.99998V17C0 17.5523 0.447715 18 1 18L4.00001 18H6.00001H13.6306C16.0437 18 18 15.3137 18 12C18 8.87022 16.2549 6.30014 14.0279 6.02446C13.8971 6.00826 13.7645 5.99998 13.6306 5.99998H11.9993L12.225 4.76501C12.2571 4.5942 12.2962 4.41903 12.336 4.24097L12.3361 4.24052C12.3539 4.16087 12.3719 4.08065 12.3894 3.99998C12.6481 2.80619 12.8091 1.51496 11.0089 0.555344ZM2 16V7.99998H4V16H2Z" fill="#b8b2b2"/>
                  </svg>
                  
              <p class="no_of_likes"></p>
          </div>

          <div class="icons">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.96813 12.3596L8.39933 10H6.00071H4.36944C3.9592 10 3.41383 9.77567 2.8965 9.06529C2.3805 8.35674 1.99999 7.27948 1.99999 6.00002C1.99999 4.72055 2.3805 3.6433 2.8965 2.93474C3.41383 2.22436 3.9592 2.00002 4.36944 2.00002H12V10.0852L11.5166 11.2109L9.79811 15.2133C9.68561 15.3846 9.42951 15.6025 9.00214 15.7225C8.53209 15.8544 8.13393 15.7875 7.93192 15.6798C7.63703 15.5226 7.52671 15.4036 7.49428 15.3631C7.47067 15.3337 7.46742 15.3224 7.46273 15.2988C7.45421 15.256 7.44445 15.1572 7.46812 14.96C7.49304 14.7522 7.54168 14.5268 7.61578 14.1954L7.61885 14.1816C7.65662 14.0127 7.70215 13.8091 7.74063 13.6043L7.74065 13.6043L7.74243 13.5945L7.96813 12.3596ZM6.99109 17.4447C8.4792 18.2379 10.7741 17.6394 11.5906 16.1077L13.3544 12L14 12H17C17.5523 12 18 11.5523 18 11V1.00002C18 0.447733 17.5523 1.71603e-05 17 1.71603e-05L14 1.52529e-05H12H4.36944C1.95626 1.52529e-05 -5.72205e-06 2.68631 -5.72205e-06 6.00002C-5.72205e-06 9.12978 1.74511 11.6999 3.97206 11.9755C4.10294 11.9917 4.23549 12 4.36944 12H6.00071L5.77502 13.235C5.74293 13.4058 5.70377 13.581 5.66396 13.759L5.66386 13.7595C5.64606 13.8391 5.62812 13.9193 5.61063 14C5.35186 15.1938 5.19094 16.485 6.99109 17.4447ZM16 2.00002V10H14V2.00002H16Z" fill="#b8b2b2"/>
                  </svg>
                  
              <p class="no_of_dislikes"></p>
          </div>

          <div class="icons">
              <svg class="relative text-gray-300 fill-current" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                      d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                      clip-rule="evenodd" />
              </svg>
              <p class="no_of_comments"></p>
          </div>

          <div class="icons">
              <svg class="text-gray-300 fill-current" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                      d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                      clip-rule="evenodd" />
              </svg>
              <p class="no_of_bookmarked">1</p>
          </div>
         
      </div>

      <div class="post-creator">
          <div class="creator-photo">
          </div>
          <p class="post-creator-name"></p>
      </div>
  </div>

  
`
    postNode.querySelector(".cat-mark").innerText = content.category;
    postNode.querySelector(".title").innerText = content.title;
    postNode.querySelector(".post-content").innerText = content.content.substring(0, 350) + "...";
    postNode.querySelector(".created_at").innerHTML = moment(content.created_at).format('lll');
    postNode.querySelector(".no_of_likes").innerText = content.no_of_likes;
    postNode.querySelector(".no_of_dislikes").innerText = content.no_of_dislikes;
    postNode.querySelector(".no_of_comments").innerText = parseInt(content.no_of_comment);
    postNode.querySelector(".no_of_bookmarked").innerText = content.no_of_bookmarked;
    postNode.querySelector(".creator-photo").style.backgroundImage = `url('/userIcon/${content.userIcon}')`;
    postNode.querySelector(".post-creator-name").innerText = content.username;
    if (content.liked != undefined && content.liked != 0) {
      postNode.querySelector('.icon .icons:nth-child(2)').firstElementChild
        .firstElementChild.setAttribute('d', 'M11.0089 0.555344C9.5208 -0.237934 7.22587 0.360625 6.40938 1.89228L4.64561 5.99998L4 5.99998H1C0.447715 5.99998 0 6.4477 0 6.99998V17C0 17.5523 0.447715 18 1 18L4.00001 18H6.00001H13.6306C16.0437 18 18 15.3137 18 12C18 8.87022 16.2549 6.30014 14.0279 6.02446C13.8971 6.00826 13.7645 5.99998 13.6306 5.99998H11.9993L12.225 4.76501C12.2571 4.5942 12.2962 4.41903 12.336 4.24097L12.3361 4.24052C12.3539 4.16087 12.3719 4.08065 12.3894 3.99998C12.6481 2.80619 12.8091 1.51496 11.0089 0.555344ZM2 16V7.99998H4V16H2Z')
      postNode.querySelector('.icon .icons:nth-child(2)').firstElementChild
        .firstElementChild.setAttribute('fill', '#E9E942')
    }
    if (content.disliked != undefined && content.disliked != 0) {
      postNode.querySelector('.icon .icons:nth-child(3)').firstElementChild
        .firstElementChild.setAttribute('d', 'M6.99109 17.4447C8.4792 18.2379 10.7741 17.6394 11.5906 16.1077L13.3544 12L14 12H17C17.5523 12 18 11.5523 18 11V1.00002C18 0.447733 17.5523 1.71603e-05 17 1.71603e-05L14 1.52529e-05H12H4.36944C1.95626 1.52529e-05 -5.72205e-06 2.68631 -5.72205e-06 6.00002C-5.72205e-06 9.12978 1.74511 11.6999 3.97206 11.9755C4.10294 11.9917 4.23549 12 4.36944 12H6.00071L5.77502 13.235C5.74293 13.4058 5.70377 13.581 5.66396 13.759L5.66386 13.7595C5.64606 13.8391 5.62812 13.9193 5.61063 14C5.35186 15.1938 5.19094 16.485 6.99109 17.4447ZM16 2.00002V10H14V2.00002H16Z')
      postNode.querySelector('.icon .icons:nth-child(3)').firstElementChild
        .firstElementChild.setAttribute('fill', '#EF1414')
    }
    postContainer.innerHTML += `<div class="bg-white post radius toPost" data-postid='${content.id}' data-category_id='${content.category_id}'> ${postNode.innerHTML} </div>`
  }
  const posts = document.querySelectorAll('.post-content')
  for (let post of posts) {
    post.addEventListener('click', gotoPost)
  }

}

function pagination(page, no_of_page, category) {
  const query = new URLSearchParams(location.search)
  let search = query.get('search')
  let pageNum = document.querySelector("#pageNum");
  pageNum.innerHTML = "";
  let startPage;

  if (no_of_page == 0) {
    no_of_page = 1
  }

  // 1. Left arrow a tag
  // 2. Right arrow a tag
  // 3. current page and neighbours page
  // 4. total page

  if (category == '' && search != null) {
    if (page < 4) {
      startPage = 1
    } else if (no_of_page - page < 10) {
      startPage = no_of_page - 9
    } else {
      startPage = page - 2
      pageNum.innerHTML += `<a href="/index.html?search=${search}&page=1">1...</a>`
    }

    if (no_of_page != 1) {
      let previousPage = page - 1;
      pageNum.innerHTML += `<a href="/index.html?search=${search}&page=${previousPage}"></a>`
    }
    for (let i = startPage; i <= startPage + 9; i++) {
      if (i == page) {
        pageNum.innerHTML += `<a style="background-color:white" href="/index.html?search=${search}&page=${i}">${i}</a>`
      } else {
        pageNum.innerHTML += `<a href="/index.html?search=${search}&page=${i}">${i}</a>`
      }

      if (i == no_of_page) {
        break
      }
    }

    if (page < no_of_page) {
      let nextPage = page + 1;
      pageNum.innerHTML += `<a href="/index.html?search=${search}&page=${nextPage}">>></a>`
    }

  } else {
    if (page < 4) {
      startPage = 1
    } else if (no_of_page - page < 10) {
      startPage = no_of_page - 9
    } else {
      startPage = page - 2
      pageNum.innerHTML += `<a href="/index.html?page=1&category=${category}">1...</a>`
    }

    if (no_of_page != 1) {
      let previousPage = page - 1;
      pageNum.innerHTML += `<a href="/index.html?page=${previousPage}&category=${category}"><<</a>`
    }
    for (let i = startPage; i <= startPage + 9; i++) {
      if (i == page) {
        pageNum.innerHTML += `<a style="background-color:white" href="/index.html?page=${i}&category=${category}">${i}</a>`
      } else {
        pageNum.innerHTML += `<a href="/index.html?page=${i}&category=${category}">${i}</a>`
      }

      if (i == no_of_page) {
        break
      }
    }

    if (page < no_of_page) {
      let nextPage = page + 1;
      pageNum.innerHTML += `<a href="/index.html?page=${nextPage}&category=${category}">>></a>`
    }

    if (no_of_page > startPage + 9) {
      pageNum.innerHTML += `<a href="/index.html?page=${no_of_page}&category=${category}">...${no_of_page}</a>`
    }


  }
}

// Image Upload Preview
function previewFile() {
  const previews = document.querySelectorAll('input + img');

  const files = document.querySelectorAll('#addimage > input[type=file]');
  for (let i = 0; i < files.length; i++) {
    let file = files[i]


    let validateFiles = Validate(files[i])

    if (validateFiles) {
      file = files[i].files[0]
      const reader = new FileReader();

      reader.addEventListener("load", function () {
        previews[i].src = reader.result;
      }, false);

      if (file) {
        reader.readAsDataURL(file);

      }
    }
  }
}

//Check files are images or not
let _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];

// no use
function Validate(oForm) {
  let oInput = oForm;
  if (oInput.type == "file") {
    let sFileName = oInput.value;
    if (sFileName.length > 0) {
      let blnValid = false;
      for (let j = 0; j < _validFileExtensions.length; j++) {
        let sCurExtension = _validFileExtensions[j];
        if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
          blnValid = true;
          break;
        }
      }

      if (!blnValid) {
        alert("Sorry! Please upload validate image files.");
        return false;
      }
    }
  }
  return true;
}

// Remove image
let addImage = document.querySelector('.addimageextra');
addImage.addEventListener('click', (event) => {
  if (event.target.matches('.fa-times-circle')) {
    event.target.parentNode.remove();
  }
})

clearEverything()

// Clear everything
function clearEverything() {
  let clear = document.querySelector('#popupform-head');
  let resetbtn = document.querySelector('#resetbtn');
  let addimageextra = document.querySelector(".addimageextra")
  resetbtn.addEventListener('click', () => {
    let clearDiv = document.createElement('div');
    while (addimageextra.firstChild) {
      addimageextra.removeChild(addimageextra.firstChild)
    }
    clearDiv.innerHTML = `
            <div class="image-upload" id="addimage">
                <input type="file" name="photo" accept=".jpg, .jpeg, .bmp, .gif, .png"
                    onchange="previewFile()"/>
                <img src="">
                <i class="fas fa-plus-circle fa-2x"></i>
                <!-- <i class="fas fa-times-circle"></i> -->
            </div>`;
    addimageextra.appendChild(clearDiv);

    clearEverything()
    popupEachtime()
  })
}


popupEachtime()

// new post pop up
function popupEachtime() {
  let popup = document.querySelector('#add-post-icon');
  let closeBtn = document.querySelector('#popup-close');

  popup.addEventListener('click', () => {
    document.querySelector("#popup-background").classList.remove("none")
  })

  closeBtn.addEventListener('click', () => {
    document.querySelector("#popup-background").classList.add("none")
  })
}



uploadImage()

// add image
function uploadImage() {
  let uploadExtra = document.querySelector('.upload-plus');
  uploadExtra.addEventListener('click', () => {
    const div = document.createElement('div');
    div.innerHTML = `<div class="image-upload" id="addimage">
    <input type="file" name="photo" accept=".jpg, .jpeg, .bmp, .gif, .png"
        onchange="previewFile()"/>
    <img src="">
    <i class="fas fa-plus-circle fa-2x"></i>
    <i class="fas fa-times-circle"></i>
  
  </div>`;
    addImage.appendChild(div);
  })
}

// add new post
document.querySelector('#popup-form').addEventListener('submit', async event => {
  event.preventDefault();
  const body = new FormData()

  let categories = document.querySelector('#category');
  let category = categories.options[categories.selectedIndex].text
  let categoryNumber;

  if (category == '政治') {
    categoryNumber = 1;
  } else if (category == '科技') {
    categoryNumber = 2;
  } else if (category == '生活') {
    categoryNumber = 3;
  } else if (category == '興趣') {
    categoryNumber = 4;
  }


  let photos = document.querySelectorAll('input[name=photo]')
  for (let photo of photos) {
    if (photo.files[0] != undefined) {
      body.append("title", document.querySelector('#add-title').value)
      body.append("content", document.querySelector('textarea').value)
      body.append('category', categoryNumber)
      body.append('photo', photo.files[0])
    } else {
      body.append("title", document.querySelector('#add-title').value)
      body.append("content", document.querySelector('textarea').value)
      body.append('category', categoryNumber)

    }
  }

  const uploadConfirm = confirm('確認提交？一旦提交將無法修改！')
  if (uploadConfirm) {
    const res = await fetch('/addPosts', {
      method: "POST",
      body: body
    })
    const json = await res.json()

    if (json.result == true) {
      window.location = `./index.html`
    }
  }
})

// Category
async function checkCategory() {
  let category1 = '';
  let category2 = '';
  let json;

  let categorybtn = document.querySelector('#categorybtn')
  categorybtn.addEventListener('click', async event => {
    event.preventDefault();


    let title = document.querySelector('#add-title')
    let textarea = document.querySelector('#popup-background textarea')
    let content = title.value + ' ' + textarea.value.replaceAll('\n', ' ');

    let categoryOption = document.querySelector('.category-option')

    if ((title.value != "") && (textarea.value != "")) {
      const categoryConfirm = confirm('確認內容？請選擇類別！')
      if (categoryConfirm) {
        document.querySelector("input#submitbtn").classList.add("visible")

        const res = await fetch('/getCategory', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify({

            content: content
          })
        })
        json = await res.json()

        category1 = json.result[0];
        category2 = json.result[1]

        switch (category1) {
          case 'newsCounter':
            category1 = '新聞';
            break;
          case 'techCounter':
            category1 = '科技';
            break;
          case 'lifeCounter':
            category1 = '生活';
            break;
          case 'interestCounter':
            category1 = '興趣';
            break;
        }

        if ((category2 != undefined) && (category2 != null)) {
          if (category1 != category2) {
            switch (category2) {
              case 'newsCounter':
                category2 = '新聞';
                break;
              case 'techCounter':
                category2 = '科技';
                break;
              case 'lifeCounter':
                category2 = '生活';
                break;
              case 'interestCounter':
                category2 = '興趣';
                break;
            }
          }
          const div = document.createElement('div');
          div.innerHTML = `<label for="category"></label>
            <select id="category" name="category" form="categoryform">
                <option value="${category1}">${category1}</option>
                <option value="${category2}">${category2}</option>
            </select>`
          while (categoryOption.firstChild) {
            categoryOption.removeChild(categoryOption.firstChild)
          }
          categoryOption.appendChild(div)
        } else if ((category2 == undefined) || (category2 == null)) {
          const div = document.createElement('div');
          div.innerHTML = `<label for="category"></label>
            <select id="category" name="category" form="categoryform">
                <option value="${category1}">${category1}</option>
            </select>`
          while (categoryOption.firstChild) {
            categoryOption.removeChild(categoryOption.firstChild)
          }
          categoryOption.appendChild(div)
        } else if ((category1 == undefined) || (category1 == null) && (category2 == undefined) || (category2 == null)) {
          alert('請輸入有邏輯內容！')
        }
      }
    }
  })
}
checkCategory()

// Socket
const socket = io.connect();
socket.on('post-update', () => {
  readPost();
})

//search bar
document.querySelector('#search').addEventListener('keydown', async (event) => {
  if (event.keyCode == 13 && search != '') {
    const searchtext = document.querySelector('#searchbar').value
    window.location = `/index.html?search=${searchtext}&page=1`
  }
})
document.querySelector('#search-icon').addEventListener('click', async (event) => {
  if (search != '') {
    const searchtext = document.querySelector('#searchbar').value
    window.location = `/index.html?search=${searchtext}&page=1`
  }
})

async function searchtext(searchtext, page) {
  const res = await fetch('/searchPost', {
    method: 'post',
    headers: {
      'Content-type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({
      search: searchtext,
      page: parseInt(page)
    })
  })
  const json = await res.json()
  displayPost(json.current_page_content)
  pagination(page, json.no_of_page, '')
}

async function gotoPost(event) {
  let post_id = event.currentTarget.parentNode.dataset.postid
  let category_id = event.currentTarget.parentNode.dataset.category_id
  window.location.href = `/post.html?post=${post_id}&category=${category_id}`
}