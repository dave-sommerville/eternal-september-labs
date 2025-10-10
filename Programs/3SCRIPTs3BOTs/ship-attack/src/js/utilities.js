'use strict';

/*------------------------------------------------------------------------->
  Utility Functions 
<-------------------------------------------------------------------------*/

export function select(selector, scope = document) {
  return scope.querySelector(selector);
}

export function selectAll(selector, scope = document) {
  return scope.querySelectorAll(selector);
}

export function listen(event, element, callback) {
  return element.addEventListener(event, callback);
}

function isImageFile(file) {
  return file && file.type.startsWith('image');
}

function generateUniqueId() {
  return '#:' + Date.now();
}

export function addClass(element, customClass) {
  element.classList.add(customClass);
  return element;
}

export function removeClass(element, customClass) {
  if (element.classList.contains(customClass)) {
  element.classList.remove(customClass);
  return element;
  }
}

export function sleep(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}

function assignId(element) {
  element.id = generateUniqueId();
  return element;
}

function createImage(imageSrc) {
  const img = document.createElement('img');
  img.src = imageSrc;  
  img.alt = imageSrc; // Because the photo could be anything 
  return img;
}

export function create(element) {
  const newElement = document.createElement(element); 
  return newElement;
}

function addText(element, text) {
  element.textContent = text; 
}

//Gives Random Boolean
let yesOrNo = Math.random() >= 0.5;

//Random Hex color (needs fixing)
let randColor = Math.floor(Math.random() * 0xffffff).toString(16);
function getRandomNum(min, max) {
  return Math.random() * (max - min) + min;
}
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDate() {
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  };

  return new Date().toLocaleDateString('en-ca', options);
}
