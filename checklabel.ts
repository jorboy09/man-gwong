let labels = ['__label__時事', '__label__硬件', '__label__健康', '__label__財經', '__label__財經', '__label__房屋', '__label__App', '__label__寵物'];
let labels2 = ['__label__World', '__label__財經', '__label__娛樂', '__label__房屋', '__label__財經', '__label__手機', '__label__App', '__label__軟件'];


let array = 'X19sYWJlbF9f6YGK5oiy,X19sYWJlbF9f546p5YW3,X19sYWJlbF9f6Luf5Lu2,'

const labelMaps = {
    '__label__時事':"news",
    '__label__world':"news",
    '__label__政事':"news",
    '__label__財經':"news",
    '__label__娛樂':"news",
    '__label__房屋':"news",
    '__label__手機':"tech",
    '__label__硬件':"tech",
    '__label__apps':"tech",
    '__label__軟件':"tech",
    '__label__電訊':"tech",
}


let check = function checkLabel(labelArray) {

    const counters = {
        news:0,
        tech:0,
        life:0,
        interest:0
    }

    let newsCounter = 0;
    let techCounter = 0;
    let lifeCounter = 0;
    let interestCounter = 0;
    
    for (let label of labelArray) {

        const category = labelMaps[label];
        counters[category]+= 1;
        switch (label) {
            // 新聞 x6
            case '__label__時事':
            case '__label__world':
            case '__label__政事':
            case '__label__財經':
            case '__label__娛樂':
            case '__label__房屋':
                newsCounter += 1;
                break;
            // 科技 x5
            case '__label__手機':
            case '__label__硬件':
            case '__label__apps':
            case '__label__軟件':
            case '__label__電訊':
                techCounter += 1;
            // 生活 x8
            case '__label__創意':
            case '__label__健康':
            case '__label__飲食':
            case '__label__感情':
            case '__label__旅遊':
            case '__label__上班':
            case '__label__活動':
            case '__label__校園':
                lifeCounter += 1;
            // 興趣 x13
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
                interestCounter += 1;
        }
    }

    return {
        'newsCounter': newsCounter,
        'techCounter': techCounter,
        'lifeCounter': lifeCounter,
        'interestCounter': interestCounter
    }
}

// let x = { newsCounter: 4, techCounter: 2, lifeCounter: 3, interestCounter: 4 }

// a // let finding2Max = Object.entries(labelObj).sort(([,a],[,b]) => b-a)
function finding2Max(objectLabel) {
    let first;
    let second;
    let firstMax = 0;
    let secondMax = 0;
    for (let label in objectLabel) {
        if (objectLabel[label] > firstMax) {
            firstMax = objectLabel[label]
            first = label;
        }
    }
    for (let label in objectLabel) {
        if ((objectLabel[label] > secondMax) && (label != first)) {
            secondMax = objectLabel[label]
            second = label;
        }
    }
    return [first, second];
}


function checkLabelFinal(array) {
    let labelDuplicate = array.substring(0, array.length - 1).split(',')
    let resultLabels: string[] = []
    for (let label of labelDuplicate) {
        let newlabel = Buffer.from(label, 'base64').toString()
        resultLabels.push(newlabel)
    }
    let checkLabel = check(resultLabels);
    // let checkLabel = check(label)
    return (finding2Max(checkLabel))
}

// console.log(checkLabelFinal())

export default { array, check, finding2Max, checkLabelFinal }
