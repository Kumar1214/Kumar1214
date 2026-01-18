const fs = require('fs');
const path = require('path');

const sqlFilePath = path.join(__dirname, '../../gaugyanc_maindb.sql');
const outputDir = path.join(__dirname, '../data');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Helper to parse values from SQL INSERT statement
// Helper to parse values from SQL INSERT statement
const parseValues = (valuesStr) => {
    // This is a simplified parser for specific SQL dump format.
    // It assumes values are comma-separated and strings are single-quoted.
    // Complex nested quotes might need a full SQL parser library.
    const rows = [];
    if (!valuesStr) return rows;

    // Split by tuple separator "), ("
    const rawRows = valuesStr.split(/\),\s*\(/);

    for (const row of rawRows) {
        // Clean start/end and split
        const cleanRow = row.replace(/^\(/, '').replace(/\)$/, '');
        rows.push(cleanRow);
    }
    return rows;
};

// Function to extract table data
const extractTableData = (tableName, columns) => {
    const regex = new RegExp(`INSERT INTO \`${tableName}\` \\((.*?)\\) VALUES\\s*([\\s\\S]*?);`, 'g');
    let match;
    const allData = [];

    while ((match = regex.exec(sqlContent)) !== null) {
        // const cols = match[1].replace(/`/g, '').split(',').map(c => c.trim());
        // We assume columns match the provided list for simplicity in mapping
        const valuesBlock = match[2];

        // Simple regex split for values might fail on commas inside quotes, 
        // but for this specific dump format it might be consistent enough.
        // Let's try a simpler approach: split by "), ("

        const rows = valuesBlock.split(/\),\s*\(/);

        rows.forEach(row => {
            // Clean up start/end parens if present
            let cleanRow = row.replace(/^\(/, '').replace(/\)$/, '');

            // Split by comma, respecting quotes is hard with simple split.
            // Let's use a basic CSV-like parser logic or just regex for quoted strings
            // For this specific task, let's try to be robust enough.

            // Regex to match values: 'string' or number or NULL
            const valRegex = /'([^'\\]*(?:\\.[^'\\]*)*)'|NULL|(\d+(\.\d+)?)/g;
            let valMatch;
            const rowValues = [];

            while ((valMatch = valRegex.exec(cleanRow)) !== null) {
                if (valMatch[1] !== undefined) {
                    rowValues.push(valMatch[1]); // String
                } else if (valMatch[2] !== undefined) {
                    rowValues.push(Number(valMatch[2])); // Number
                } else {
                    rowValues.push(null); // NULL
                }
            }

            if (rowValues.length > 0) {
                const obj = {};
                columns.forEach((col, index) => {
                    obj[col] = rowValues[index];
                });
                allData.push(obj);
            }
        });
    }

    return allData;
};

// Define tables to extract
const tables = [
    { name: 'banner', columns: ['id', 'name', 'image', 'status', 'startFrom', 'createdAt'] },
    { name: 'category', columns: ['id', 'name', 'image', 'status', 'description', 'createdAt'] },
    { name: 'customer', columns: ['id', 'name', 'email', 'password', 'phone', 'status', 'role', 'createdAt', 'updatedAt'] }, // Assuming columns based on typical structure
    // Add more as needed
];

// Since I don't have the exact column order from CREATE TABLE in this script, 
// I need to rely on the INSERT statement column list if present, OR hardcode based on my previous file read.
// The SQL dump has: INSERT INTO `banner` (`banner_id`, `banner_name`, `image`, `status`, `banner_startfrom`, `created_at`)
// So the order is fixed.

const extractions = [
    {
        table: 'banner',
        file: 'banners.json',
        cols: ['banner_id', 'banner_name', 'image', 'status', 'banner_startfrom', 'created_at'],
        map: (d) => ({
            _id: d.banner_id.toString(),
            name: d.banner_name,
            image: `https://gaugyan.com/uploads/banner/${d.image}`, // Assuming path
            status: d.status,
            startFrom: d.banner_startfrom === '0000-00-00' ? null : d.banner_startfrom,
            createdAt: d.created_at
        })
    },
    {
        table: 'category',
        file: 'categories.json',
        cols: ['cat_id', 'cat_name', 'image', 'status', 'description', 'created_at'],
        map: (d) => ({
            _id: d.cat_id.toString(),
            name: d.cat_name,
            image: `https://gaugyan.com/uploads/category/${d.image}`,
            status: d.status,
            description: d.description.replace(/<[^>]*>?/gm, ''), // Strip HTML
            createdAt: d.created_at
        })
    },
    {
        table: 'customer',
        file: 'users.json',
        cols: ['cust_id', 'cust_first_name', 'cust_email', 'cust_password', 'cust_phone', 'contact_no_with_verify', 'cust_aadhar_no', 'cust_country', 'cust_state', 'cust_district_id', 'cust_taluka_id', 'cust_pincode', 'cust_address', 'cust_alter_phone', 'aadhar_link_mobile', 'cust_org_name', 'cust_org_type', 'cust_gst_no', 'confirm_password', 'cust_agreement_copy', 'cust_signature', 'cust_pan_card', 'cust_aadhar_card_back', 'cust_aadhar_card_front', 'cust_selfie', 'b_acc_screenshot', 'b_acc_name_of_link', 'cust_status', 'cust_desc', 'shop_act_licence', 'shop_act_licence_approvedby', 'food_licence', 'food_licence_approvedby', 'bank_acc_opening', 'bank_acc_opening_approvedby', 'demate_acc_opening', 'demate_acc_opening_approvedby', 'dmt_acc_screenshot', 'dmt_acc_name_of_link', 'itr', 'itr_bank_statement', 'salary_sheet', 'form16', 'itr_approvedby', 'bs', 'bs_approvedby', 'bs_bank_statemenet', 'proof_of_buiseness', 'user_updated_by', 'created_at'],
        map: (d) => ({
            _id: d.cust_id.toString(),
            firstName: d.cust_first_name,
            lastName: '', // No last name in this table
            email: d.cust_email,
            mobile: d.cust_phone,
            role: 'user', // Default role, might need to infer from other tables or flags
            status: d.cust_status === '1' ? 'active' : 'inactive',
            address: d.cust_address,
            country: d.cust_country,
            state: d.cust_state,
            pincode: d.cust_pincode,
            createdAt: d.created_at,
            profilePicture: d.cust_selfie ? `https://gaugyan.com/uploads/customer/${d.cust_selfie}` : ''
        })
    }
];

extractions.forEach(task => {
    console.log(`Extracting ${task.table}...`);
    // Custom extraction logic because the generic one above was a bit loose
    // Let's use the specific regex for the INSERT statement which includes column names

    const regex = new RegExp(`INSERT INTO \`${task.table}\` \\((.*?)\\) VALUES`, 'g');
    const match = regex.exec(sqlContent);

    if (match) {
        // Found the insert block start. Now find the values.
        // The values follow immediately.
        const startIndex = match.index + match[0].length;
        const endIndex = sqlContent.indexOf(';', startIndex);
        const valuesBlock = sqlContent.substring(startIndex, endIndex).trim();

        // Split by "), ("
        const rows = valuesBlock.split(/\),\s*\(/);

        const data = rows.map(row => {
            // Clean parens
            let clean = row.replace(/^\(/, '').replace(/\)$/, '');

            // Split by comma but respect quotes
            // This is a quick and dirty parser
            const vals = [];
            let current = '';
            let inQuote = false;

            for (let i = 0; i < clean.length; i++) {
                const char = clean[i];
                if (char === "'") {
                    inQuote = !inQuote;
                } else if (char === ',' && !inQuote) {
                    vals.push(current.trim().replace(/^'|'$/g, ''));
                    current = '';
                } else {
                    current += char;
                }
            }
            vals.push(current.trim().replace(/^'|'$/g, '')); // Last value

            // Map to object
            const rawObj = {};
            task.cols.forEach((col, i) => {
                rawObj[col] = vals[i];
            });

            return task.map(rawObj);
        });

        fs.writeFileSync(path.join(outputDir, task.file), JSON.stringify(data, null, 2));
        console.log(`Saved ${data.length} records to ${task.file}`);
    } else {
        console.log(`No data found for ${task.table}`);
    }
});
