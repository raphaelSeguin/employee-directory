// 'be serious'
'use strict';

// global variables
let employeesModels = [];
const bigIndex = ( () => {
  let value = 0;
  return {
    increment: function(val) {
      value = (value + val + 12) % 12;
      return value;
    },
    getValue: function() {
      return value;
    },
    setValue: function(val) {
      value = val;
    }
  }
})();

// elements
const containerDiv = document.getElementById('container');
const modalWindow = document.getElementById('modal');
const fadeOut = document.getElementById('fade-out');
const filterInput = document.getElementById('filter');

// utility function
const capitalizeFirstLetter = word => {
  return word.substr(0, 1).toUpperCase() + word.substr(1);
};

// build the elements and attach event handlers
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
    if( !card.classList.contains('filtered-out') ) {
      showModal(card.id);
    }
  });
  return card;
};
const modalFill = number => {
  const {picture, name, email, cellnumber, address, city, birthdate} = employeesModels[number];
  modalWindow.className = number;
  bigIndex.setValue(number);
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
  // elements on the modal
  const closeModalAnchor = document.getElementById('close-modal');
  const backModalAnchor = document.getElementById('back-modal');
  const forthModalAnchor = document.getElementById('forth-modal');

  closeModalAnchor.addEventListener('click', () => {
    modalWindow.style.display = 'none';
    fadeOut.style.display = 'none';
  });
  backModalAnchor.addEventListener('click', () => {
    modalFill( bigIndex.increment( -1 ) );
  });
  forthModalAnchor.addEventListener('click', () => {
    modalFill( bigIndex.increment( 1 ) );
  });
}
// take the API results and spit out only what we need
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
  modalFill(number);
  modalWindow.style.display = 'block';
  fadeOut.style.display = 'block';
};

// initialize the page (load the content and fills the page)
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

// handles events from the text input
filterInput.addEventListener('input', (event) => {
  //
  const regExpToMatch = new RegExp(event.target.value.toUpperCase());
  // take the card elements
  const cardsArray = Array.from(document.getElementsByClassName('card'));
  // for each card
  cardsArray.forEach( (card) => {
    // get the name div content
    const cardName = card.getElementsByClassName('name')[0].textContent.toUpperCase();
    // add or remove the class filtered-out if the name matches the text input
    if ( regExpToMatch.test(cardName) ) {
      card.classList.remove('filtered-out');
    } else {
      card.classList.add('filtered-out');
    }
  });
  // set the value of filteredOut property
  employeesModels = employeesModels.map( object => {
    object.filteredOut = !regExpToMatch.test(object.name.toUpperCase());
    return object;
  });
})

init(12);
