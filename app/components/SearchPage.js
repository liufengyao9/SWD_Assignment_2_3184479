'use client'

import Link from "next/link";
import { useState } from "react";
import styles from "../part-b-c/style.module.css";

export default function SearchPage() {

    const [serialNumber, setSerialNumber] = useState("");
    const [serialError, setSerialError] = useState(""); // found appliance data
    const [message, setMessage] = useState(null); // error text
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage(null);
        setResult(null);
        setSerialError(null);

        const res = await fetch(`/api/appliance?serial=${serialNumber}`);
        const data = await res.json();

        if (data.success) {
            setResult(data.data)
        } else {
            setMessage(data.message || "No matching appliance.")
        }
    };

    return (
        <div className={styles.page}>
            <h1>Search Appliance</h1>
            <p>Enter a serial number to find appliance details</p>

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
                    {serialError && <span className="error-text">{serialError}</span>}
                </div>

                <div>
                    <button type="submit">
                        Search
                    </button>
                    <Link href="/">Back to Home</Link>
                </div>
            </form>

            {/*Not found message*/}
            {message && (
                <div>
                    <strong>{message}</strong>
                    <div>
                        <Link href="/">Return to Homepage</Link>
                    </div>
                </div>
            )}

            {/* Found appliance and user data */}
            {result && (
                <div>
                    <strong>Appliance Found</strong>

                    <div>User Details</div>
                    <table>
                        <tbody>
                            <tr><th>User ID</th><td>{result.UserID}</td></tr>
                            <tr><th>First Name</th><td>{result.FirstName}</td></tr>
                            <tr><th>Last Name</th><td>{result.LastName}</td></tr>
                            <tr><th>Address</th><td>{result.Address}</td></tr>
                            <tr><th>Mobile</th><td>{result.Mobile}</td></tr>
                            <tr><th>Email</th><td>{result.Email}</td></tr>
                            <tr><th>Eircode</th><td>{result.Eircode}</td></tr>
                        </tbody>
                    </table>

                    <div>Appliance Details</div>
                    <table>
                        <tbody>
                            <tr><th>Appliance ID</th><td>{result.ApplianceID}</td></tr>
                            <tr><th>Type</th><td>{result.ApplianceType}</td></tr>
                            <tr><th>Brand</th><td>{result.Brand}</td></tr>
                            <tr><th>Model Number</th><td>{result.ModelNumber}</td></tr>
                            <tr><th>Serial Number</th><td>{result.SerialNumber}</td></tr>
                            <tr><th>Purchase Date</th><td>{result.PurchaseDate?.slice(0, 10)}</td></tr>
                            <tr><th>Warranty Expiry</th><td>{result.WarrantyExpirationDate?.slice(0, 10)}</td></tr>
                            <tr><th>Cost</th><td>{result?.Cost ? `EUR ${parseFloat(result.Cost).toFixed(2)}` : 'N/A'}</td></tr>
                        </tbody>
                    </table>

                    <div>
                        <Link href="/">Return to Homepage</Link>
                    </div>
                </div>
            )}
        </div>
    );
}
