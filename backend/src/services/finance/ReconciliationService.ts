import { PayoutWorkflow, IPayoutRequest, PayoutStatus } from './PayoutWorkflow'; // Assuming in same dir for now or properly imported

export interface IOrder {
    id: string;
    amount: number;
    status: string;
    gatewayTransactionId: string;
}

export interface IGatewayRecord {
    transactionId: string;
    amount: number;
    status: string; // 'CAPTURED', 'FAILED'
    bankReferenceId: string;
}

export interface IBankStatement {
    referenceId: string;
    amount: number;
    status: string; // 'CREDITED'
}

export class ReconciliationService {
    /**
     * Performs a Three-Way Match: Order -> Gateway -> Bank
     */
    static async reconcile(order: IOrder, gateway: IGatewayRecord, bank: IBankStatement): Promise<boolean> {
        const isOrderGatewayMatch =
            order.amount === gateway.amount &&
            order.gatewayTransactionId === gateway.transactionId &&
            gateway.status === 'CAPTURED';

        const isGatewayBankMatch =
            gateway.amount === bank.amount &&
            gateway.bankReferenceId === bank.referenceId &&
            bank.status === 'CREDITED';

        if (isOrderGatewayMatch && isGatewayBankMatch) {
            console.log(`[Reconciliation] Three-Way Match SUCCESS for Order ${order.id}`);
            return true;
        } else {
            console.error(`[Reconciliation] FAILED for Order ${order.id}. Mismatch detected.`);
            // In a real system, trigger an alert to FinOps
            return false;
        }
    }

    /**
     * Automated Reconciliation Job
     */
    static async runBatchReconciliation(orders: IOrder[], gatewayRecords: IGatewayRecord[], bankStatements: IBankStatement[]) {
        const results = {
            matched: 0,
            mismatched: 0
        };

        for (const order of orders) {
            const gateway = gatewayRecords.find(g => g.transactionId === order.gatewayTransactionId);
            const bank = gateway ? bankStatements.find(b => b.referenceId === gateway.bankReferenceId) : null;

            if (gateway && bank) {
                const success = await this.reconcile(order, gateway, bank);
                success ? results.matched++ : results.mismatched++;
            } else {
                results.mismatched++;
                console.warn(`[Reconciliation] Missing records for Order ${order.id}`);
            }
        }
        return results;
    }
}
