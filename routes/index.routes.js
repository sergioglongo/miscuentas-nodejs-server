import express from 'express';
import usersRouter from './users.routes.js';
import areaRouter from './area.routes.js';
import unitsRouter from './unit.routes.js';
import paramsRouter from './params.routes.js';
import categoryRouter from './category.routes.js';
import accountRouter from './accounts.route.js';
import payMethodRouter from './payMethod.routes.js';
import transactionsRouter from './transactions.routes.js';
import reportsRouter from './reports.route.js';
import transfersRouter from './transfer.route.js';

const mainRoute = express.Router();

mainRoute.use("/users", usersRouter);
mainRoute.use("/account", accountRouter);
mainRoute.use("/paymethod", payMethodRouter);
mainRoute.use("/unit", unitsRouter);
mainRoute.use("/area", areaRouter);
mainRoute.use("/category", categoryRouter);
mainRoute.use("/transaction", transactionsRouter);
mainRoute.use("/transfer", transfersRouter);
mainRoute.use("/reports", reportsRouter);
mainRoute.use("/params", paramsRouter);

export default mainRoute;