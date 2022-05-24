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

app.get("/inventory/", displayInvPage);
app.post("/createItem/", createItem);

app.get("/warehouses/", displayWhPage);
app.post("/addWarehouse/", addWarehouse);

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
    - User could update the info for an item, or delete it from the database
      (page will provide a note once the update is made succesfully.
       page will redirect to Inventory summary page after deleting an item)
    - Listed all warehouses that stores the item
- Warehouse summary page
    - Provides a form for user to create a new warehouse
    - Warehouse name, location and code should be unique
    - Listed all warehouses being created, each warehouse is linked to it's detail page
- Warehouse detail page
    - Allows the user to modify the information for the selected warehouse
    - User could update the info for a warehouse, or delete it from the database
      (page will provide a note once the update is made succesfully.
       page will redirect to Warehouse summary page after deleting an item
       note that if a warehouse got deleted, all items in that warehouse will also got deleted)
    - Listed all items stored in the selected warehouse


