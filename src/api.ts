import express from 'express';
import cors from 'cors';
import userModel from '../models/user';
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://christ1913:pinguino27@cluster0.gvxd2gm.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('Error al conectar a la base de datos', error);
    process.exit(1); 
  }
};

connectDB()

export const app = express();

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

// Healthcheck endpoint
app.get('/', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

app.post('/students', (req, res) => {
  const { name, lineCount } = req.body;
  try {
    const newUser = new userModel({
      name,
      lineCount,
    });
    newUser.save();
  } catch (error) {
    console.log(error)
  }
})

app.patch('/studentsUpdate/:userId', async (req, res) => {
  const { userId } = req.params;
  const { lineCount } = req.body;
  try {
    const student = await userModel.findByIdAndUpdate(userId, { lineCount }, { new: true });
    res.json(student);
  } catch (err) {
    res.status(500).json({ err: 'Error al actualizar el usuario' });
  }
})

const api = express.Router();

api.get('/hello', (req, res) => {
  res.status(200).send({ message: 'hello world' });
});

// Version the api
app.use('/api/v1', api);