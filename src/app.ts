import express from 'express';
import purchaseRoutes from './routes/purchaseRoutes';
import eventRoutes from './routes/eventRoutes';
import statsRoutes from './routes/statsRoutes';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(express.json());
app.use(requestLogger);

app.use('/event', eventRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/stats', statsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));