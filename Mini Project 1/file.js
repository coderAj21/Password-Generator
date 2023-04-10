const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#upperCase");
const lowercaseCheck=document.querySelector("#lowerCase");
const numbersCheck=document.querySelector("#number");
const symbolsCheck=document.querySelector("#symbol");
const generateBtn=document.querySelector(".generateButton");
const indicator=document.querySelector("[data-indicator]");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols="!@#$%&?/";

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    let min=inputSlider.min;
    let max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%";
}
function setIndicator(color){
    indicator.style.background=color;
    //shadow khud krna
}
function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbols(){
    const i=getRndInteger(0,symbols.length);
    return symbols.charAt(i);
}
function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if (uppercaseCheck.checked){
        hasUpper=true;
    }
    if(lowercaseCheck.checked){
        hasLower=true;
    }if (numbersCheck.checked){
        hasNum=true;
    }if(symbolsCheck.checked){
        hasSym=true;
    }
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }else if ((hasLower|| hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ffo");
    }else{
        setIndicator("#f00");
    }
}
async function copyContext(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    copyMsg.classList.add("active"); 
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContext();
    }
});

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if (checkbox.checked){
            checkCount++;
        }
    });
    if (passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})
function shufflePassword(arr){
    for (let i=arr.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=arr[i];
        arr[i]=arr[j];
        arr[j]=temp;
    }
    let str="";
    arr.forEach((el)=>{
        str+=el;
    });
    return str;

}

generateBtn.addEventListener('click',()=>{
    if (checkCount==0) return;
    if (passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    password="";
    // if (uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if (lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if (numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if (symbolsCheck.checked){
    //     password+=generateSymbols();
    // }
    let funcArr=[];
    if (uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if (numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked){
        funcArr.push(generateSymbols);
    }
    console.log(funcArr);
    for (let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    for (let i=0;i<passwordLength-funcArr.length;i++){
        let r=getRndInteger(0,funcArr.length);
        password+=funcArr[r]();
    }
    password = shufflePassword(Array.from(password));
    passwordDisplay.value=password;
    calcStrength(password); 
});