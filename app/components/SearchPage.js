'use client'

import Link from "next/link";
import { useState } from "react";
import styles from "../part-b-c/style.module.css";

export default function SearchPage() {
    const APPLIANCE_TYPES = [
        'Fridge', 'Washing Machine', 'Dryer', 'Dishwasher', 'Oven',
        'Microwave', 'Television', 'Air Conditioner', 'Vacuum Cleaner', 'Other'
    ];

    const [serialNumber, setSerialNumber] = useState("");
    const [applianceType, setApplianceType] = useState("");
    const [brand, setBrand] = useState("");
    const [modelNumber, setModelNumber] = useState("");
    const [serialError, setSerialError] = useState(""); // validation or search message
    const [message, setMessage] = useState(null); // error text
    const [results, setResults] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage(null);
        setResults([]);
        setSerialError("");

        if (!serialNumber && !applianceType && !brand && !modelNumber) {
            setSerialError("Please enter at least one search criteria.");
            return;
        }

        const params = new URLSearchParams();
        if (serialNumber) params.set('serial', serialNumber);
        if (applianceType) params.set('applianceType', applianceType);
        if (brand) params.set('brand', brand);
        if (modelNumber) params.set('modelNumber', modelNumber);

        const res = await fetch(`/api/appliance?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
            setResults(data.data);
        } else {
            setMessage(data.message || "No matching appliance.");
        }
    };

    return (
        <div className={styles.page}>
            <h1>Search Appliance</h1>
            <p>Search by serial number, appliance type, brand, or model number</p>

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
                </div>

                <div>
                    <label>Appliance Type</label>
                    <select
                        value={applianceType}
                        onChange={e => setApplianceType(e.target.value)}
                    >
                        <option value="">Any type</option>
                        {APPLIANCE_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Brand</label>
                    <input
                        type="text"
                        placeholder="e.g. Samsung"
                        value={brand}
                        onChange={e => setBrand(e.target.value)}
                    />
                </div>

                <div>
                    <label>Model Number</label>
                    <input
                        type="text"
                        placeholder="e.g. WF45R6100AW"
                        value={modelNumber}
                        onChange={e => setModelNumber(e.target.value)}
                    />
                </div>

                {serialError && <span>{serialError}</span>}

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
            {results.length > 0 && (
                <div>
                    <strong>{results.length} appliance{results.length > 1 ? 's' : ''} found</strong>

                    {results.map((result) => (
                        <div key={result.ApplianceID}>
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
                        </div>
                    ))}

                    <div>
                        <Link href="/">Return to Homepage</Link>
                    </div>
                </div>
            )}
        </div>
    );
}
