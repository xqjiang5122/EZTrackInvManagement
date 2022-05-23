Created by: Xiangqiu Jiang

Requirements met:

Basic CRUD Functionality. The webpage allows user to:
  - Create inventory items
  - Edit Them
  - Delete Them
  - View a list of them

Feature implemented:
  - Ability to create warehouses/locations and assign inventory to specific locations
  - User are able to view the list of items, and for each item which warehouse(s) store this item, and for each warehouse, which items it stores

To be improved in the future:
  - Add the function to sort the list of items/warehouses by time of modification,
    or by alphabatical order of selecting parameters: SKU, Code, Name, etc.
  - User authentication can be added to track the creator and modifier of the entries


Instruction: - enter in the terminal: npm run db-init
             - enter in the terminal: npm run dev

Supported route:

app.get("/", displayHomePage);
app.post("/addWarehouse/", addWarehouse);
app.get("/warehouses/", displayWhPage);
app.post("/createItem/", createItem);
app.get("/inventory/", displayInvPage);
app.get("/item/:uid", editItemPage);
app.post("/editItem/:uid", editItem);
app.post("/deleteItem/:uid", deleteItem);
app.get("/warehouse/:uid", editWhPage);
app.post("/editWarehouse/:uid", editWarehouse);
app.post("/deleteWarehouse/:uid", deleteWarehouse);

Page details:

- Navigation header
    - To be included in all pages (pug)
    - Shows the link to Inventory summary and Warehouse summary  page
- Inventory summary page
    - Provides a form for user to create a new item
    - User need to create a warehouse first before assigning an item to that warehouse
    - Item name and SKU are unique combination
    - Item name and location are unique combination
    - Listed all items being created, each item is linked to it's detail page
- Inventory detail page
    - Allows the user to modify the information for the selected item
    - Listed all warehouses that stores the item
- Warehouse summary page
    - Provides a form for user to create a new warehouse
    - Warehouse name, location and code should be unique
    - Listed all warehouses being created, each warehouse is linked to it's detail page
- Warehouse detail page
    - Allows the user to modify the information for the selected warehouse
    - Listed all items stored in the selected warehouse

Requirements met:
Basic CRUD Functionality. The webpage allows user to:
  - Create inventory items
  - Edit Them
  - Delete Them
  - View a list of them

Feature implemented:
  - Ability to create warehouses/locations and assign inventory to specific locations
