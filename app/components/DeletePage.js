'use client'

import { useState } from "react";
import Link from "next/link";
import styles from "../part-b-c/style.module.css";

// First get the information of the appliance that need to be deleted, then confirm.
export default function DeletePage() {

    const [serialNumber, setSerialNumber] = useState('');
    const [serialError, setSerialError] = useState('');
    const [appliance, setAppliance] = useState(null); // data to confirm before delete
    const [message, setMessage] = useState(null);

    // Same logic with Search(GET)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setAppliance(null);
        setMessage(null);
        setSerialError('');

        const res = await fetch(`/api/appliance?serial=${serialNumber}`);
        const data = await res.json();

        if (data.success) {
            setAppliance(data.data);
        } else {
            setSerialError(data.message || 'No matching appliance found!');
        }
    };

    const handleConfirmDelete = async () => {

        // SerialNumber is passed as a parameter to DELETE function in backend, so we
        // don't need body here.
        const res = await fetch(`/api/appliance/${serialNumber}`,
            { method: 'DELETE' });
        const data = await res.json();

        setAppliance(null);
        setMessage({
            type: data.success ? 'success' : 'error',
            text: data.message || (data.success ? 'Appliance Deleted.' : 'Delete failed.'),
        });
        if (data.success) {
            setSerialNumber('');
        }
    };

    return (
        <div className={styles.page}>
            <h1>Delete Appliance</h1>
            <p>Enter the serial number to find and remove an appliance</p>

            {/*Enter serial number*/}
            {!appliance && !message && (
                <form onSubmit={handleSubmit}>

                    <div>
                        <label>Serial Number (12 digits)</label>
                        <input
                            id="serial"
                            type="text"
                            placeholder="e.g. 123456789012"
                            value={serialNumber}
                            onChange={e => setSerialNumber(e.target.value)}
                        />
                        {serialError && <span>{serialError}</span>}
                    </div>

                    <div>
                        <button type="submit">
                            Find Appliance
                        </button>
                        <Link href="/">Back to Home</Link>
                    </div>
                </form>
            )}

            {/*Confirm deletion*/}
            {appliance && (
                <div>
                    <strong>Please confirm deletion of the following appliance:</strong>

                    <div>User</div>
                    <table>
                        <tbody>
                            <tr><th>Name</th><td>{appliance.FirstName} {appliance.LastName}</td></tr>
                            <tr><th>Email</th><td>{appliance.Email}</td></tr>
                            <tr><th>Mobile</th><td>{appliance.Mobile}</td></tr>
                        </tbody>
                    </table>

                    <div>Appliance</div>
                    <table>
                        <tbody>
                            <tr><th>Type</th><td>{appliance.ApplianceType}</td></tr>
                            <tr><th>Brand</th><td>{appliance.Brand}</td></tr>
                            <tr><th>Model Number</th><td>{appliance.ModelNumber}</td></tr>
                            <tr><th>Serial Number</th><td>{appliance.SerialNumber}</td></tr>
                            <tr><th>Cost</th><td>{appliance?.Cost ? `EUR ${parseFloat(appliance.Cost).toFixed(2)}` : 'N/A'}</td></tr>
                        </tbody>
                    </table>

                    <div>
                        <button onClick={handleConfirmDelete}>
                            Delete
                        </button>
                        <button onClick={() => setAppliance(null)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/*Result*/}
            {message && (
                <div>
                    <strong>{message.text}</strong>
                    <div>
                        <Link href="/">Return to Homepage</Link>
                    </div>
                </div>
            )}
        </div>
    );
}
