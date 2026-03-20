import { Router } from 'express';
import adminController from '../controllers/adminController.js';
import verifyJWT from '../middleware/auth.js';

const router = Router();

router.use(verifyJWT);
router.get('/agenda', adminController.obtenerAgenda);
router.get('/turnos', adminController.listarTurnos);
router.patch('/turnos/:id', adminController.actualizarTurno);
router.get('/clientes', adminController.listarClientes);
router.get('/clientes/:id', adminController.obtenerCliente);
router.get('/servicios', adminController.listarServiciosAdmin);
router.post('/servicios', adminController.crearServicio);
router.patch('/servicios/:id', adminController.actualizarServicio);
router.delete('/servicios/:id', adminController.eliminarServicio);
router.get('/config', adminController.obtenerConfig);
router.patch('/config', adminController.actualizarConfig);

export default router;
