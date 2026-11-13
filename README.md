# LogicPath: Interactive Digital Logic Design, Simulation and Optimization Platform

LogicPath is a web-based platform designed to help users learn, design, simulate, and optimize digital logic circuits. It provides an interactive environment for working with logic gates, generating truth tables, validating circuits, deriving Boolean expressions, and optimizing digital circuit designs.

##  Features

- **Interactive Circuit Design:** Design digital logic circuits using various logic gates.
- **Circuit Simulation:** Simulate circuits and observe their outputs based on different input combinations.
- **Truth Table Generation:** Automatically generate truth tables for designed circuits.
- **Boolean Expression Generation:** Generate Boolean expressions from circuit designs.
- **Circuit Validation:** Validate digital circuits to check their logical correctness.
- **Circuit Optimization:** Optimize circuits using Boolean algebra techniques.
- **User Authentication:** Secure user registration and login functionality.
- **Circuit Management:** Save, retrieve, and manage previously created circuits.
- **Learning Module:** Learn digital logic concepts through structured levels and questions.
- **Problem Arena:** Practice circuit design and optimization challenges.
- **Teacher Module:** Create and publish questions, verify solutions, and manage learning activities.

##  Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend
- Python
- Flask
- REST API

### Database
- MongoDB

### Authentication & Security
- JSON Web Tokens (JWT)
- bcrypt

##  Project Structure

```text
LogicPath/
│
├── logicpath-frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── logicpath-backend/
│   ├── app.py
│   ├── ...
│
└── README.md
```

##  Installation and Setup

### Prerequisites

Make sure you have the following installed:

- Python 3.x
- Node.js and npm
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/NandhanaCSudheer/LogicPath
cd LogicPath
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd logicpath-backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Configure the necessary environment variables in a `.env` file, including your MongoDB connection URI and JWT secret.

Start the Flask server:

```bash
python app.py
```

The backend server will run at:

`http://127.0.0.1:5000`

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd logicpath-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application in your browser using the local URL displayed by Vite, usually:

`http://localhost:5173`

##  Environment Configuration

Configure the required environment variables in the backend `.env` file.

Also configure the frontend API URL using the appropriate Vite environment variable:

```env
VITE_API_URL=http://127.0.0.1:5000
```

**Note:** Do not commit `.env` files, database credentials, JWT secrets, or other sensitive information to GitHub.

##  Project Objectives

- Simplify the learning and understanding of digital logic design.
- Provide an interactive platform for designing and simulating logic circuits.
- Automate truth table and Boolean expression generation.
- Help users understand Boolean algebra and circuit optimization.
- Provide a structured learning and practice environment for digital electronics.

##  Author

Developed as an academic project as part of the Master of Computer Applications (MCA) programme.

##  License

This project is available for educational and learning purposes.
