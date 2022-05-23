Assignment 4
Name: Xiangqiu Jiang
ID: 101049311

Instruction: - enter in the terminal: npm run db-init
             - enter in the terminal: npm run dev


Supported route

app.use(exposeSession);
app.get("/", displayHomePage);
app.get("/users", getUsers);
app.get("/users/:uid", sendSingleUser);
app.post("/profile/:uid", updateUserPrivacy);
app.post("/login", login);
app.get("/logout", logout);
app.get("/register", displayRegisterPage);
app.post("/register", register);
app.get("/profile/:uid", auth, displayProfilePage);
app.get("/orderForm/:uid", auth, displayOrderPage);
app.post("/orders",submitOrder);
app.get("/orders/:orderID", getOrder);

Page details:

- Navigation header
    - To be included in all pages (pug)
    - Changes depending on current session state (login vs. logout)
        - Client is logged in?  -> Home / Users / Order / Profile / (A method for logout)
        - Client is not logged? -> Home / Users / Registration / (A method for login)
    - What happens when a client requests the "/order" or "/profile" page but hasn't logged in?
- User Registration
    - Provide a registration form, user should provide username and password to create account
    - New profiles' privacy default is "public"
    - Duplicate usernames are not allowed
    - Success -> Log user in (save session data) & redirect to user profile page
    - Failure -> Display error message & do not redirect
- User directory
    - Query the users collection, display results in html page, allow 'name' query parameter
    - Only 'public' profiles should match the query
    - Query should be case insensitive, eg. users?name="m" should show "madaline", "merrill" and "leoma"
    - Private users should not be part of results
- User profile page
    - Private profiles are only visible to owner
    - Public profiles are visible to all users
    - Users viewing own profile should be able to change privacy setting
- Order summary page
    - Displays order information
    - Visible if user that placed order is public
    - Visible if user is viewing it's own order
- Order Form and Submission
    - Only viewable for logged in users
    - Allows user to send order to server
    - Server should store orders in database
