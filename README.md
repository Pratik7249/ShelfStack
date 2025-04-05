# 📚 SelfStack - Library Management System

SelfStack is a robust and intuitive Library Management System built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and Redux Toolkit. It enables users to browse, borrow, and return books, while administrators can manage users, books, and borrowing records via a powerful admin dashboard.

## 🚀 Features

### 👥 User Features

✅ User Authentication – Secure login & registration using JWT.
✅ Browse Books – Search and view books in an interactive catalog.
✅ Borrow & Return Books – Borrow available books and return them with ease.
✅ User Dashboard – Track borrowed books and due dates.
✅ Role-Based Access Control – Ensure different access levels for users and admins.

### 🛠️ Admin Features

✅ Admin Dashboard – Monitor total users, books, and borrowed records.
✅ User & Book Management – Add, edit, or remove users and books.
✅ Borrowing Records – Track books that have been borrowed and returned.
✅ Authorization – Middleware to restrict access to admin-only routes.
✅ Real-time Notifications – Toastify alerts for successful and failed actions.

## 🧱 Tech Stack

### Frontend:

-**React.js** – For building the UI.

-**Redux Toolkit** – For state management.

-**React Router** – For client-side navigation.

-**React Toastify** – For notifications.

-**Tailwind CSS** – For responsive and modern styling.

### Backend:

-**Node.js & Express.js** – For REST API development.

-**MongoDB & Mongoose** – For database management.

-**JWT (JSON Web Token)** – For secure authentication.

-**Bcrypt.js** – For password hashing.

### 📁 Project Structure
```
SelfStack/
├── client/                     # Frontend (React)
│   ├── public/                 # Static assets
│   ├── src/                    # Source files
│   │   ├── assets/             # Images, icons, etc.
│   │   ├── components/         # Reusable UI elements
│   │   ├── layout/             # Shared layout components
│   │   │   ├── Header.jsx      # Main header component
│   │   │   ├── SideBar.jsx     # Sidebar navigation
│   │   ├── pages/              # Main application pages (Home, Login, Dashboard, etc.)
│   │   ├── popups/             # Modal popups for various actions
│   │   ├── store/              # Redux store and slices
│   │   ├── App.jsx             # Main React component
│   │   ├── index.css           # Global styles
│   │   ├── main.jsx            # React root rendering
│   ├── package.json            # Frontend dependencies
│   ├── README.md               # Project documentation
│   ├── .gitignore              # Files to ignore in Git
│   ├── eslint.config.js        # ESLint configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── index.html              # Root HTML template
├── server/                     # Backend (Node.js & Express)
│   ├── models/                 # Mongoose schemas (User, Book, Borrow)
│   ├── routes/                 # API routes
│   ├── controllers/            # Logic for route handling
│   ├── middlewares/            # Authentication & error handling
│   ├── server.js               # Backend entry point
├── .env                        # Environment variables
```
### ⚙️ Setup & Installation

## Prerequisites:

- Node.js (v16+)

- MongoDB (Local or Cloud Atlas)

- Git (Latest version)

- Code Editor (VS Code recommended)

## Steps:

🛠 **Clone the Repository**:
      ```bash
      git clone https://github.com/your-username/selfstack.git
      ```

🔧 **Backend Setup**:

- Navigate to the server folder and install dependencies:

        ```bash
        cd server
        npm install
        ```
  
🔧 **Frontend Setup**:

- Navigate to the client folder and install dependencies:

        ```bash
        cd client
        npm install
        ```

**Create a .env file inside the server directory and add the following:**
        ```bash
        PORT= 
        FRONTEND_URL=
        MONGO_URI=
        SMTP_HOST =
        SMTP_SERVICE =
        SMTP_PORT =
        SMTP_MAIL =
        SMTP_PASSWORD =
        JWT_SECRET=
        JWT_EXPIRE=
        COOKIE_EXPIRED= 
        CLOUDINARY_CLIENT_NAME =
        CLOUDINARY_CLIENT_API =
        CLOUDINARY_CLIENT_SECRET=-e98SmTXmenLk
        ```

**Start the backend server:**
        ```bash
        npm run dev
        ```


## 🎮 Usage

🔹 **For Users:**

- Register or log in.

- Browse available books in the catalog.

- Borrow books (if available).

- Return borrowed books before the due date.

- View borrowed book history in the dashboard.

🔹 **For Admins:**

- Log in with admin credentials.

- Access the admin dashboard.

- Add, edit, or remove books and users.

- Monitor borrowed books and send return reminders.

## 🔒 Authentication & Security

- JWT Authentication – Users & admins receive secure JSON Web Tokens upon login.

- Password Hashing – Bcrypt.js is used to encrypt passwords.

- Role-Based Access Control – Admins and users have different permissions.

## 📈 Future Roadmap

🔹 Email Notifications – Send return reminders.

🔹 Book Reservation – Allow users to reserve books in advance.

🔹 Analytics Dashboard – Show insights on book borrowing trends.

🔹 Dark Mode – Theme switcher for better UI experience.

## Contributing

We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature/your-feature
    ```
3. Commit your changes:
    ```bash
    git commit -m "Add your message here"
    ```
4. Push to your branch:
    ```bash
    git push origin feature/your-feature
    ```
5. Open a pull request on GitHub.



