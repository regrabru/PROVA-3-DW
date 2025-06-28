import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import Reserva from './models/Reserva';
import reservaRoutes from './routes/reservas';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para ler dados de formulários

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Conexão com MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/reserva')
  .then(() => console.log('✅ Conectado ao MongoDB (banco: reserva)'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

// Usar as rotas de API JSON
app.use('/reservas', reservaRoutes);

// Rota web principal - lista as reservas
app.get('/', async (req, res) => {
  const reservas = await Reserva.find();
  res.render('index', { reservas });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
