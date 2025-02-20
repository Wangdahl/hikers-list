//Default packlists
const multiDayList = [
    "Vandringsryggsäck",
    "Regnskydd för ryggsäck",
    "Tält",
    "Sovsäck",
    "Liggunderlag",
    "Campingkudde",
    "Pannlampa",
    "Karta",
    "Kompass",
    "Första hjälpen kit",
    "Toalettpapper",
    "Skoskavsplåster",
    "Tandborste & Tandkräm",
    "Myggmedel",
    "Solskydd",
    "Myggnät",
    "Stormkök",
    "Kokkärl",
    "Tändstickor / Tändare",
    "Bränsle",
    "Kåsa / Mugg",
    "Tallrik",
    "Bestick / Spork",
    "Vattenflaskor",
    "Mat (3 mål / dag + 1 extra)",
    "Diskmedel / Disksvamp",
    "Vandringskängor",
    "Vandringsbyxor",
    "T-shirt / tunn tröja",
    "Mellanlager",
    "Vandringsjacka",
    "Underkläder",
    "Vandringsstrumpor",
    "Regnställ",
    "Underställ",
    "Förstärkningsplagg",
    "Keps / Solglasögon",
    "Handskar",
    "Mössa",
    "Kniv",
    "Liten spade",
    "Tejp / Lagningskit",
    "Powerbank",
    "Vandringsstavar"
];

const singleDayList = [
    "Ryggsäck",
    "Kängor",
    "Regnkläder",
    "Förstärkningslager",
    "Vattenflaska och vatten",
    "1-3 mål mat",
    "Snacks",
    "Termos",
    "Mugg",
    "Stormkök",
    "Bränsle",
    "Tändare",
    "Kaffe",
    "Karta",
    "Kompass",
    "Första hjälpen",
    "Myggmedel",
    "Solskydd",
    "Toapapper",
    "Solglasögon",
    "Powerbank",
    "Ficklampa",
    "Fällkniv"
]


//Storing elements
const packList = document.getElementById('user-pack-list');
const itemInput = document.getElementById('newItem');
const packListTitle = document.getElementById('packListTitle');
const packListOptions = document.getElementById('packListOptions');

//Creating arrays and loading in saved items from local storage
const itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
const modifiedMultiDayList = localStorage.getItem('modifiedMultiDayList') ? JSON.parse(localStorage.getItem('modifiedMultiDayList')) : null;
const modifiedSingleDayList = localStorage.getItem('modifiedSingleDayList') ? JSON.parse(localStorage.getItem('modifiedSingleDayList')) : null;

// Global variables to track the currently active list and its storage key
let currentList = itemsArray;       // Initially, the custom list is active.
let currentStorageKey = 'items';

//Helper function to save list items in local storage
const saveItems = (list, key) => {
    localStorage.setItem(key, JSON.stringify(list));
}

//Helper function to remove items from array and update local storage
const removeItemFromArray = (list, itemText, key) => {
    //Find the index of the item to remove
    const index = list.indexOf(itemText);
    if(index !== -1) {
        list.splice(index, 1);
    }
    saveItems(list, key);
}

//Helper function to load a list into the UI
//Clears the users pack list
const loadList = (list, storageKey) => {
    packList.innerHTML = '';
    list.forEach(itemText => {
        createListElement(itemText, list, storageKey);
    });
}

//Helper function to create new list elements
const createListElement = (itemText, listRef, storageKey) => {
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
    removeBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
    removeBtn.addEventListener('click', () => {
        li.remove();
        removeItemFromArray(listRef, itemText, storageKey);

        if (storageKey === 'modifiedMultiDayList' || storageKey === 'modifiedSingleDayList') {
            updateDropdown(storageKey);
        }
    });
    //Attaching the span and button to the li element and then to the pack list
    li.appendChild(span);
    li.appendChild(removeBtn);
    packList.appendChild(li);
}

//Toggle dropdown visibility
packListTitle.addEventListener('click', () => {
    packListOptions.style.display = packListOptions.style.display === 'block' ? 'none' : 'block';
});



//Adding loaded items to the active list
loadList(itemsArray, 'items');

