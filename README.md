To build a professional-grade income and expense tracker app using the MERN stack and Firebase for authentication and other services, follow these steps:

1. **Setup and Plan**:
   - Use MongoDB for data storage.
   - Use Express.js for the backend server.
   - Use React.js for the frontend.
   - Use Node.js as the runtime environment.
   - Use Firebase for authentication, analytics, remote config, and in-app messaging.

2. **Detailed Plan**:
   - Set up the backend server with Express and connect to MongoDB.
   - Implement Firebase authentication.
   - Create RESTful API endpoints for CRUD operations on transactions (expenses and incomes).
   - Set up the React frontend to interact with the backend and handle user authentication.
   - Configure Firebase for analytics, remote config, and in-app messaging.

3. **Pseudocode**:

### Backend (Node.js, Express, MongoDB)
- **Server Setup**:
  - Install necessary packages: `express`, `mongoose`, `firebase-admin`, `body-parser`, `cors`
  - Connect to MongoDB using Mongoose
  - Set up Firebase Admin SDK for authentication

- **User Model**:
  - Define User schema and model in Mongoose

- **Transaction Models**:
  - Define Expense schema and model
  - Define Income schema and model

- **Routes**:
  - User routes for authentication (sign up, login)
  - Expense routes (CRUD operations)
  - Income routes (CRUD operations)

### Frontend (React.js)
- **Setup**:
  - Install necessary packages: `react-router-dom`, `firebase`, `axios`
  - Configure Firebase in the frontend

- **Components**:
  - Authentication (Sign up, Login)
  - Dashboard (Overview of expenses and incomes)
  - Expense and Income forms
  - Expense and Income lists

- **State Management**:
  - Use Context API or Redux for managing global state

### Firebase Configuration
- **Authentication**: Configure email/password authentication
- **Analytics**: Enable Firebase Analytics
- **Remote Config**: Set up default values
- **In-App Messaging**: Set up messaging campaigns

### File Structure

**Backend**:
```
/backend
|-- /controllers
|   |-- authController.js
|   |-- expenseController.js
|   |-- incomeController.js
|-- /models
|   |-- User.js
|   |-- Expense.js
|   |-- Income.js
|-- /routes
|   |-- authRoutes.js
|   |-- expenseRoutes.js
|   |-- incomeRoutes.js
|-- /config
|   |-- db.js
|   |-- firebase.js
|-- server.js
```

**Frontend**:
```
/frontend
|-- /src
|   |-- /components
|   |   |-- Auth
|   |   |   |-- Login.js
|   |   |   |-- Signup.js
|   |   |-- Dashboard
|   |   |   |-- Dashboard.js
|   |   |-- Expenses
|   |   |   |-- ExpenseForm.js
|   |   |   |-- ExpenseList.js
|   |   |-- Incomes
|   |   |   |-- IncomeForm.js
|   |   |   |-- IncomeList.js
|   |-- /context
|   |   |-- AuthContext.js
|   |-- /services
|   |   |-- api.js
|   |-- /utils
|   |   |-- firebaseConfig.js
|   |-- App.js
|   |-- index.js
```

Now, let's write the actual code step-by-step.

### Backend Code

**1. Server Setup (`server.js`)**:
```javascript
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const firebaseAdmin = require('firebase-admin');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const firebaseConfig = require('./config/firebase');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Firebase Admin SDK setup
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseConfig),
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/financeApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

**2. Firebase Configuration (`config/firebase.js`)**:
```javascript
module.exports = {
  type: "service_account",
  project_id: "your-project-id",
  private_key_id: "your-private-key-id",
  private_key: "your-private-key",
  client_email: "your-client-email",
  client_id: "your-client-id",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "your-client-x509-cert-url"
};
```

**3. User Model (`models/User.js`)**:
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
```

**4. Expense Model (`models/Expense.js`)**:
```javascript
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  dateBought: {
    type: Date,
    required: true,
  },
  itemBought: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
  },
});

module.exports = mongoose.model('Expense', expenseSchema);
```

**5. Income Model (`models/Income.js`)**:
```javascript
const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  dateReceived: {
    type: Date,
    required: true,
  },
  amountReceived: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
  },
});

module.exports = mongoose.model('Income', incomeSchema);
```

**6. Auth Controller (`controllers/authController.js`)**:
```javascript
const firebaseAdmin = require('firebase-admin');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await firebaseAdmin.auth().createUser({
      email,
      password,
    });

    const newUser = new User({
      uid: userRecord.uid,
      email: userRecord.email,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await firebaseAdmin.auth().getUserByEmail(email);
    const user = await User.findOne({ uid: userRecord.uid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

**7. Expense Controller (`controllers/expenseController.js`)**:
```javascript
const Expense = require('../models/Expense');

