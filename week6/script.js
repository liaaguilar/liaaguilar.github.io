// let a = 20;
// let b = 10;
// // console.log(c);

// function add(val1, val2) {
//   let total = val1 + val2;
//   console.log(total);
//   return total;
// }

// c = add(a, b);
// console.log(c);
// a = 40;
// b = 40;
// c = add(a, b);
// // console.log(add);
// c = add(35, 89);

// function myGrade(marks) {
//   if (marks > 80) {
//     return "HD";
//   } else if (marks < 40) {
//     return "FAIL";
//   } else {
//     return "PASS";
//   }
// }

// let score = 50;
// let msg = myGrade(score);
// console.log(msg);

// DOM HANDLING //
const header = document.querySelector("header");
// console.log(header.innerHTML);
let course = "OAR1013";
header.innerHTML += `<h3> THIS IS ${course}! </h3>`;
const topHeader = document.querySelector("h1");
// console.log(header.innerHTML);

const topHeading = document.querySelector("h1");
// console.log(topHeading);
// console.log(topHeading.textContent);
topHeading.textContent = "This is a New Heading!";
topHeading.style.color = "crimson";

const allPara = document.querySelectorAll("p");
// console.log(allPara);
// console.log(allPara.textContent);
for (let i = 0; i < allPara.length; i++) {
  //   console.log(allPara[i].textContent);
  allPara[i].style.border = "1px solid green";
  allPara[i].style.backgroundColor = "beige";
}

const firstSub = document.querySelector("#firstSub");
// console.log(firstSub);
// console.log(firstSub.textContent);

// EVENT HANDLING //
const myButton = document.querySelector("#my-button");
console.log(myButton);

myButton.addEventListener("click", handleClick);

const myCat = document.querySelector("#my-cat");
console.log(myCat);

myCat.addEventListener("mouseenter", addMe);
myCat.addEventListener("mouseleave", removeMe);

function addMe() {
  myCat.classList.add("round");
}

function removeMe() {
  myCat.classList.remove("round");
}

function handleClick() {
  console.log("hey why did u click me");
  myCat.classList.toggle("round");
  // topHeading.classList.toggle("blue-color");
}
