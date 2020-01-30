"use strict";


export const updateSync = (action, additional = {}) => {
  const additionalString = Object.keys(additional).map((key) => {
    return `&${key}=${escape(additional[key])}`; 
  }).join('');
  window.location.href = `/update?action=${action}${additionalString}`;
};