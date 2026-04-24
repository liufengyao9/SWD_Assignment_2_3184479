import pool from '../../../part-b-c/lib/db';

//Sanitize
function sanitize(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

//Validation for update (same logic with add)
function validateUpdate(u, a) {
    const errors = {};

    const nameRegex = /^[A-Za-z\s\-]{1,50}$/;
    const addressRegex = /^[A-Za-z0-9\s,.\-]{5,255}$/;
    const mobileRegex = /^(\+353|0)[0-9]{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const eircodeRegex = /^[A-Z0-9]{3}\s[A-Z0-9]{4}$/;
    const brandRegex = /^[A-Za-z0-9\s\-]{1,50}$/;
    const modelRegex = /^[A-Za-z0-9\-]{4,20}$/;
    const costRegex = /^\d+(\.\d{1,2})?$/;

    if (!nameRegex.test(u.FirstName)) {
        errors.FirstName = 'First name: letters only, max 50 chars.';
    }
    if (!nameRegex.test(u.LastName)) {
        errors.LastName = 'Last name: letters only, max 50 chars.';
    }
    if (!addressRegex.test(u.Address)) {
        errors.Address = 'Address: 5–255 alphanumeric characters.';
    }
    if (!mobileRegex.test(u.Mobile)) {
        errors.Mobile = 'Mobile: e.g. 0831234567 or +353831234567.';
    }
    if (!emailRegex.test(u.Email)) {
        errors.Email = 'Please enter a valid email address.';
    }
    if (!eircodeRegex.test(u.Eircode)) {
        errors.Eircode = 'Eircode format: e.g. D01 A1B2.';
    }
    if (!brandRegex.test(a.Brand)) {
        errors.Brand = 'Brand: alphanumeric, max 50 chars.';
    }
    if (!modelRegex.test(a.ModelNumber)) {
        errors.ModelNumber = 'Model number: 4–20 alphanumeric chars.';
    }
    if (!a.PurchaseDate) {
        errors.PurchaseDate = 'Purchase date is required.';
    }
    if (!a.WarrantyExpirationDate) {
        errors.WarrantyExpirationDate = 'Warranty date is required.';
    }
    else if (a.WarrantyExpirationDate <= a.PurchaseDate) {
        errors.WarrantyExpirationDate = 'Warranty must be after purchase date.';
    }
    if (!costRegex.test(String(a.Cost)) || parseFloat(a.Cost) <= 0) {
        errors.Cost = 'Cost must be a positive number (e.g. 299.99).';
    }

    return errors;
}

// PUT: Update user details and appliance by serial number, 
// Serial number, UserID, ApplianceID cannot be change.
export async function PUT(request, { params }) {
    let conn;
    try {
        const { serialNumber } = await params;
        const body = await request.json();

        const userData = {
            FirstName: sanitize(body.FirstName),
            LastName: sanitize(body.LastName),
            Address: sanitize(body.Address),
            Mobile: sanitize(body.Mobile),
            Email: sanitize(body.Email),
            Eircode: sanitize(body.Eircode),
        };

        const appData = {
            ApplianceType: sanitize(body.ApplianceType),
            Brand: sanitize(body.Brand),
            ModelNumber: sanitize(body.ModelNumber),
            PurchaseDate: body.PurchaseDate,
            WarrantyExpirationDate: body.WarrantyExpirationDate,
            Cost: body.Cost,
        };

        const errors = validateUpdate(userData, appData);
        if (Object.keys(errors).length > 0) {
            return Response.json({ success: false, errors }, { status: 400 });
        }

        conn = await pool.getConnection();

        // Find the appliance by serial number
        const [rows] = await conn.execute(
            'SELECT ApplianceID, UserID FROM Appliance WHERE SerialNumber = ?',
            [serialNumber]
        );

        if (rows.length === 0) {
            return Response.json({ success: false, message: 'Appliance not found.' }, { status: 404 });
        }

        const { ApplianceID, UserID } = rows[0];

        // Update User table (exclude UserID)
        await conn.execute(
            `UPDATE User SET FirstName=?, LastName=?, Address=?, Mobile=?, Email=?, Eircode=?
             WHERE UserID=?`,
            [userData.FirstName, userData.LastName, userData.Address,
            userData.Mobile, userData.Email, userData.Eircode, UserID]
        );

        // Update Appliance table (exclude serialNumber)
        await conn.execute(
            `UPDATE Appliance SET ApplianceType=?, Brand=?, ModelNumber=?,
             PurchaseDate=?, WarrantyExpirationDate=?, Cost=?
             WHERE ApplianceID=?`,
            [appData.ApplianceType, appData.Brand, appData.ModelNumber,
            appData.PurchaseDate, appData.WarrantyExpirationDate, appData.Cost, ApplianceID]
        );

        return Response.json({ success: true, message: 'Appliance has been updated.' }, { status: 200 });

    } catch (error) {
        console.error('PUT /api/appliance/[serialNumber] failed:', error);
        return Response.json(
            { success: false, message: 'Database connection failed. Please check your MySQL server and DB settings.' },
            { status: 503 }
        );
    } finally {
        if (conn) conn.release();
    }
}

// Delete
// The "params" parameter needs to be obtained through the second parameter "context".
export async function DELETE(requset, { params }) {
    let conn;
    try {
        const { serialNumber } = await params;

        conn = await pool.getConnection();

        const [rows] = await conn.execute(
            'SELECT ApplianceID FROM Appliance WHERE SerialNumber = ?',
            [serialNumber]
        );

        if (rows.length === 0) {
            return Response.json({ success: false, message: 'Appliance not found.' }, { status: 404 });
        }

        // Delete appliance (ON DELETE CASCADE only removes appliances!!!)
        await conn.execute('DELETE FROM Appliance WHERE SerialNumber = ?', [serialNumber]);

        return Response.json({ success: true, message: 'Appliance Deleted.' }, { status: 200 });

    } catch (error) {
        console.error('DELETE /api/appliance/[serialNumber] failed:', error);
        return Response.json(
            { success: false, message: 'Database connection failed. Please check your MySQL server and DB settings.' },
            { status: 503 }
        );
    } finally {
        if (conn) conn.release();
    }
}
