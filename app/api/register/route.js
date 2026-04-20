import { error } from "console";
import fs from "fs"
import path from "path"

//path.join(): splicing path automatically, windows: \; Mac: /
//process: globel object in Server Side, in browser is "window".
//cwd(): Current work directory
//get the work place path
const filePath = path.join(process.cwd(), "data.json");

// Sanitize
function sanitize(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Read data
function readData() {

    if (!fs.existsSync(filePath)) {
        return [];
    }

    const file = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(file);
}

// data: object array [{...}, {...}]
// 2: Number of indentation spaces (Automatic line wrapping and indentation)
// Write data
function writeData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function validateData(body) {
    // define errors object
    let errors = {};

    const eircodeRegex = /^D\d{2}\s[A-Z0-9]{4}$/
    const modelNumberRegex = /^\d{10}$/;
    const serialNumberRegex = /^\d{12}$/

    if (!eircodeRegex.test(body.eircode)) {
        errors.eircode = "Eircode format error. (Example: D01 A1B2)"
    }

    if (!body.brand) {
        errors.brand = "Brand is required."
    }

    if (!modelNumberRegex.test(body.modelNumber)) {
        errors.modelNumber = "Model number must be 10 digits."
    }

    if (!serialNumberRegex.test(body.serialNumber)) {
        errors.serialNumber = "Serial number must be 12 digits."
    }

    if (body.expirationDate < body.purchaseDate) {
        errors.expirationDate = "The warranty date is earlier than the purchase date."
    }

    return errors;
}

// DELETE
export async function DELETE(request) {
    const data = readData();
    const body = await request.json();

    data.splice(body.index, 1);
    writeData(data);

    return Response.json(data, { status: 200 });
}

//GET
export async function GET() {

    const data = readData();

    return Response.json(data, { status: 200 });

}

// PUT (update)
export async function PUT(request) {

    const body = await request.json();
    const data = readData();

    const { index, ...content } = body;

    const cleanContent = {
        eircode: sanitize(content.eircode),
        selectedAppliance: sanitize(content.selectedAppliance),
        brand: sanitize(content.brand),
        modelNumber: sanitize(content.modelNumber),
        serialNumber: sanitize(content.serialNumber),
        purchaseDate: content.purchaseDate,
        expirationDate: content.expirationDate
    };

    const errors = validateData(cleanContent);

    if (Object.keys(errors).length > 0) {
        return Response.json({
            success: false,
            errors: errors,
            data: data
        }, { status: 400 })
    }

    const actualIndex = data.findIndex(item => item.eircode === index);

    if (actualIndex !== -1) {

        data[actualIndex] = cleanContent;
        writeData(data);

        return Response.json({ success: true, data: data }, { status: 200 });
    }

    return Response.json({ success: false, errors: { global: "Invalid index" } }, { status: 404 });

}

// POST (Create)
export async function POST(request) {
    const body = await request.json();

    const cleanBody = {
        eircode: sanitize(body.eircode),
        selectedAppliance: sanitize(body.selectedAppliance),
        brand: sanitize(body.brand),
        modelNumber: sanitize(body.modelNumber),
        serialNumber: sanitize(body.serialNumber),
        purchaseDate: body.purchaseDate, // date needn't to sanitize
        expirationDate: body.expirationDate
    };

    const errors = validateData(cleanBody);

    //object don't have length,so need Object.keys() to string
    if (Object.keys(errors).length > 0) {
        return Response.json({
            success: false,
            errors: errors,
            data: cleanBody
        }, { status: 400 })
    }

    const data = readData();
    data.push(cleanBody);
    writeData(data);

    return Response.json({ success: true }, { status: 200 });
}