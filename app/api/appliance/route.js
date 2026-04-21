import pool from '../../part-b-c/lib/db';

// Sanitize: prevent XSS
function sanitize(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Validation: built up errors object that will send back to frontend.
function validateAll(u, a) {
    const errors = {};

    // First/Last Name
    const nameRegex = /^[A-Za-z\s\-]{1,50}$/;
    if (!nameRegex.test(u.FirstName)) errors.FirstName = 'First name: letters only, max 50 chars.';
    if (!nameRegex.test(u.LastName)) errors.LastName = 'Last name: letters only, max 50 chars.';

    // Address
    const addressRegex = /^[A-Za-z0-9\s,.\-]{5,255}$/;
    if (!addressRegex.test(u.Address)) errors.Address = 'Address must be 5–255 alphanumeric characters.';

    // Mobile
    const mobileRegex = /^(\+353|0)[0-9]{9}$/;
    if (!mobileRegex.test(u.Mobile)) errors.Mobile = 'Mobile: Irish format, e.g. 0831234567 or +353831234567.';

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(u.Email)) errors.Email = 'Please enter a valid email address.';

    // Eircode
    const eircodeRegex = /^[A-Z0-9]{3}\s[A-Z0-9]{4}$/;
    if (!eircodeRegex.test(u.Eircode)) errors.Eircode = 'Eircode format: e.g. D01 A1B2.';

    // Appliance Type
    const typeRegex = /^[A-Za-z\s]{2,50}$/;
    if (!typeRegex.test(a.ApplianceType)) errors.ApplianceType = 'Appliance type is required.';

    // Brand
    const brandRegex = /^[A-Za-z0-9\s\-]{1,50}$/;
    if (!brandRegex.test(a.Brand)) errors.Brand = 'Brand: alphanumeric, max 50 chars.';

    // Model Number
    const modelRegex = /^[A-Za-z0-9\-]{4,20}$/;
    if (!modelRegex.test(a.ModelNumber)) errors.ModelNumber = 'Model number: 4–20 alphanumeric chars.';

    // Serial Number
    const serialRegex = /^\d{12}$/;
    if (!serialRegex.test(a.SerialNumber)) errors.SerialNumber = 'Serial number must be exactly 12 digits.';

    // Purchase Date
    if (!a.PurchaseDate) errors.PurchaseDate = 'Purchase date is required.';

    // Warranty date must be after purchase date
    if (!a.WarrantyExpirationDate) {
        errors.WarrantyExpirationDate = 'Warranty expiration date is required.';
    } else if (a.WarrantyExpirationDate <= a.PurchaseDate) {
        errors.WarrantyExpirationDate = 'Warranty expiration must be after purchase date.';
    }

    // Cost
    const costRegex = /^\d+(\.\d{1,2})?$/;
    if (!costRegex.test(String(a.Cost)) || parseFloat(a.Cost) <= 0) {
        errors.Cost = 'Cost must be a positive number (e.g. 299.99).';
    }

    return errors;
}

// POST
export async function POST(request) {
    const body = await request.json();

    // Sanitize user fields
    const userData = {
        FirstName: sanitize(body.FirstName),
        LastName: sanitize(body.LastName),
        Address: sanitize(body.Address),
        Mobile: sanitize(body.Mobile),
        Email: sanitize(body.Email),
        Eircode: sanitize(body.Eircode),
    };

    // Sanitize appliance fields
    const appData = {
        ApplianceType: sanitize(body.ApplianceType),
        Brand: sanitize(body.Brand),
        ModelNumber: sanitize(body.ModelNumber),
        SerialNumber: sanitize(body.SerialNumber),
        PurchaseDate: body.PurchaseDate,
        WarrantyExpirationDate: body.WarrantyExpirationDate,
        Cost: body.Cost,
    };

    // Validate all fields
    const errors = validateAll(userData, appData);
    if (Object.keys(errors).length > 0) {
        return Response.json({ success: false, errors }, { status: 400 });
    }

    const conn = await pool.getConnection();
    try {
        // Check if serial number already exists
        const [existing] = await conn.execute(
            'SELECT ApplianceID FROM Appliance WHERE SerialNumber = ?',
            [appData.SerialNumber]
        );
        if (existing.length > 0) {
            return Response.json({ success: false, message: 'Appliance already exists.' }, { status: 409 });
        }

        // Check if user with this email already exists; if not, create them
        const [users] = await conn.execute(
            'SELECT UserID FROM User WHERE Email = ?',
            [userData.Email]
        );

        let userID;
        if (users.length > 0) {
            // If userID already exist, reuse it.
            userID = users[0].UserID;
        } else {
            // Insert new user
            const [result] = await conn.execute(
                `INSERT INTO User (FirstName, LastName, Address, Mobile, Email, Eircode)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [userData.FirstName, userData.LastName, userData.Address,
                userData.Mobile, userData.Email, userData.Eircode]
            );
            userID = result.insertId;
        }

        // Insert appliance linked to userID
        await conn.execute(
            `INSERT INTO Appliance (UserID, ApplianceType, Brand, ModelNumber, SerialNumber,
             PurchaseDate, WarrantyExpirationDate, Cost)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userID, appData.ApplianceType, appData.Brand, appData.ModelNumber,
                appData.SerialNumber, appData.PurchaseDate, appData.WarrantyExpirationDate, appData.Cost]
        );

        return Response.json({ success: true, message: 'New appliance added successfully.' }, { status: 201 });

    } finally {
        conn.release(); // Release connection back to pool
    }
}

// GET
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const serial = searchParams.get('serial');

    // Validate serial number format before querying
    const serialRegex = /^\d{12}$/;
    if (!serial || !serialRegex.test(serial)) {
        return Response.json({ success: false, message: 'Serial number must be 12 digits.' }, { status: 400 });
    }

    const conn = await pool.getConnection();
    try {
        // JOIN User and Appliance tables to get full record
        const [rows] = await conn.execute(
            `SELECT u.UserID, u.FirstName, u.LastName, u.Address, u.Mobile, u.Email, u.Eircode,
                    a.ApplianceID, a.ApplianceType, a.Brand, a.ModelNumber, a.SerialNumber,
                    a.PurchaseDate, a.WarrantyExpirationDate, a.Cost
             FROM Appliance a
             JOIN User u ON a.UserID = u.UserID
             WHERE a.SerialNumber = ?`,
            [serial]
        );

        // No match
        if (rows.length === 0) {
            return Response.json({ success: false, message: 'No matching appliance found!' }, { status: 404 });
        }

        return Response.json({ success: true, data: rows[0] }, { status: 200 });

    } finally {
        conn.release();
    }
}
