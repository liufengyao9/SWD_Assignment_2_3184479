'use client'

import { useState } from 'react';
import Link from 'next/link';

const APPLIANCE_TYPES = [
    'Fridge', 'Washing Machine', 'Dryer', 'Dishwasher', 'Oven',
    'Microwave', 'Television', 'Air Conditioner', 'Vacuum Cleaner', 'Other'
];

export default function UpdatePage() {

    // Serial Number for search
    const [searchSerial, setSearchSerial] = useState('');
    const [searchError, setSearchError] = useState('');

    // Information base on serial number
    const [found, setFound] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [eircode, setEircode] = useState('');
    const [applianceType, setApplianceType] = useState('');
    const [brand, setBrand] = useState('');
    const [modelNumber, setModelNumber] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [warrantyDate, setWarrantyDate] = useState('');
    const [cost, setCost] = useState('');

    // Result message
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setFound(false);
        setMessage(null);
        setSearchError('');

        const res = await fetch(`/api/appliance?serial=${searchSerial}`);
        const data = await res.json();

        if (!data.success) {
            setSearchError(data.message || 'No matching appliance found!');
            return;
        }

        // Fill with existing data
        setFirstName(data.data.FirstName);
        setLastName(data.data.LastName);
        setAddress(data.data.Address);
        setMobile(data.data.Mobile);
        setEmail(data.data.Email);
        setEircode(data.data.Eircode);
        setApplianceType(data.data.ApplianceType);
        setBrand(data.data.Brand);
        setModelNumber(data.data.ModelNumber);
        setPurchaseDate(data.data.PurchaseDate?.slice(0, 10));
        setWarrantyDate(data.data.WarrantyExpirationDate?.slice(0, 10));
        setCost(parseFloat(data.data.Cost).toFixed(2));
        setFound(true);
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        setErrors({});
        setMessage(null);

        const updatedData = {
            FirstName: firstName, LastName: lastName, Address: address,
            Mobile: mobile, Email: email, Eircode: eircode,
            ApplianceType: applianceType, Brand: brand,
            ModelNumber: modelNumber, PurchaseDate: purchaseDate,
            WarrantyExpirationDate: warrantyDate, Cost: cost
        }

        const res = await fetch(`/api/appliance/${searchSerial}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })

        const result = await res.json();

        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setFound(false);
        } else if (result.errors) {
            setErrors(result.errors);
        } else {
            setMessage({ type: 'error', text: result.message || 'Update failed.' });
        }
    }

    return (
        <div>
            <h1>Update Appliance</h1>
            <p>Enter a serial number to edit a appliance</p>

            {/* Enter the serial number (same logic in DeletePage)*/}
            {!found && !message && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Serial Number (12 digits)</label>
                        <input
                            id="searchSerial"
                            type="text"
                            placeholder="e.g. 123456789012"
                            value={searchSerial}
                            onChange={e => setSearchSerial(e.target.value)}
                        />
                        {searchError && <span>{searchError}</span>}
                    </div>

                    <div>
                        <button type="submit">
                            Find Appliance
                        </button>
                        <Link href="/">Back to Home</Link>
                    </div>
                </form>
            )}

            {/* Edit existing value */}
            {found && (
                <form onSubmit={handleUpdate}>
                    <div>User Details</div>
                    <div>
                        <div>
                            <label>First Name</label>
                            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
                            {errors.FirstName && <span >{errors.FirstName}</span>}
                        </div>
                        <div >
                            <label>Last Name</label>
                            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
                            {errors.LastName && <span >{errors.LastName}</span>}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label>Address</label>
                            <input type="text" value={address} onChange={e => setAddress(e.target.value)} />
                            {errors.Address && <span>{errors.Address}</span>}
                        </div>
                        <div >
                            <label>Mobile</label>
                            <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} />
                            {errors.Mobile && <span >{errors.Mobile}</span>}
                        </div>
                        <div >
                            <label>Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                            {errors.Email && <span >{errors.Email}</span>}
                        </div>
                        <div>
                            <label>Eircode</label>
                            <input type="text" value={eircode} onChange={e => setEircode(e.target.value.toUpperCase())} />
                            {errors.Eircode && <span >{errors.Eircode}</span>}
                        </div>
                    </div>

                    <div > Appliance Details</div>
                    <p>
                        Serial Number cannot be changed
                    </p>
                    <div>
                        <div>
                            <label>Appliance Type</label>
                            <select value={applianceType} onChange={e => setApplianceType(e.target.value)}>
                                <option value="">Select type</option>
                                {APPLIANCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            {errors.ApplianceType && <span>{errors.ApplianceType}</span>}
                        </div>
                        <div>
                            <label>Brand</label>
                            <input type="text" value={brand} onChange={e => setBrand(e.target.value)} />
                            {errors.Brand && <span>{errors.Brand}</span>}
                        </div>
                        <div>
                            <label>Model Number</label>
                            <input type="text" value={modelNumber} onChange={e => setModelNumber(e.target.value)} />
                            {errors.ModelNumber && <span>{errors.ModelNumber}</span>}
                        </div>
                        <div>
                            {/*Serial number cannot be edit*/}
                            <label>Serial Number (read only)</label>
                            <input type="text" value={searchSerial} readOnly />
                        </div>
                        <div >
                            <label>Purchase Date</label>
                            <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} />
                            {errors.PurchaseDate && <span>{errors.PurchaseDate}</span>}
                        </div>
                        <div>
                            <label>Warranty Expiration Date</label>
                            <input type="date" value={warrantyDate} onChange={e => setWarrantyDate(e.target.value)} />
                            {errors.WarrantyExpirationDate && <span>{errors.WarrantyExpirationDate}</span>}
                        </div>
                        <div>
                            <label>Cost</label>
                            <input type="number" step="0.01" min="0" value={cost} onChange={e => setCost(e.target.value)} />
                            {errors.Cost && <span>{errors.Cost}</span>}
                        </div>
                    </div>

                    <div>
                        <button type="submit">
                            Update
                        </button>
                        <button type="button" onClick={() => setFound(false)}>
                            Change Serial
                        </button>
                    </div>
                </form>
            )}

            {/* Result Message */}
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