exports.createExpense = async (req, res) => {
  const { userId, dateBought, itemBought, amount, note } = req.body;

  try {
    const newExpense = new Expense({
      userId,
      dateBought,
      itemBought,
      amount,
      note,
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  const { userId } = req.params;

  try {
    const expenses = await Expense.find({ userId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  const { expenseId } = req.params;
  const { dateBought, itemBought, amount, note } = req.body;

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(expenseId, {
      dateBought,
      itemBought,
      amount,
      note,
    }, { new: true });

    res.status(200

).json(updatedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  const { expenseId } = req.params;

  try {
    await Expense.findByIdAndDelete(expenseId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

**8. Income Controller (`controllers/incomeController.js`)**:
```javascript
const Income = require('../models/Income');

exports.createIncome = async (req, res) => {
  const { userId, dateReceived, amountReceived, note } = req.body;

  try {
    const newIncome = new Income({
      userId,
      dateReceived,
      amountReceived,
      note,
    });

    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getIncomes = async (req, res) => {
  const { userId } = req.params;

  try {
    const incomes = await Income.find({ userId });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateIncome = async (req, res) => {
  const { incomeId } = req.params;
  const { dateReceived, amountReceived, note } = req.body;

  try {
    const updatedIncome = await Income.findByIdAndUpdate(incomeId, {
      dateReceived,
      amountReceived,
      note,
    }, { new: true });

    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteIncome = async (req, res) => {
  const { incomeId } = req.params;

  try {
    await Income.findByIdAndDelete(incomeId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

**9. Routes (`routes/authRoutes.js`)**:
```javascript
const express = require('express');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
```

**10. Routes (`routes/expenseRoutes.js`)**:
```javascript
const express = require('express');
const { createExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');

const router = express.Router();

router.post('/', createExpense);
router.get('/:userId', getExpenses);
router.put('/:expenseId', updateExpense);
router.delete('/:expenseId', deleteExpense);

module.exports = router;
```

**11. Routes (`routes/incomeRoutes.js`)**:
```javascript
const express = require('express');
const { createIncome, getIncomes, updateIncome, deleteIncome } = require('../controllers/incomeController');

const router = express.Router();

router.post('/', createIncome);
router.get('/:userId', getIncomes);
router.put('/:incomeId', updateIncome);
router.delete('/:incomeId', deleteIncome);

module.exports = router;
```

### Frontend Code

**1. Firebase Configuration (`src/utils/firebaseConfig.js`)**:
```javascript
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
export const analytics = firebase.analytics();
export default firebase;
```

**2. App Component (`src/App.js`)**:
```javascript
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/" component={Dashboard} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

**3. Auth Context (`src/context/AuthContext.js`)**:
```javascript
import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebaseConfig';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  const login = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const value = {
    currentUser,
    signup,
    login,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
```

**4. Private Route Component (`src/components/Auth/PrivateRoute.js`)**:
```javascript
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={props => {
        return currentUser ? <Component {...props} /> : <Redirect to="/login" />;
      }}
    ></Route>
  );
}
```

**5. Signup Component (`src/components/Auth/Signup.js`)**:
```javascript
import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useHistory } from 'react-router-dom';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      history.push('/');
    } catch {
      setError('Failed to create an account');
    }

    setLoading(false);
  }

  return (
    <>
      <h2>Sign Up</h2>
      {error && <alert>{error}</alert>}
      <form onSubmit={handleSubmit}>
        <div id="email">
          <label>Email</label>
          <input type="email" ref={emailRef} required />
        </div>
        <div id="password">
          <label>Password</label>
          <input type="password" ref={passwordRef} required />
        </div>
        <div id="password-confirm">
          <label>Password Confirmation</label>
          <input type="password" ref={passwordConfirmRef} required />
        </div>
        <button disabled={loading} type="submit">Sign Up</button>
      </form>
      <div>
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </>
  );
}
```

**6. Login Component (`src/components/Auth/Login.js`)**:
```javascript
import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useHistory } from 'react-router-dom';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push('/');
    } catch {
      setError('Failed to log in');
    }

    setLoading(false);
  }

  return (
    <>
      <h2>Log In</h2>
      {error && <alert>{error}</alert>}
      <form onSubmit={handleSubmit}>
        <div id="email">
          <label>Email</label>
          <input type="email" ref={emailRef} required />
        </div>
        <div id="password">
          <label>Password

</label>
          <input type="password" ref={passwordRef} required />
        </div>
        <button disabled={loading} type="submit">Log In</button>
      </form>
      <div>
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  );
}
```

**7. Dashboard Component (`src/components/Dashboard/Dashboard.js`)**:
```javascript
import React from 'react';
import ExpenseForm from '../Expenses/ExpenseForm';
import ExpenseList from '../Expenses/ExpenseList';
import IncomeForm from '../Incomes/IncomeForm';
import IncomeList from '../Incomes/IncomeList';

export default function Dashboard() {
  return (
    <>
      <h2>Dashboard</h2>
      <div>
        <ExpenseForm />
        <ExpenseList />
      </div>
      <div>
        <IncomeForm />
        <IncomeList />
      </div>
    </>
  );
}
```

**8. Expense Form Component (`src/components/Expenses/ExpenseForm.js`)**:
```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function ExpenseForm() {
  const { currentUser } = useAuth();
  const [dateBought, setDateBought] = useState('');
  const [itemBought, setItemBought] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newExpense = {
      userId: currentUser.uid,
      dateBought,
      itemBought,
      amount,
      note,
    };

    try {
      await axios.post('http://localhost:5000/api/expenses', newExpense);
      // Clear form
      setDateBought('');
      setItemBought('');
      setAmount('');
      setNote('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Date Bought</label>
        <input type="date" value={dateBought} onChange={(e) => setDateBought(e.target.value)} required />
      </div>
      <div>
        <label>Item Bought</label>
        <input type="text" value={itemBought} onChange={(e) => setItemBought(e.target.value)} required />
      </div>
      <div>
        <label>Amount</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>
      <div>
        <label>Note</label>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <button type="submit">Add Expense</button>
    </form>
  );
}
```

**9. Expense List Component (`src/components/Expenses/ExpenseList.js`)**:
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function ExpenseList() {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/expenses/${currentUser.uid}`);
        setExpenses(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExpenses();
  }, [currentUser.uid]);

  return (
    <div>
      <h3>Expenses</h3>
      <ul>
        {expenses.map((expense) => (
          <li key={expense._id}>
            {expense.dateBought} - {expense.itemBought} - ${expense.amount} - {expense.note}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**10. Income Form Component (`src/components/Incomes/IncomeForm.js`)**:
```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function IncomeForm() {
  const { currentUser } = useAuth();
  const [dateReceived, setDateReceived] = useState('');
  const [amountReceived, setAmountReceived] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newIncome = {
      userId: currentUser.uid,
      dateReceived,
      amountReceived,
      note,
    };

    try {
      await axios.post('http://localhost:5000/api/incomes', newIncome);
      // Clear form
      setDateReceived('');
      setAmountReceived('');
      setNote('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Date Received</label>
        <input type="date" value={dateReceived} onChange={(e) => setDateReceived(e.target.value)} required />
      </div>
      <div>
        <label>Amount</label>
        <input type="number" value={amountReceived} onChange={(e) => setAmountReceived(e.target.value)} required />
      </div>
      <div>
        <label>Note</label>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <button type="submit">Add Income</button>
    </form>
  );
}
```

**11. Income List Component (`src/components/Incomes/IncomeList.js`)**:
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function IncomeList() {
  const { currentUser } = useAuth();
  const [incomes, setIncomes] = useState([]);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/incomes/${currentUser.uid}`);
        setIncomes(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchIncomes();
  }, [currentUser.uid]);

  return (
    <div>
      <h3>Incomes</h3>
      <ul>
        {incomes.map((income) => (
          <li key={income._id}>
            {income.dateReceived} - ${income.amountReceived} - {income.note}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### File Structure

**Backend**:
```
/backend
|-- /controllers
|   |-- authController.js
|   |-- expenseController.js
|   |-- incomeController.js
|-- /models
|   |-- User.js
|   |-- Expense.js
|   |-- Income.js
|-- /routes
|   |-- authRoutes.js
|   |-- expenseRoutes.js
|   |-- incomeRoutes.js
|-- /config
|   |-- db.js
|   |-- firebase.js
|-- server.js
```

**Frontend**:
```
/frontend
|-- /src
|   |-- /components
|   |   |-- Auth
|   |   |   |-- Login.js
|   |   |   |-- Signup.js
|   |   |-- Dashboard
|   |   |   |-- Dashboard.js
|   |   |-- Expenses
|   |   |   |-- ExpenseForm.js
|   |   |   |-- ExpenseList.js
|   |   |-- Incomes
|   |   |   |-- IncomeForm.js
|   |   |   |-- IncomeList.js
|   |-- /context
|   |   |-- AuthContext.js
|   |-- /services
|   |   |-- api.js
|   |-- /utils
|   |   |-- firebaseConfig.js
|   |-- App.js
|   |-- index.js
```

**Next Steps**:
1. **a.** Add unit tests to ensure the functionality of backend routes and controllers.
2. **b.** Implement better error handling and form validation on the frontend.