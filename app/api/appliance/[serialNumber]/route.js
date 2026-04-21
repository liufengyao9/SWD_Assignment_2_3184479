import pool from '../../../part-b-c/lib/db';

// Delete
// The "params" parameter needs to be obtained through the second parameter "context".
export async function DELETE(requset, { params }) {
    const { serialNumber } = await params;

    const conn = await pool.getConnection();
    try {
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

    } finally {
        conn.release();
    }
}

// PUT