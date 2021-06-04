//====================================================================
//
//  Functions
//
//====================================================================


function countBi() {
    for (let i = 0; i < matrixWidth; i++) {
        for (let j = 0; j <= i; j++) {
            phBi[i] = [0];
            if (+matrixAsArray[i][j] != 0) {
                phBi[i] = [i - j];
                break
            }
        }
    }
}


function countBavg() {
    let sum = 0;
    for (let i of phBi) {
        sum += +i;
    }
    return (sum / n).toFixed(3);
}


function swRows(firstIndex, secondIndex, mtrx = matrixAsArray) {
    [mtrx[firstIndex], mtrx[secondIndex]] = [mtrx[secondIndex], mtrx[firstIndex]];
}


function swColumns(firstIndex, secondIndex) {
    for (let i = 0; i < matrixWidth; i++) {
        [matrixAsArray[i][firstIndex], matrixAsArray[i][secondIndex]] = [matrixAsArray[i][secondIndex], matrixAsArray[i][firstIndex]];
    }
}


function createMatrix(width = matrixWidth, height = matrixHeight, st = "cell") {
    let mtrx = [];
    for (let i = 0; i < height; i++) {
        mtrx[i] = [];
        for (let j = 0; j < width; j++) {
            let div = document.createElement("div");
            let cont = document.createTextNode(0);
            div.appendChild(cont);
            div.className = st;
            mtrx[i][j] = div;
        }
    }
    return mtrx;
}


function renderMatrix(mtrx, place) {
    let d = document.getElementsByClassName(place)[0];
    for (let i = 0; i < mtrx.length; i++) {
        let row = mtrx[i];
        for (let j = 0; j < row.length; j++) {
            d.appendChild(row[j]);
        }
        d.appendChild(document.createElement('br'));
    }
}


function syncMatrix(baseMatrix, uptMatrix, cc = "no") {
    if (baseMatrix.length != uptMatrix.length) {
        console.log('Размерности матриц не совпадают');
    }
    for (i = 0; i < baseMatrix.length; i++) {
        for (j = 0; j < baseMatrix[0].length; j++) {
            uptMatrix[i][j].textContent = baseMatrix[i][j];
            if (cc == "yes") {
                checkColor(uptMatrix[i][j]);
            }
        }
    }
}


function checkColor(element) {
    if (element.textContent == 1) {
        element.style = "background-color: #00CB90";
    } else {
        element.style = "background-color: white";
    }
}


function countMiddleElements(rowNum) {
    let sum = 1;
    let startFrom = rowNum - Math.floor(vBavg);
    if (startFrom < 0) startFrom = 0;

    for (let i = startFrom; i < rowNum; i++) {
        if (matrixAsArray[rowNum][i] == 1) sum += 1;
    }
    return sum;
}


function rangeFromCenter(rowNum) {
    let centr = Math.ceil(matrixWidth);
    return Math.abs(centr - rowNum);
}


function checkSwipe() {
    if (vBavg > phBavg) {
        return true;
    } else if (vBavg != phBavg) {
        return false
    } else {
        return needSwBasedOnDelta();
    }

}


function needSwBasedOnDelta() {
    if (countMiddleElements(x1) == countMiddleElements(x2)) {
        return false;
    } else {
        let innerRow = x1;
        let outerRow = x2;
        if (rangeFromCenter(x1) > rangeFromCenter(x2)) {
            innerRow = x2;
            outerRow = x1;
        }
        return countMiddleElements(outerRow) < countMiddleElements(innerRow) ? false : true;
    }
}


function prepareMatrix(mtrx) {

    matrixWidth = 0;
    let tmpWidth = 0;
    let tmpHeight = 1;

    for (let i of mtrx) {
        if (i == "\n") {
            if (tmpWidth == 0) {
                alert("Файл содержит пустую строку")
                wrongMatrix == true;
                break;
            }

            if (matrixWidth == 0) matrixWidth = tmpWidth;

            if (matrixWidth == tmpWidth) {
                tmpHeight++;
                tmpWidth = 0;
                continue;
            } else {
                alert("Файл содержит строки разной длины")
                wrongMatrix = true;
                break;
            }

        }
        if (checkSymbol(i) == -1) {
            alert("Файл содержит недопустимые символы")
            wrongMatrix = true;
            break;
        }
        tmpWidth++;
    }

    if ((tmpHeight != tmpWidth) && (wrongMatrix = false)) {
        alert("Это не квадратная матрица");
        console.log('width:', tmpWidth, 'height', tmpHeight);
        wrongMatrix = true;
    }

    if (wrongMatrix == true) return;

    matrixHeight = tmpHeight;
    matrixAsArray.length = matrixHeight;

    let elemNum = 0;
    for (let i = 0; i < matrixHeight; i++) {
        matrixAsArray[i] = [];
        matrixAsArray[i].length = matrixWidth;
        elemNum == 0 ? 0 : elemNum++;
        for (let j = 0; j < matrixWidth; j++) {
            matrixAsArray[i][j] = mtrx[elemNum];
            elemNum++;
        }
    }
}


function checkSymbol(elem) {
    return ((elem != "1") && (elem != "0") && (elem != "\n")) ? -1 : elem;
}


