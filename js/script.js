/*
Add a way to filter the directory by name or username. To do this, you’ll need to request a random user nationality that will only return data in the English alphabet. Note: you don't have to rely on the API to return search results.

You'll need to write functionality that filters results once they already on the page.

Add a way to move back and forth between employee detail windows when the modal window is open.
NOTE:

To get an "Exceeds Expectations" grade for this project, you'll need to complete each of the items in this section. See the rubric in the "How You'll Be Graded" tab above for details on how you'll be graded.
If you’re shooting for the "Exceeds Expectations" grade, it is recommended that you mention so in your submission notes.
Passing grades are final. If you try for the "Exceeds Expectations" grade, but miss an item and receive a “Meets Expectations” grade, you won’t get a second chance. Exceptions can be made for items that have been misgraded in review.
*/

'use strict';

let employeesModels = [];
let display;

const containerDiv = document.getElementById('container');
const modalWindow = document.getElementById('modal');
const fadeOut = document.getElementById('fade-out');
const filterInput = document.getElementById('filter');

filterInput.addEventListener('input', (event) => {
  console.log(event.target.value);
})

const capitalizeFirstLetter = word => {
  return word.substr(0, 1).toUpperCase() + word.substr(1);
};
const cardFill = (data, index) => {
  const {picture, name, email, city} = data;
  const card = document.createElement('div');
  card.classList.add('card');
  card.id = index;
  card.insertAdjacentHTML('afterbegin',
   `<img class="picture" src="${picture}" alt="photo of employee">
    <div class="infos">
      <div class="name">${name}</div>
      <div class="email">${email}</div>
      <div class="city">${city}</div>
    </div>`);
  card.addEventListener('click', event => {
    display = card.id;
    showModal(display);
  });
  return card;
};
const modalFill = data => {
  const {picture, name, email, cellnumber, address, city, birthdate} = data;
  modalWindow.innerHTML =
   `<a id="close-modal" href="#">X</a>
    <img class="picture modal" src="${picture}" alt="">
    <div class="name modal">${name}</div>
    <div class="email modal">${email}</div>
    <div class="city modal">${city}</div>
    <hr></hr>
    <div class="cellnumber modal">${cellnumber}</div>
    <div class="address modal">${address}</div>
    <div class="birthdate modal">${birthdate}</div>
    <div class="nav-modal">
      <a id="back-modal" href="#">&lt;&lt;</a>
      <a id="forth-modal" href="#">&gt;&gt;</a>
    </div>`;

  const closeModalAnchor = document.getElementById('close-modal');
  const backModalAnchor = document.getElementById('back-modal');
  const forthModalAnchor = document.getElementById('forth-modal');

  closeModalAnchor.addEventListener('click', () => {
    modalWindow.style.display = 'none';
    fadeOut.style.display = 'none';
  });
  backModalAnchor.addEventListener('click', () => {
    display = (display + 11) % 12;
    modalFill( employeesModels[display] );
  });
  forthModalAnchor.addEventListener('click', () => {
    display = (display + 13) % 12;
    modalFill( employeesModels[display] );
  });
}
const recondition = json => {
  return {
    picture: json.picture.large,
    name: capitalizeFirstLetter(json.name.first) + ' ' + capitalizeFirstLetter(json.name.last),
    username: json.login.username,
    email: json.email,
    cellnumber: json.cell,
    city: json.location.city,
    address: json.location.street + ' ' + json.location.postcode,
    country: json.location.state,
    birthdate: json.dob
  }
};

const showModal = number => {
  modalFill(employeesModels[number]);
  modalWindow.style.display = 'block';
  fadeOut.style.display = 'block';
  console.log('show maodal n° ' + number);
};

const init = number => {
  return new Promise( (resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://randomuser.me/api/?results=${number}&nat=us,dk,fr,gb,dk,es,fi`, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(xhr.statusText);
        }
      }
    }
    xhr.send();
  })
  .then( JSON.parse )
  .then( json => {
    employeesModels = json.results.map(recondition);
    return employeesModels;
  })
  .then( employeesArray => employeesArray.map(cardFill) )
  .then( elementArray => elementArray.forEach( (el) => {
    containerDiv.insertAdjacentElement('beforeend', el);
  }))
};

init(12);
