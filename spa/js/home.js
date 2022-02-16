/* home.js */

import { customiseNavbar } from "../util.js";

export async function setup(node) {
  console.log("HOME: setup");
  try {
    
    const token = localStorage.getItem("authorization");      

    console.log('LOGGGGGGGGGING', token);

    if (token){
      customiseNavbar(["home", "logout"]);

      const section = document.createElement('section')
      const csvButton = document.createElement('a')
      csvButton.innerText = 'Upload CSV'
      csvButton.href = `/uploadCsv`
      csvButton.style.background = '#d0bce4';
      console.log(csvButton)
      section.appendChild(csvButton)
      node.appendChild(section)

    }else{
      customiseNavbar(["home", "login", "register"]); // navbar if logged in
    }  

  } catch (err) {
    console.error(err);
  }
}