function displayMatrix(mtrx) {
    //создать элементы матриц
    vMatrix = createMatrix();
    vBi = createMatrix(1, matrixHeight, "column");
    vNI = createMatrix(1, matrixHeight, "column");

    //отобразить матрицы на экране
    renderMatrix(vMatrix, "field");
    renderMatrix(vBi, "Bi");
    renderMatrix(vNI, "NI");
    document.getElementsByClassName("Bavg")[0].append(0);
    for (let i = 0; i < document.getElementsByClassName("heading").length; i++) {
        document.getElementsByClassName("heading")[i].style = "visibility: visible";
    }

    //подтянуть данные в теговую матрицу из фантомной
    syncMatrix(mtrx, vMatrix, "yes");
    countBi();
    syncMatrix(phBi, vBi);
    for (let i = 0; i < matrixHeight; i++) {
        phNI[i] = [i + 1];
    }
    syncMatrix(phNI, vNI);
    phBavg = countBavg();
    vBavg = phBavg;
    document.getElementsByClassName("Bavg")[0].textContent = vBavg;
}


//====================================================================
//
//  Events by click on buttons
//
//====================================================================


document.getElementById("method1").onclick = function() {
    console.log("кнопка \"1 способ\" нажата");
    for (let i = 0; i < alg.length; i++) {
        let x1 = alg[i][0];
        let x2 = alg[i][1];
        swRows(x1, x2);
        swColumns(x1, x2);
        countBi();
        swRows(x1, x2, phNI);
        phBavg = countBavg();
        if (!checkSwipe()) {
            console.log(`перестановка ${x1} и ${x2} НЕцелесообразна`)
            swRows(x1, x2);
            swColumns(x1, x2);
            countBi();
            swRows(x1, x2, phNI);
            phBavg = countBavg();
        } else console.log(`перестановка ${x1} и ${x2} целесообразна`)
        syncMatrix(matrixAsArray, vMatrix, "yes");
        syncMatrix(phBi, vBi);
        syncMatrix(phNI, vNI);
        vBavg = phBavg;
        document.getElementsByClassName("Bavg")[0].textContent = vBavg;
        console.log('смена столбцов закончена')
    }
}


document.getElementById("method2").onclick = function() {
    console.log("кнопка \"2 способ\" нажата");

    let saveB;
    let countCycles = 0;
    while (countCycles <= 3) {
        saveB = phBavg;
        console.log(saveB);
        for (let i = 0; i < alg.length; i++) {
            let x1 = alg[i][0];
            let x2 = alg[i][1];
            swRows(x1, x2);
            swColumns(x1, x2);
            countBi();
            swRows(x1, x2, phNI);
            phBavg = countBavg();
            if (!checkSwipe()) {
                console.log(`перестановка ${x1} и ${x2} НЕцелесообразна`)
                swRows(x1, x2);
                swColumns(x1, x2);
                countBi();
                swRows(x1, x2, phNI);
                phBavg = countBavg();
            } else console.log(`перестановка ${x1} и ${x2} целесообразна`)
            syncMatrix(matrixAsArray, vMatrix, "yes");
            syncMatrix(phBi, vBi);
            syncMatrix(phNI, vNI);
            vBavg = phBavg;
            document.getElementsByClassName("Bavg")[0].textContent = vBavg;
            console.log('смена столбцов закончена')
        }

        if (saveB <= phBavg) {
            countCycles++;
        }
    }
}


//====================================================================
//
//  Centaral part
//
//====================================================================

let wrongMatrix = false;

let matrixAsArray = [];

let matrixWidth = 0;
let matrixHeight = 0;

let n = 40;
let m = 40;

let phNI = [];
for (let i = 0; i < matrixHeight; i++) {
    phNI[i] = [];
    phNI[i][0] = i + 1;
}

let x1 = 1;
let x2 = 2;

let indexes = [];
for (let i = 0; i < n; i++) {
    indexes[i] = i + 1;
}


let phBi = [];
countBi();

let phBavg = countBavg();

let vMatrix = [];
let vBi = [];
let vNI = [];
let vBavg = phBavg;

let roundIter = n - 1;
let stopIter = Math.ceil((3 + n / 100) * roundIter);

let step = 0;


//====================================================================
//
//  TO DO:
//
//  Добавить проверку меньше ли 1 в ленте содержит строка, стоящая дальше от центра ДО ПЕРЕСТАНОВКИ
//
//====================================================================


//тут сделал кнопку для запуска полного цикла - нужен функционал

function processFiles(files) {
    let file = files[0];
    reader.readAsText(file);
}

let matrixfromfile;

let alg = [];
let reader = new FileReader();

let stopOn;

reader.onload = function(e) {
    matrixfromfile = e.target.result;
    console.log(matrixfromfile);

    prepareMatrix(matrixfromfile);
    if (wrongMatrix == true) {
        alert("Исправьте файл с матрицей или выберите новый");
    } else {
        displayMatrix(matrixAsArray);
    }


    for (let i = 0; i < matrixWidth - 1; i++) {
        if (i % 2 == 0) {
            alg[i] = [Math.floor(i / 2), Math.floor(i / 2) + 1];
        } else {
            alg[i] = [matrixWidth - Math.floor(i / 2) - 1, matrixWidth - Math.floor(i / 2) - 2];
        }
    }

    stopOn = Math.round(3 + matrixWidth / 100);
};

text = 'qweq'

document.getElementById("dwn").onclick = function() {
    fs.writeFile("hello.txt", "Привет МИГ-29!")
}