//Function for updating the dropdown list when a default list is edited
const updateDropdown = (storageKey) => {
    //Determine which list is being modified
    const dataValue = storageKey === 'modifiedMultiDayList' ? 'multiDay' : 'singleDay';

    //Remove existing modified version
    const existingModifiedList = packListOptions.querySelector(`li[data-value="${dataValue}"]`);
    if(existingModifiedList) {
        existingModifiedList.remove();
    }

    //Create a new modified li item for dropdown
    let li = document.createElement('li');
    li.setAttribute('data-value', dataValue);
    li.textContent = storageKey === 'modifiedMultiDayList' ? 'Din flerdagslista' : 'Din dagsturslista';
    
    //Making sure new list option appears at the right place
    let defaultSelector = storageKey === 'modifiedMultiDayList' ? 'li[data-value="multiOriginal"]' : 'li[data-value="singleOriginal"]';
    let defaultLi = packListOptions.querySelector(defaultSelector);

    if(defaultLi) {
        let next = defaultLi.nextElementSibling;
        if(next && next.getAttribute('data-value') === 'new') {
            defaultLi.parentNode.insertBefore(li, next);
        } else {
            defaultLi.parentNode.insertBefore(li, defaultLi.nextElementSibling);
        }
    } else {
        packListOptions.appendChild(li);
    }
    //Putting new list at the bottom
    let newOption = packListOptions.querySelector('li[data-value="new"]');
    if(newOption) {
        packListOptions.appendChild(newOption);
    }
    //Add event listener to load list
    li.addEventListener('click', () => {
        packListTitle.innerHTML = li.textContent + ' <i class="fas fa-chevron-down"></i>';
        packListOptions.style.display = 'none';
        
        //Hide input for default list
        document.querySelector('.input-container').style.display = 'flex';
        loadList(JSON.parse(localStorage.getItem(storageKey)), storageKey);
            // Update currentList/global if desired:
            currentList = JSON.parse(localStorage.getItem(storageKey));
            currentStorageKey = storageKey;
    });

    //Auto-update the dropdown list visible selection
    packListTitle.innerHTML = li.textContent + ' <i class="fas fa-chevron-down"></i>';
}

//Attach event listeners to static dropdown
packListOptions.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
        const selectedValue = item.getAttribute('data-value');
        //uppdate dropdown list
        packListTitle.innerHTML = item.textContent + ' <i class="fas fa-chevron-down"></i>';
        //hide dropdown menu
        packListOptions.style.display = 'none';

        if (selectedValue === 'custom') {
            currentList = itemsArray;
            currentStorageKey = 'items';
            loadList(itemsArray, 'items');
        } else if (selectedValue === 'new') {
            // Clear the custom list (reset it)
            itemsArray.length = 0;
            saveItems(itemsArray, 'items');
            currentList = itemsArray;
            currentStorageKey = 'items';
            loadList(itemsArray, 'items');
        } else if (selectedValue === 'multiOriginal') {
            // Load the original multi-day list; modifications will be saved under 'modifiedMultiDayList'
            currentStorageKey = 'modifiedMultiDayList';
            if (localStorage.getItem('modifiedMultiDayList')) {
                currentList = JSON.parse(localStorage.getItem('modifiedMultiDayList'));
            } else {
                currentList = multiDayList.slice(); // Make a copy so that the original isn’t changed.
            }
        } else if (selectedValue === 'singleOriginal') {
            currentStorageKey = 'modifiedSingleDayList';
            if (localStorage.getItem('modifiedSingleDayList')) {
                currentList = JSON.parse(localStorage.getItem('modifiedSingleDayList'));
            } else {
                currentList = singleDayList.slice();
            }
            loadList(currentList, currentStorageKey);
        }
    });
});
//Main function for adding items- Triggered by pressing the button
const addItem = () => {
    // Getting text from input box
    const itemText = itemInput.value.trim();
    //Ensuring input is not empty
    if(itemText === '') { 
        return;
    }
    //Adding item to array for local storage
    currentList.push(itemText);
    //Adding item to the active list
    createListElement(itemText, currentList, currentStorageKey);
    //Save items to local storage
    saveItems(currentList, currentStorageKey);
    // Clears input field
    itemInput.value='';

    // If new list has been selected switch it over to your list once item added
    if (currentStorageKey === 'items' && currentList.length === 1) {
        packListTitle.innerHTML = 'Din packlista <i class="fas fa-chevron-down"></i>';
    }
}

itemInput.addEventListener('keydown', event => {
    if(event.key === 'Enter') {
        event.preventDefault();
        addItem();
    }
})

window.addEventListener('load', () => {
    // Set default active list to custom packlist
    currentList = itemsArray;
    currentStorageKey = 'items';
    packListTitle.innerHTML = 'Din packlista <i class="fas fa-chevron-down"></i>';
    loadList(currentList, currentStorageKey);

    // If modified versions exist, add them to the dropdown.
    if (localStorage.getItem('modifiedMultiDayList')) {
        updateDropdown('modifiedMultiDayList');
    }
    if (localStorage.getItem('modifiedSingleDayList')) {
        updateDropdown('modifiedSingleDayList');
    }
});