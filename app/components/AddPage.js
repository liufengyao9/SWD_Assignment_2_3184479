import { useState } from "react";


export default function AddPage() {

    // User 
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [eircode, setEircode] = useState("");

    // Appliance 
    const [applianceType, setApplianceType] = useState("");
    const [brand, setBrand] = useState("");
    const [modelNumber, setModelNumber] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [warrantyDate, setWarrantyDate] = useState("");
    const [cost, setCost] = useState("");

    return (
        <div>
            <h1>Add Appliance</h1>
            <form>
                {/* User Details */}
                <div>User Details</div>
                <div>
                    <div>
                        <label>First Name</label>
                        <input
                            id="firstName" type="text" placeholder="e.g. John"
                            value={firstName} onChange={e => setFirstName(e.target.value)}
                        />
                        {errors.FirstName && <span>{errors.FirstName}</span>}
                    </div>

                    <div>
                        <label>Last Name</label>
                        <input
                            id="lastName" type="text" placeholder="e.g. Smith"
                            value={lastName} onChange={e => setLastName(e.target.value)}
                        />
                        {errors.LastName && <span>{errors.LastName}</span>}
                    </div>

                    <div>
                        <label>Address</label>
                        <input
                            id="address" type="text" placeholder="e.g. 12 Main Street, Dublin"
                            value={address} onChange={e => setAddress(e.target.value)}
                        />
                        {errors.Address && <span >{errors.Address}</span>}
                    </div>

                    <div>
                        <label>Mobile</label>
                        <input
                            id="mobile" type="tel" placeholder="e.g. 0831234567"
                            value={mobile} onChange={e => setMobile(e.target.value)}
                        />
                        {errors.Mobile && <span>{errors.Mobile}</span>}
                    </div>

                    <div>
                        <label>Email</label>
                        <input
                            id="email" type="email" placeholder="e.g. john@email.com"
                            value={email} onChange={e => setEmail(e.target.value)}
                        />
                        {errors.Email && <span>{errors.Email}</span>}
                    </div>

                    <div>
                        <label>Eircode</label>
                        <input
                            id="eircode" type="text" placeholder="e.g. D01 A1B2"
                            value={eircode} onChange={e => setEircode(e.target.value.toUpperCase())}
                        />
                        {errors.Eircode && <span>{errors.Eircode}</span>}
                    </div>
                </div>

                {/* Appliance Details */}
                <div>Appliance Details</div>
                <div>
                    <div>
                        {/* Dropdown for appliance type */}
                        <label>Appliance Type</label>
                        <select
                            id="applianceType" value={applianceType}
                            onChange={e => setApplianceType(e.target.value)}
                        >
                            <option value="">Select type</option>
                            {APPLIANCE_TYPES.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        {errors.ApplianceType && <span>{errors.ApplianceType}</span>}
                    </div>

                    <div>
                        <label>Brand</label>
                        <input
                            id="brand" type="text" placeholder="e.g. Samsung"
                            value={brand} onChange={e => setBrand(e.target.value)}
                        />
                        {errors.Brand && <span>{errors.Brand}</span>}
                    </div>

                    <div>
                        <label>Model Number</label>
                        <input
                            id="modelNumber" type="text" placeholder="e.g. WF45R6100AW"
                            value={modelNumber} onChange={e => setModelNumber(e.target.value)}
                        />
                        {errors.ModelNumber && <span className="error-text">{errors.ModelNumber}</span>}
                    </div>

                    <div>
                        <label>Serial Number</label>
                        <input
                            id="serialNumber" type="text" placeholder="e.g. 123456789012"
                            value={serialNumber} onChange={e => setSerialNumber(e.target.value)}
                        />
                        {errors.SerialNumber && <span>{errors.SerialNumber}</span>}
                    </div>

                    <div>
                        {/* Date picker for purchase date */}
                        <label>Purchase Date</label>
                        <input
                            id="purchaseDate" type="date"
                            value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)}
                        />
                        {errors.PurchaseDate && <span>{errors.PurchaseDate}</span>}
                    </div>

                    <div>
                        {/* Date picker for warranty expiration */}
                        <label>Warranty Expiration Date</label>
                        <input
                            id="warrantyDate" type="date"
                            value={warrantyDate} onChange={e => setWarrantyDate(e.target.value)}
                        />
                        {errors.WarrantyExpirationDate && <span>{errors.WarrantyExpirationDate}</span>}
                    </div>

                    <div>
                        <label>Cost</label>
                        <input
                            id="cost" type="number" placeholder="e.g. 499.99"
                            step="0.01" min="0"
                            value={cost} onChange={e => setCost(e.target.value)}
                        />
                        {errors.Cost && <span>{errors.Cost}</span>}
                    </div>
                </div>
            </form>
        </div>
    );
}