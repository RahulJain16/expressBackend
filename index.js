import express from "express";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Authentication midvdfgedfgdleware (for testing)
app.use('/api', (req, res, next) => {
    console.log('API route accessed');
    next();
});

// In-memory user storage
const users = new Map();

// Generate unique user ID
const generateUserId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

let port = 3000;

// Basic route
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Create a new user
app.post("/api/users", (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ 
            error: 'Name and email are required' 
        });
    }


    //return 400 if user already exists fgrg

    //svbgosuvgooovbb
    const userId = generateUserId();
    const user = {
        id: userId,
        name,
        email,
        createdAt: new Date().toISOString()
    };

    users.set(userId, user);
    
    res.status(200).json({
        message: "User created successfully",
        user
    });
});

// Get all users
app.get("/api/users", (req, res) => {
    const allUsers = Array.from(users.values());
    res.json({
        message: "All users retrieved successfully",
        users: allUsers
    });
});

// Get a specific user
app.get("/api/users/:id", (req, res) => {
    const userId = req.params.id;
    const user = users.get(userId);

    if (!user) {
        return res.status(404).json({
            error: 'User not found'
        });
    }

    res.json({
        message: "User retrieved successfully",
        user
    });
});

// Delete a user
app.delete("/api/users/:id", (req, res) => {
    const userId = req.params.id;
    
    if (!users.has(userId)) {
        return res.status(404).json({
            error: 'User not found'
        });
    }

    const deletedUser = users.get(userId);
    users.delete(userId);

    res.json({
        message: "User deleted successfully",
        deletedUser
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});