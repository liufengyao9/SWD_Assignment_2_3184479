import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <div>
        <div>
          <h1>Household Appliance Inventory</h1>
          <p>Manage your household appliances with ease</p>
        </div>

        <div>
          <Link href="/part-b-c/add">
            <span>➕</span>
            <h2>Add Appliance</h2>
            <p>Register a new appliance and user details to the system</p>
          </Link>

          <Link href="/search">
            <span>🔍</span>
            <h2>Search Appliance</h2>
            <p>Find an appliance by serial number</p>
          </Link>

          <Link href="/update">
            <span>✏️</span>
            <h2>Update Appliance</h2>
            <p>Edit existing appliance or user information</p>
          </Link>

          <Link href="/delete">
            <span>🗑️</span>
            <h2>Delete Appliance</h2>
            <p>Remove an appliance record from the system</p>
          </Link>
        </div>
      </div>
    </div>
  );
}