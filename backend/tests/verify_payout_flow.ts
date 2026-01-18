
// Force SQLite for local testing
process.env.DB_DIALECT = 'sqlite';
process.env.DB_NAME = 'test_finance_db';

async function runTest() {
    console.log('--- STARTING FINANCE FLOW VERIFICATION (LOCAL SQLITE) ---');

    try {
        // Dynamic imports to ensure env vars are set BEFORE modules load
        const { FinanceController } = await import('../src/controllers/finance/FinanceController.js');
        // @ts-ignore
        const { sequelize } = await import('../src/shared/config/database.js');
        // @ts-ignore
        const Payout = (await import('../src/modules/finance/Payout.js')).default;
        // @ts-ignore
        const Wallet = (await import('../src/modules/finance/Wallet.js')).default;

        // 1. Initialize DB
        await sequelize.authenticate();
        await sequelize.sync({ force: true }); // Fresh DB
        console.log('✅ Database Synced');

        // 2. Create Vendor and Wallet
        const vendorId = 'VEN-TEST-001';
        const initialBalance = 10000;
        await Wallet.create({
            vendorId,
            balance: initialBalance
        });
        console.log(`✅ Wallet Created for ${vendorId} with balance ${initialBalance}`);

        // 3. Request Payout
        console.log('👉 Step 1: Requesting Payout...');
        const req1: any = {
            body: { vendorId, amount: 5000 }
        };
        const res1: any = {
            json: (data: any) => {
                console.log('   Response:', data.message);
                return data;
            },
            status: (code: number) => ({ json: (data: any) => console.error('   Error:', data) })
        };

        // Capture the payout ID from the response mock
        let payoutId = '';
        const originalJson = res1.json;
        res1.json = (data: any) => {
            payoutId = data.data.id;
            originalJson(data);
        };

        await FinanceController.requestPayout(req1, res1);

        if (!payoutId) throw new Error('Payout ID not returned');
        console.log(`✅ Payout Requested. ID: ${payoutId}`);

        // 4. Approve Payout Chain
        const roles = ['SECURITY', 'FINANCE', 'ADMIN'];

        for (const role of roles) {
            console.log(`👉 Step 2: Approving as ${role}...`);
            const reqApprove: any = {
                body: { payoutId, role }
            };
            await FinanceController.approvePayout(reqApprove, res1);
        }

        // 5. Verify Final State
        console.log('👉 Step 3: Verifying Final State...');
        const payoutFinal = await Payout.findByPk(payoutId);
        const walletFinal = await Wallet.findOne({ where: { vendorId } });

        if (!payoutFinal || !walletFinal) {
            console.error('❌ FAILURE: Payout or Wallet not found.');
            process.exit(1);
        }

        const payoutData = payoutFinal.get({ plain: true }) as any;
        const walletData = walletFinal.get({ plain: true }) as any;

        console.log('   Payout Status:', payoutData.status);
        console.log('   Wallet Balance:', walletData.balance);
        console.log('   Audit Log:', JSON.stringify(payoutData.auditLog, null, 2));

        if (payoutData.status === 'READY_FOR_PAYOUT' && Number(walletData.balance) === 5000) {
            console.log('🏆 SUCCESS: Payout processed and Wallet deducted correctly!');
        } else {
            console.error('❌ FAILURE: State mismatch.');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ FATAL ERROR:', error);
        process.exit(1);
    }
}

runTest();
