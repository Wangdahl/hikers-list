//Storing elements
const packList = document.getElementById('user-pack-list');
const itemInput = document.getElementById('newItem');

//Creating array and loading in saved items from local storage
const itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

//Helper function to save list items in local storage
const saveItems = () => {
    localStorage.setItem('items', JSON.stringify(itemsArray));
}

//Helper function to remove items from array and update local storage
const removeItemFromArray = itemText => {
    //Find the index of the item to remove
    const index = itemsArray.indexOf(itemText);
    if(index !== -1) {
        itemsArray.splice(index, 1);
    }
    saveItems();
}

//Helper function to create new list elements
const createListElement = itemText => {
    //Creating list element and setting class
    let li = document.createElement('li');
    li.className = 'item';

    //Creating span element to display the input
    let span = document.createElement('span');
    span.textContent = itemText;
    span.addEventListener('click', () => {
        span.classList.toggle('done');
    });
    //Creating a button to remove the list item
    let removeBtn = document.createElement('button');
    removeBtn.innerHTML = '<i class="fa-solid fa-x"></i>';
    removeBtn.addEventListener('click', () => {
        li.remove();
        removeItemFromArray(itemText);
    });
    //Attaching the span and button to the li element and then to the pack list
    li.appendChild(span);
    li.appendChild(removeBtn);
    packList.appendChild(li);
}

//Adding loaded items to the active list
itemsArray.forEach(createListElement);


//Main function for adding items- Triggered by pressing the button
const addItem = () => {
    // Getting text from input box
    const itemText = itemInput.value.trim();
    //Ensuring input is not empty
    if(itemText === '') { 
        return;
    }
    //Adding item to array for local storage
    itemsArray.push(itemText);
    //Adding item to the active list
    createListElement(itemText);
    //Save items to local storage
    saveItems();
    // Clears input field
    itemInput.value='';
}

itemInput.addEventListener('keydown', event => {
    if(event.key === 'Enter') {
        event.preventDefault();
        addItem();
    }
})