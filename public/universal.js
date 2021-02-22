
//change background color
let query = new URLSearchParams(location.search);
let category = parseInt(query.get("category"))
let body = document.querySelector("body")
if (category == 1) {
  body.classList.add("grey")
  document.querySelector(".cat-1").classList.add("inset")
} else if (category == 2) {
  body.classList.add("blue")
  document.querySelector(".cat-2").classList.add("inset")
} else if (category == 3) {
  body.classList.add("red")
  document.querySelector(".cat-3").classList.add("inset")
} else if (category == 4) {
  body.classList.add("orange")
  document.querySelector(".cat-4").classList.add("inset")
} else {
  body.classList.add("green")
  document.querySelector(".cat-0").classList.add("inset")
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


document.querySelector("#profile").addEventListener("click", (event) => {
  document.querySelector("#drop-menu").classList.toggle("none")
})

document.querySelector("#nav-login").addEventListener("click", (event) => {
  document.querySelector("#hide-shadow").classList.remove("none")

})
document.querySelector("#login-form-close").addEventListener("click", (event) => {
  document.querySelector("#hide-shadow").classList.add("none")

})

const loginForm = document.querySelector('#login-page')
const registerForm = document.querySelector('#register')

async function register(email, password, username) {
  const res = await fetch('register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify({

      email: registerForm.querySelector("input[name=email]").value,
      password: registerForm.querySelector("input[name=password]").value,
      username: registerForm.querySelector('input[name=username').value

    })
  })
  const json = await res.json();

  if (json.result) {
    loggedIn = true

    getUserInfo()
  }



}

//user-setting form 
const userSettingForm = document.querySelector('#setting-container');

var loggedIn = false;
let rememberMe = false;

function initPage() {
  if (localStorage.getItem("username") != "null"
    && localStorage.getItem("username") != null
    && localStorage.getItem("password") != "null"
    && localStorage.getItem("password") != null) {
    rememberMe = true;
    login(localStorage.getItem("username"), localStorage.getItem("password"))
  }
}

document.onload = initPage()

async function login(username, password) {
  const res = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify({

      email: loginForm.querySelector("input[name=loginID]").value,
      password: loginForm.querySelector("input[name=loginPassword]").value
    })
  })
  const json = await res.json();

  if (json.result) {
    loggedIn = true;
    getUserInfo()

    if (document.getElementById('check').checked) {
      rememberMe = true;
    }
    if (rememberMe) {
      localStorage.setItem("username", loginForm.querySelector("input[name=loginID]").value);
      localStorage.setItem("password", json.token);
    } else {
      localStorage.removeItem("username")
      localStorage.removeItem("password");
    }

  }
}

async function checkLogin() {
  let res = await fetch("/checkLogin")
  let result = await res.json()
  return result.result
}

//Once login fetch to see userinfo by "where" session.id
async function getUserInfo() {
  if (await checkLogin()) {
    const res = await fetch('/getUserInfo')
    const info = await res.json()
    if (info.admin) {
      document.querySelector("#drop-menu").innerHTML += `<a href='/admin.html'>管理用戶</a>`
    }
    showOnlyLoggedIn()
    updateUserSetting(info.id, info.username, info.email, info.userIcon)
  } else {
    console.log("not logged in")
  }
}
getUserInfo()
//the upper-right corner changing after login
function showOnlyLoggedIn() {
  document.querySelector("#nav-login").classList.add("none")
  document.querySelector("#profile").classList.remove("none")
  document.querySelector('#add-post-icon').classList.remove('add-post-icon')

}


function updateUserSetting(id, username, email, userIcon) {

  document.querySelector("#photo").style.backgroundImage = `url('./userIcon/${userIcon}')`  //icon on nav
  //display userInfo on user-setting form
  userSettingForm.querySelector("#actualName").innerText = username;
  userSettingForm.querySelector("#actualEmail").innerText = email;
  userSettingForm.querySelector("#current-photo").style.backgroundImage = `url('./userIcon/${userIcon}')`;
}

//submit login

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  login(loginForm.querySelector("input[name=loginID]").value,
    loginForm.querySelector("input[name=loginPassword]").value)
  document.querySelector("#hide-shadow").classList.add("none")
})

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  register(registerForm.querySelector("input[name=email]").value,
    registerForm.querySelector("input[name=password]").value,
    registerForm.querySelector('input[name=username').value)
  document.querySelector("#hide-shadow").classList.add("none")
})
//open user-setting form
//setting button on drop down menu
document.querySelector("#setting").addEventListener("click", (event) => {
  document.querySelector("#user-setting-background").classList.remove("none")
})


//prevent user from clicking other button
const formShadow = userSettingForm.querySelector('#form-shadow');

//edit button
const changeUsernameBtn = userSettingForm.querySelector('#change-username-button');
const changeEmailBtn = userSettingForm.querySelector('#change-email-button');
const changePwBtn = userSettingForm.querySelector('#change-password-button');
const changePhotoBtn = userSettingForm.querySelector('#change-photo-button');

//form relative to the edit button
const changeUsernameForm = userSettingForm.querySelector('#change-username');
const changeEmailForm = userSettingForm.querySelector('#change-email');
const changePwForm = userSettingForm.querySelector('#change-password');
const changePhotoForm = userSettingForm.querySelector('#change-photo');
//close button on the form
document.querySelector("#user-setting-close").addEventListener("click", (event) => {
  document.querySelector("#user-setting-background").classList.add("none")
  formShadow.classList.add('none')
  changeUsernameForm.classList.add('none')
  changeEmailForm.classList.add('none')
  changePwForm.classList.add('none')
  changePhotoForm.classList.add('none')
  document.getElementById('img-wrap').innerHTML = ""

})


