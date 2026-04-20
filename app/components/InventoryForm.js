import { useEffect, useState } from "react";
import style from "../part-b-c/style.css"

export default function InventoryForm() {

    //eircode
    const [eircode, setEircode] = useState("");

    //appliance
    const [selectedAppliance, setSelectedAppliance] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const applianceList = ["Fridge", "Washing Machine", "Television"];

    //brand
    const [brand, setBrand] = useState("");

    //numbers
    const [modelNumber, setModelNumber] = useState("");
    const [serialNumber, setSerialNumber] = useState("");

    //date
    const [purchaseDate, setPurchaseDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');

    //Dynamic lists, display backend data
    const [entries, setEntries] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    //errors
    const [errors, setErrors] = useState({});

    const handleClick = (item) => {
        setSelectedAppliance(item)
        setIsOpen(false);
    }

    //Load existing data only on the first render time.
    useEffect(() => {
        async function fetchData() {
            const res = await fetch("/api/register");
            const data = await res.json();
            setEntries(data);
        }
        fetchData();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Check if it is empty in the frontend
        if (!eircode || !selectedAppliance || !brand || !modelNumber || !serialNumber || !purchaseDate || !expirationDate) {
            alert("All segement cannot be null.");
            return;
        }

        const response = await fetch("/api/register",
            {
                method: editIndex !== null ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editIndex !== null ? {
                    index: editIndex, eircode,
                    selectedAppliance, brand, modelNumber,
                    serialNumber, purchaseDate, expirationDate
                } :
                    {
                        eircode, selectedAppliance, brand, modelNumber,
                        serialNumber, purchaseDate, expirationDate
                    })
            }
        );

        const result = await response.json();

        //Check the result time(wether the result is from PUT or POST)
        if (Array.isArray(result.data) && result.success) {

            alert("Update Success!");
            setEntries(result.data);
            setEditIndex(null);
            setErrors({});
            setEircode("")
            setSelectedAppliance("");
            setBrand("");
            setModelNumber("");
            setSerialNumber("");
            setPurchaseDate("");
            setExpirationDate("");

            refresh();
        }
        else if (!result.success) {
            setErrors(result.errors || {});

            if (result.errors.eircode) setEircode("");
            if (result.errors.selectedAppliance) setSelectedAppliance("");
            if (result.errors.brand) setBrand("");
            if (result.errors.modelNumber) setModelNumber("");
            if (result.errors.serialNumber) setSerialNumber("");
            if (result.errors.expirationDate) {
                setPurchaseDate("");
                setExpirationDate("");
            }

        } else {
            alert("Success! Sending data to register...");
            setErrors({});
            setEircode("")
            setSelectedAppliance("");
            setBrand("");
            setModelNumber("");
            setSerialNumber("");
            setPurchaseDate("");
            setExpirationDate("");
            setEditIndex(null);

            refresh();
        }
    }

    const handleUpdate = (entry) => {
        setEircode(entry.eircode)
        setSelectedAppliance(entry.selectedAppliance);
        setBrand(entry.brand);
        setModelNumber(entry.modelNumber);
        setSerialNumber(entry.serialNumber);
        setPurchaseDate(entry.purchaseDate);
        setExpirationDate(entry.expirationDate);
        setEditIndex(entry.eircode);
    }

    const handleDelete = async (index, targetEircode) => {

        if (editIndex === targetEircode) {
            setEircode("");
            setSelectedAppliance("");
            setBrand("");
            setModelNumber("");
            setSerialNumber("");
            setPurchaseDate("");
            setExpirationDate("");
            setEditIndex(null);
        }

        await fetch("/api/register",
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ index })
            }
        );

        refresh();
    }

    //Automatically executed GET on the backend
    const refresh = async () => {
        const response = await fetch("/api/register");
        const newData = await response.json();

        setEntries(newData);
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Appliance Inventory</h2>
                <label>Enter your Eircode</label>

                <input
                    type="text"
                    value={eircode}
                    onChange={(e) => setEircode(e.target.value)}
                    placeholder="Input Eircode"
                />
                {errors.eircode &&
                    <p className="error-text">{errors.eircode}</p>
                }

                <label>
                    Select appliance
                </label>

                <input
                    placeholder="select appliance"
                    type="text"
                    value={selectedAppliance}
                    readOnly
                />
                {errors.selectedAppliance &&
                    <p className="error-text">{errors.selectedAppliance}</p>
                }

                <button type="button" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? "▲" : "▼"}
                </button>

                {isOpen && (
                    <ul className="dropdown-list">
                        {applianceList.map((item) => (
                            <li key={item}>
                                <button type="button" onClick={() => handleClick(item)}>{item}</button>
                            </li>
                        ))}
                    </ul>
                )}

                <label>
                    Input the brand
                </label>

                <input type="text"
                    value={brand}
                    placeholder="Input brand"
                    onChange={(event) => setBrand(event.target.value)}
                />
                {errors.brand &&
                    <p className="error-text">{errors.brand}</p>
                }

                <label>
                    Input model number
                </label>

                <input type="text"
                    value={modelNumber}
                    placeholder="Input modelnumber"
                    onChange={(event) => setModelNumber(event.target.value)}
                />
                {errors.modelNumber &&
                    <p className="error-text">{errors.modelNumber}</p>
                }

                <label>
                    Input serial number
                </label>

                <input type="text"
                    value={serialNumber}
                    placeholder="Input serialnumber"
                    onChange={(event) => setSerialNumber(event.target.value)}
                />
                {errors.serialNumber &&
                    <p className="error-text">{errors.serialNumber}</p>
                }

                <label>
                    Choose purchase date
                </label>

                <input type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    required
                />

                <label>
                    Choose warranty expiration date
                </label>

                <input type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    required
                />
                {errors.expirationDate &&
                    <p className="error-text">{errors.expirationDate}</p>
                }

                <button type="submit">{editIndex !== null ? "Update" : "Add to Inventory"}</button>

                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Eircode</th>
                                <th>Appliance</th>
                                <th>Brand</th>
                                <th>Model Number</th>
                                <th>Serial Number</th>
                                <th>Purchase Date</th>
                                <th>Warranty Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry, index) => (
                                <tr key={entry.eircode}>
                                    <td>{entry.eircode}</td>
                                    <td>{entry.selectedAppliance}</td>
                                    <td>{entry.brand}</td>
                                    <td>{entry.modelNumber}</td>
                                    <td>{entry.serialNumber}</td>
                                    <td>{entry.purchaseDate}</td>
                                    <td>{entry.expirationDate}</td>
                                    <td>
                                        <button className="edit-btn" type="button" onClick={() => handleUpdate(entry, index)}>Edit</button>
                                        <button className="delete-btn" type="button" onClick={() => handleDelete(index, entry.eircode)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </form>

        </>
    );
}