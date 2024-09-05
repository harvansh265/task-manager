const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
path = require('path');
const bodyParser = require('body-parser');
const { mongoURI } = require('./config');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');

const app = express();

let corsOptions = { origin : ['http://localhost:4200'], }

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './dist/')));
app.use('/', express.static(path.join(__dirname, './dist/task-manager/browser/')));


// Database Connection
mongoose.connect(mongoURI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes

app.use('/auth', authRoutes);
app.use('/task', taskRoutes);

app.get('*',(req,res) =>{
  res.sendFile(path.join(__dirname, './dist/task-manager/browser/index.html'));
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
