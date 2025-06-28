import { Router, Request, Response } from 'express';
import Reserva from '../models/Reserva';

const router = Router();

// Criar uma nova reserva
// Criar uma nova reserva
router.post('/', async (req: Request, res: Response) => {
  try {
    const reserva = new Reserva(req.body);
    await reserva.save();

    // Detecta se é form HTML (tem header urlencoded)
    if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      return res.redirect('/');
    }

    res.status(201).json({ message: 'Reserva criada com sucesso', reserva });
  } catch (error) {
    console.error('Erro ao criar reserva:', error);

    if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      return res.status(400).send('<h1>Erro ao criar reserva</h1><a href="/">Voltar</a>');
    }

    res.status(400).json({ message: 'Erro ao criar reserva', error });
  }
});


// Listar todas as reservas, opcionalmente filtrando por cliente ou mesa
router.get('/', async (req: Request, res: Response) => {
  try {
    const { nomeCliente, numeroMesa } = req.query;
    const filtro: any = {};

    if (nomeCliente) filtro.nomeCliente = nomeCliente;
    if (numeroMesa) filtro.numeroMesa = Number(numeroMesa);

    const reservas = await Reserva.find(filtro);
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar reservas', error });
  }
});
import path from 'path';

// Form para editar reserva
router.get('/:id/editar', async (req: Request, res: Response) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva) return res.status(404).send('Reserva não encontrada');
    res.render('editar', { reserva });
  } catch (error) {
    res.status(500).send('Erro ao carregar edição');
  }
});

// Salva edição
router.post('/:id/editar', async (req: Request, res: Response) => {
  try {
    if (req.body.dataHoraReserva) {
      req.body.dataHoraReserva = new Date(req.body.dataHoraReserva);
    }
    await Reserva.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/');
  } catch (error) {
    res.status(400).send('Erro ao atualizar reserva');
  }
});

// Excluir reserva
router.get('/:id/excluir', async (req: Request, res: Response) => {
  try {
    await Reserva.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (error) {
    res.status(400).send('Erro ao excluir reserva');
  }
});

// Atualizar uma reserva
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const reserva = await Reserva.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reserva) return res.status(404).json({ message: 'Reserva não encontrada' });
    res.json({ message: 'Reserva atualizada', reserva });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar reserva', error });
  }
});

// Excluir uma reserva
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const reserva = await Reserva.findByIdAndDelete(req.params.id);
    if (!reserva) return res.status(404).json({ message: 'Reserva não encontrada' });
    res.json({ message: 'Reserva removida' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao excluir reserva', error });
  }
});

export default router;
