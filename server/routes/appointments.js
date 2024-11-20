import express from 'express';
import Appointment from '../models/Appointment.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error creating appointment' });
  }
});

router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

router.get('/filter', async (req, res) => {
  try {
    const { startDate, endDate, service, name } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (service) {
      query.service = new RegExp(service, 'i');
    }
    if (name) {
      query.name = new RegExp(name, 'i');
    }

    const appointments = await Appointment.find(query).sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error filtering appointments' });
  }
});

export default router;