//pop up form inside user-setting form
changeUsernameBtn.addEventListener("click", (event) => {
  formShadow.classList.remove('none')
  changeUsernameForm.classList.remove('none')
})
changeEmailBtn.addEventListener("click", (event) => {
  formShadow.classList.remove('none')
  changeEmailForm.classList.remove('none')
})
changePwBtn.addEventListener("click", (event) => {
  formShadow.classList.remove('none')
  changePwForm.classList.remove('none')
})

//exit the edit-form inside setting-form
let allCancelBtn = userSettingForm.querySelectorAll('.cancel')

for (each of allCancelBtn) {
  each.addEventListener("click", (event) => {
    event.stopPropagation()
    event.target.parentElement.parentElement.classList.add('none')
    formShadow.classList.add('none')
  })
}


async function clearCanva() {
  document.getElementById('img-wrap').innerHTML = ""
  formShadow.classList.add('none')
  changePhotoForm.classList.add('none')
}


userSettingForm.querySelector('#photoCancel').addEventListener("click", async (event) => {
  clearCanva()
})
//sendNewusername

userSettingForm.querySelector("#change-username").addEventListener("submit", async (event) => {

  event.stopPropagation();
  event.preventDefault();

  let res = await fetch('/changeUsername',
    {
      method: "POST",
      headers: {

        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ newUsername: event.target["newUsername"].value }),
    }
  );
  let result = await res.json()
  formShadow.classList.add('none')
  changeUsernameForm.classList.add('none')
  getUserInfo(loggedIn)
})


//sendNewemail
userSettingForm.querySelector("#change-email").addEventListener("submit", async (event) => {

  event.preventDefault();

  let res = await fetch('/changeEmail',
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ newEmail: event.target["newEmail"].value }),
    }
  );
  let result = await res.json()

  formShadow.classList.add('none')
  changeEmailForm.classList.add('none')
  getUserInfo(loggedIn)
})

//sendNewPassword
userSettingForm.querySelector("#change-password").addEventListener("submit", async (event) => {

  event.stopPropagation();
  event.preventDefault();

  let res = await fetch('/changePassword',
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        oldPassword: event.target["oldPassword"].value,
        newPassword: event.target["newPassword"].value
      }),
    }
  );
  let result = await res.json()
  if (result == "wrongOldPW") {
    alert("wrong password")
  } else {
    formShadow.classList.add('none')
    changePwForm.classList.add('none')
    getUserInfo(loggedIn)
  }
})


function upload(event) {
  event.stopPropagation()

  formShadow.classList.remove('none')
  changePhotoForm.classList.remove('none')
  loadingImg(event)
  document.querySelector('#upload').value = ""
}

//upload cropPhoto
document.querySelector('#upload').addEventListener("change",
  upload.bind(this)
)

function loadingImg(event) {
  //讀取上傳文件
  let reader = new FileReader();
  if (event.target.files[0]) {
    //readAsDataURL方法可以將File對象轉化為data:URL格式的字符串（base64編碼）
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e) => {
      let dataURL = reader.result;
      const image = new Image();
      //將img的src改為剛上傳的文件的轉換格式
      image.src = dataURL;
      image.setAttribute('style', 'max-width:100%;');
      image.setAttribute('style', 'max-height:100%;');

      document.getElementById('img-wrap').appendChild(image)
      //創建cropper
      CROPPER = new Cropper(image, {
        aspectRatio: 16 / 16,
        viewMode: 0,
        minContainerWidth: 20,
        minContainerHeight: 20,
        dragMode: 'move',
      })
    }
  }
}
//CHANGE PHOTO
document.querySelector("#change-photo").addEventListener("submit", async (event) => {
  event.stopPropagation()
  event.preventDefault()
  await GetData(CROPPER)

  await getUserInfo(loggedIn)
  await clearCanva()
})




async function GetData(CROPPER) {
  //getCroppedCanvas方法可以將裁剪區域的數據轉換成canvas數據

  const toBlobPromise = new Promise((resolve, reject) => {
    CROPPER.getCroppedCanvas({
      maxWidth: 4096,
      maxHeight: 4096,
      fillColor: '#fff',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    }).toBlob(blob => {
      resolve(blob)
    });
  })

  let blob = await toBlobPromise


  const formData = new FormData();
  formData.append('photo', blob);

  const res = await fetch('/changePhoto', {
    method: "POST",
    body: formData
  });

  const result = await res.json()

}


async function base64ToBlob(){
  const img = "13213123213safdasdf"; //base64

  const res = await fetch(img); // fetch to convert to blob then file
  const blob = await res.blob();
  const file = new File([blob],"image.png");
  const formData = new FormData();
  formData.append("photo",file);

  const resAPI = await fetch('/changePhoto', {
    method: "POST",
    body: formData
  });
  await resAPI.json()
}


//  Logout

document.getElementById('logout-button').addEventListener('click', clearLoginInfo)

function clearLoginInfo() {
  localStorage.clear()
  window.location.href = '/logout'
}


window.onscroll = function () { progressBar() };

function progressBar() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
}