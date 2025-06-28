import { Schema, model } from 'mongoose';

const reservaSchema = new Schema({
  nomeCliente: {
    type: String,
    required: true
  },
  numeroMesa: {
    type: Number,
    required: true
  },
  dataHoraReserva: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['reservado', 'ocupado', 'disponível'],
    default: 'reservado'
  },
  contatoCliente: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default model('Reserva', reservaSchema);
