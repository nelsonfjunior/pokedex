import { Router } from 'express';
import { findAll, findByName, generateAIDescription, updateDescription,  } from '../controllers/pokemonController';

const router = Router();

router.get('/search', findByName);
router.get('/', findAll);
router.post('/generate-description/:id', generateAIDescription);

router.patch('/:id', updateDescription);

export default router;