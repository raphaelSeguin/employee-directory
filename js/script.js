// 'be serious'
'use strict';

// global variables
let employeesModels = [];

// elements
const containerDiv = document.getElementById('container');
const modalWindow = document.getElementById('modal');
const fadeOut = document.getElementById('fade-out');
const filterInput = document.getElementById('filter');
const modalInfos = document.getElementById('modal-infos');
// elements on the modal
const closeModalAnchor = document.getElementById('close-modal');
const backModalAnchor = document.getElementById('back-modal');
const forthModalAnchor = document.getElementById('forth-modal');

// utility function
const capitalizeFirstLetter = word => {
  return word.substr(0, 1).toUpperCase() + word.substr(1);
};

// build the elements and attach event handlers
const fillCard = (data, index) => {
  // destructure the variables from the object data
  const {picture, name, email, city} = data;
  // create a div element
  const card = document.createElement('div');
  // add class card
  card.classList.add('card');
  // set the id
  card.id = index;
  // add content to the div.card
  card.insertAdjacentHTML('afterbegin',
   `<img class="picture" src="${picture}" alt="photo of employee">
    <div class="infos">
      <div class="name">${name}</div>
      <div class="email">${email}</div>
      <div class="city">${city}</div>
    </div>`);
  // add an event handler
  card.addEventListener('click', event => {
    // if the card is not filtered out
    if( !card.classList.contains('filtered-out') ) {
      // display the modal corresponding to this card
      showModal(card.id);
    }
  });
  return card;
};
const fillModal = number => {
  const {picture, name, email, cellnumber, address, city, birthdate} = employeesModels[number];
  modalInfos.className = number;
  modalInfos.innerHTML = `<img class="picture modal" src="${picture}" alt="">
      <div class="name modal">${name}</div>
      <div class="email modal">${email}</div>
      <div class="city modal">${city}</div>
      <hr></hr>
      <div class="cellnumber modal">${cellnumber}</div>
      <div class="address modal">${address}</div>
      <div class="birthdate modal">${birthdate}</div>`;
}

const showModal = number => {
  fillModal(number);
  modalWindow.classList.add('active');
  fadeOut.classList.add('active');
};
const hideModal = () => {
  modalWindow.classList.remove('active');
  fadeOut.classList.remove('active');
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
    birthdate: json.dob,
    filteredOut: false
  }
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
  .then( employeesArray => employeesArray.map(fillCard) )
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
closeModalAnchor.addEventListener('click', () => {
  hideModal();
});
backModalAnchor.addEventListener('click', () => {
  let cardNumber = parseInt(modalInfos.className);
  let limit = 12;
  do {
    cardNumber = (cardNumber + 11) % 12;
    limit--;
  } while( employeesModels[cardNumber].filteredOut === true && limit > 0);
  showModal( cardNumber );
});
forthModalAnchor.addEventListener('click', () => {
  let cardNumber = parseInt(modalInfos.className);
  let limit = 12;
  do {
    cardNumber = (cardNumber + 13) % 12;
    limit--;
  } while( employeesModels[cardNumber].filteredOut === true && limit > 0);
  showModal( cardNumber );
});

init(12);
