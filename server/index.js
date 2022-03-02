const connectToMongodb=require('./db');
const express = require('express')

connectToMongodb();

const app = express()
const port = 5000;
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello  PJ  ! ')
})
// Routes

app.use('/api/userauth', require('./routes/users'));
app.use('/api/notes', require('./routes/notes'));
app.listen(port, () => {
  console.log(`myNotes app listening on port ${port}`)
})