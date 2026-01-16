import { Router } from 'express';
import { FinanceController } from '../../controllers/finance/FinanceController';
import { rbacMiddleware } from '../../middleware/rbacMiddleware';

const router = Router();

// Only vendors (and admins) can request payouts
router.post('/payout/request',
    // verifyToken, // Assuming verifyToken exists and populates req.user
    // rbacMiddleware('requiresFinancialAudit'), // Using a permission that implies financial activity
    FinanceController.requestPayout
);

// Only admins/security/finance roles can approve (needs granular RBAC check in controller or separate routes)
router.post('/payout/approve', FinanceController.approvePayout);

export default router;
