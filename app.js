// Strorage Controllers

const StorageCtrl = (function() {
  // public methods
  return {
    // store item in localStorage
    storeItem: function(item) {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },

    // Get items form the localstorage
    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },

    // Update items in the localStorage
    updateLocalStorage: function(updateItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function(item, index) {
        if (updateItem.id === item.id) {
          items.splice(index, 1, updateItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },

    deleteItemFromLocalStorage: function(currentItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function(item, index) {
        if (currentItem.id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearAllItems: function() {
      localStorage.removeItem("items");
    }
  };
})();

// Item Controllers

const ItemCtrl = (function() {
  //Creating A constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structor
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  //Public Methods
  return {
    logData: function() {
      return data;
    },
    addData: function(name, calories) {
      // Generate an id
      let ID = 0;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      calories = parseInt(calories);
      newItem = new Item(ID, name, calories);
      data.items.push(newItem);
      return newItem;
    },
    getData: function() {
      return data.items;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getTotalCalories: function() {
      total = 0;
      data.items.forEach(function(item) {
        total += item.calories;
      });
      data.totalCalories = total;

      return data.totalCalories;
    },
    getItemById: function(id) {
      let found = null;
      data.items.forEach(function(item, index) {
        if (item.id == id) {
          found = item;
        }
      });
      return found;
    },
    // Delete item
    deleteItem: function(id) {
      // Get the ids
      const ids = data.items.map(function(item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    // update item
    updateData: function(name, calories) {
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    // Clear all Items
    clearAllItems: function() {
      data.items = [];
    }
  };
})();

// UI Controllers

const UICtrl = (function() {
  const UISelector = {
    listItem: "#item-list",
    listItemAll: "#item-list li",
    addBtn: ".add-btn",
    clearAll: ".clear-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    inputItemName: "#item-name",
    inputCaloriesName: "#item-calories",
    totalCalories: ".total-calories",
    itemName: "#item-name",
    itemCalories: "#item-calories"
  };

  // Public Methods
  return {
    populateItemList: function(items) {
      let html = "";
      items.forEach(function(item) {
        html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"
            ><i class="edit-item fa fa-pencil"> </i>
          </a>
        </li>`;
      });
      document.querySelector(UISelector.listItem).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelector.inputItemName).value,
        calories: document.querySelector(UISelector.inputCaloriesName).value
      };
    },
    updateListItem: function(item) {
      let allList = document.querySelectorAll(UISelector.listItemAll);

      //Convert node list into an array
      allList = Array.from(allList);

      allList.forEach(function(list) {
        const itemID = list.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"
            ><i class="edit-item fa fa-pencil"> </i>
          </a>`;
        }
      });
    },
    getSelectors: function() {
      return UISelector;
    },
    addListItem: function(item) {
      // Create li element
      const li = document.createElement("li");
      // Add class
      li.className = "collection-item";
      // Add id
      li.id = `item-${item.id}`;
      // Add html
      li.innerHTML = `
      <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content"
        ><i class="edit-item fa fa-pencil"> </i>
      </a>`;
      // Inserte item
      document
        .querySelector(UISelector.listItem)
        .insertAdjacentElement("beforeend", li);
    },
    clearInput: function() {
      document.querySelector(UISelector.inputItemName).value = "";
      document.querySelector(UISelector.inputCaloriesName).value = "";
    },
    showTotalCalories: function(item) {
      document.querySelector(UISelector.totalCalories).innerHTML = item;
    },
    hideEditButton: function() {
      document.querySelector(UISelector.updateBtn).style.display = "none";
      document.querySelector(UISelector.deleteBtn).style.display = "none";
      document.querySelector(UISelector.backBtn).style.display = "none";
      document.querySelector(UISelector.addBtn).style.display = "inline";
    },
    showEditButton: function() {
      document.querySelector(UISelector.updateBtn).style.display = "inline";
      document.querySelector(UISelector.deleteBtn).style.display = "inline";
      document.querySelector(UISelector.backBtn).style.display = "inline";
      document.querySelector(UISelector.addBtn).style.display = "none";
    },
    displayItemInForm: function(item) {
      document.querySelector(UISelector.itemName).value = item.name;
      document.querySelector(UISelector.itemCalories).value = item.calories;
    },
    deleteItem: function(id) {
      const itemd = document.querySelector(`#item-${id}`);
      itemd.remove();
    },
    removeListItem: function() {
      let allList = document.querySelectorAll(UISelector.listItemAll);
      allList = Array.from(allList);
      allList.forEach(function(item) {
        item.remove();
      });
    }
  };
})();

// App Controllers
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Adding Item to ItemCtrl

  // Load event listeners
  const loadEventListeners = function() {
    // Get UI Selectors
    const UISelector = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelector.addBtn)
      .addEventListener("click", addItemSubmit);

    // Edit items
    document
      .querySelector(UISelector.listItem)
      .addEventListener("click", editItem);

    // update items
    document
      .querySelector(UISelector.updateBtn)
      .addEventListener("click", updateItem);

    // delete item
    document
      .querySelector(UISelector.deleteBtn)
      .addEventListener("click", deleteItem);

    // Back Button
    document
      .querySelector(UISelector.backBtn)
      .addEventListener("click", function(e) {
        UICtrl.hideEditButton();
        e.preventDefault();
      });
    // Clear All Items Button
    document
      .querySelector(UISelector.clearAll)
      .addEventListener("click", clearAllItems);
  };

  // Add itemSubmit Function
  const addItemSubmit = function(e) {
    // Get form input from UI controller
    const input = UICtrl.getItemInput();
    if (input.name !== "" && input.calories !== "") {
      // Add input values to item controllers
      const newItem = ItemCtrl.addData(input.name, input.calories);

      // Add calories values to total calories
      let totalCalories = ItemCtrl.getTotalCalories();
      // Add totalCalories in the UI
      UICtrl.showTotalCalories(totalCalories);

      // Add item to the UI
      UICtrl.addListItem(newItem);
      StorageCtrl.storeItem(newItem);

      // Clear Fields
      UICtrl.clearInput();
    }

    // Add Calories to the total

    e.preventDefault();
  };

  // edit Item Function
  const editItem = function(e) {
    // Disabling enter
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    if (e.target.classList.contains("edit-item")) {
      // // display the edit button
      UICtrl.showEditButton();

      // display the current item in the form
      // Get the id
      const listId = e.target.parentNode.parentNode.id;
      // Break into an array
      const listIdArr = listId.split("-");
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.displayItemInForm(itemToEdit);

      // ItemCtrl.setCurrentItem(itemToEdit);
    }
    e.preventDefault();
  };

  // Update item Function
  const updateItem = function(e) {
    // Get Form inputs
    const input = UICtrl.getItemInput();
    // Update Item Controller
    const updatedItem = ItemCtrl.updateData(input.name, input.calories);

    // Update list item in the UI
    UICtrl.updateListItem(updatedItem);

    // Add calories values to total calories
    let totalCalories = ItemCtrl.getTotalCalories();
    // Add totalCalories in the UI
    UICtrl.showTotalCalories(totalCalories);

    // update local storage
    StorageCtrl.updateLocalStorage(updatedItem);

    // Hide Edit buttons
    UICtrl.hideEditButton();

    // Clear form field
    UICtrl.clearInput();

    e.preventDefault();
  };

  // Delete item function
  const deleteItem = function(e) {
    const currentItem = ItemCtrl.logData().currentItem;
    ItemCtrl.deleteItem(currentItem.id);
    UICtrl.deleteItem(currentItem.id);

    // Add calories values to total calories
    let totalCalories = ItemCtrl.getTotalCalories();
    // Add totalCalories in the UI
    UICtrl.showTotalCalories(totalCalories);

    // Clear form field
    UICtrl.clearInput();

    // Delete from localStorage
    StorageCtrl.deleteItemFromLocalStorage(currentItem);

    // Hide Edit buttons
    UICtrl.hideEditButton();

    e.preventDefault();
  };

  // clear allItems fuunction
  const clearAllItems = function(e) {
    ItemCtrl.clearAllItems();

    // Add calories values to total calories
    let totalCalories = ItemCtrl.getTotalCalories();
    // Add totalCalories in the UI
    UICtrl.showTotalCalories(totalCalories);

    // Clear in the UI
    UICtrl.removeListItem();

    // Clear in localStorage
    StorageCtrl.clearAllItems();

    e.preventDefault();
  };

  // Public Methods
  return {
    init: function() {
      // Hide update btns
      UICtrl.hideEditButton();

      // Get items from ItemCtrl
      const items = ItemCtrl.getData();

      // show items in the UI
      UICtrl.populateItemList(items);

      // Add calories values to total calories
      let totalCalories = ItemCtrl.getTotalCalories();
      // Add totalCalories in the UI
      UICtrl.showTotalCalories(totalCalories);

      // Event listners
      loadEventListeners();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
