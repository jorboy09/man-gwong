const puppeteer = require('puppeteer');
const fs = require('fs');
const os = require('os')

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Web Scraping
async function eachPage(page, href) {
    await page.goto(href, { waitUntil: "networkidle2", timeout: 0 })
    let data = await page.evaluate(async () => {
        let postcontent = ''
        const contents = document.querySelectorAll('div > div[data-ast-root="true"]')
        for (let content of contents) {
            for (let node of content.childNodes) {
                if (node.nodeType == 3) {
                    postcontent += node.nodeValue.replaceAll('\n', ' ')
                    postcontent = postcontent.toLowerCase()
                }
            }
        }
        return postcontent
    });
    return data
}

async function gotoPost(page, post) {
    await page.goto(post.post, { waitUntil: "networkidle2", timeout: 0 });
    const title = await page.evaluate(async () => {
        let title = document.querySelector('#app>nav>div:nth-child(2)>div>span')
        if (title == null) {
            return ''
        }
        return title.innerText
    })
    const postPages = await page.evaluate(async () => {
        const postPages = document.querySelectorAll('#rightPanel>div:nth-child(2)>div>div>div:nth-child(2)>div>select>option')
        let link = []
        let i =0
        for (let postPage of postPages) {
            if(i>=3){
                break;
            }
            link.push(postPage.value)
            i++
        }
        return link
    })
    let content = ''
    for (let postPage of postPages) {
        await delay(3000 + Math.floor(Math.random() * 6000))
        content += await eachPage(page, post.post.slice(0, -1) + postPage)
    }

    if (title != '' && content != '') {
        console.log({ title: title, category: post.category })
        fs.promises.writeFile('newdata.txt', '__label__' + post.category + ' ' + title + ' ' + content + os.EOL, { flag: 'a', encoding: 'utf-8' })
    }
    return
}
async function gotoChannel(page, channel) {
    await page.goto(channel, { waitUntil: "networkidle2", timeout: 0 })
    const posts = await page.evaluate(async () => {
        async function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        switch (document.location.href.substring(document.location.href.length - 2, document.location.href.length)){
            case '38':
            case '33':
            case '22':
            case '/9':
            case '26':
            case '35':
            case '36':
            case '27':
            case '23':
            case '20':
            case '25':
            case '13':
            case '24':
            case '34':
                {
                    if (document.querySelector('#leftPanel>div:nth-child(1)') == null) {
                        return []
                    }
                    let i = 0
                    let time = setInterval(() => {
                        document.querySelector('#leftPanel>div:nth-child(1)').scrollIntoView(false)
                        i++
                        if (i == 15) {
                            clearInterval(time)
                        }
                    }, 1000)
                    await delay(18000)
                    const posts = document.querySelectorAll('#leftPanel>div:nth-child(1)>div>div>div:nth-child(2)>a:nth-child(2)')
                    let link = []
                    for (let post of posts) {
                        let category = ''
                        if (document.location.href.substring(document.location.href.length - 2, document.location.href.length) == '38'){
                            category = 'World'
                        }else if (document.location.href.substring(document.location.href.length - 2, document.location.href.length) == '/9'){
                            category = 'Apps'
                        }else{
                            category = document.querySelector('#app>nav>div>div:nth-child(2)>div:nth-child(2)>span').innerText.substring(0, 2)
                        }
                        link.push({ category: category, post: post.href })
                    }
                    return link
                }
        }
        if (document.querySelector('#leftPanel>div:nth-child(2)') == null) {
            return []
        }
        let i = 0
        let time = setInterval(() => {
            document.querySelector('#leftPanel>div:nth-child(2)').scrollIntoView(false)
            i++
            if (i == 15) {
                clearInterval(time)
            }
        }, 1000)
        await delay(18000)
        const posts = document.querySelectorAll('#leftPanel>div:nth-child(2)>div>div>div:nth-child(2)>a:nth-child(2)')
        let link = []
        for (let post of posts) {
            let category = ''
            category = document.querySelector('#app>nav>div>div:nth-child(2)>div:nth-child(2)>span').innerText.substring(0, 2)
            link.push({ category: category, post: post.href })
        }
        return link

    })
    console.log(posts)
    if (posts.length > 0) {
        for (let post of posts) {
            await gotoPost(page, post)
        }
    }
    return
}

async function goToLihkg() {
    let browser = await puppeteer.launch({ headless: true , timeout: 0});
    let page = await browser.newPage();
    await page.goto('https://lihkg.com/', { waitUntil: "networkidle2" })
    let channels = await page.evaluate(async () => {  
        const channels = document.querySelectorAll('#app>div :nth-child(2)>div:nth-child(2)>div:nth-child(2) a')
        let link = []
        for (let channel of channels) {
            switch (channel.href.substring(channel.href.length - 2, channel.href.length)) {
                case "/5":
                case "38":
                case "33":
                case "15":
                case "/7":
                case "37":
                case '/4':
                case '22':
                case '/9':
                case '26':
                case '35':
                case '31':
                case '36':
                case '16':
                case '30':
                case '17':
                case '14':
                case '27':
                case '19':
                case '/6':
                case '18':
                case '12':
                case '10':
                case '11':
                case '/8':
                case '23':
                case '21':
                case '20':
                case '25':
                case '13':
                case '24':
                case '34':
                    if (link.includes(channel.href)) {
                        continue;
                    } else {
                        link.push(channel.href)
                        break;
                    }
            }
        }
        return link
    })
    for (let channel of channels) {
        await gotoChannel(page, channel)
    }
    await browser.close();
    console.log('done')
    return
}
goToLihkg()