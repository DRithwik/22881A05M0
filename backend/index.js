const express = require('express');;
const cDB = require('./configs/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
cDB();

app.use(cors());

app.use(express.json());

app.use('/shortUrls', require('./routes/urlR'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));