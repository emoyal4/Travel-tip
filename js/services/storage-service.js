'use strict';

export const storageService = {
  saveToStorage,
  loadFromStorage,
  clearStorage
};

function saveToStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function loadFromStorage(key) {
  var val = localStorage.getItem(key);
  return JSON.parse(val);
}

function clearStorage() {
  localStorage.clear();
}