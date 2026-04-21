import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <div>
        <div>
          <h1>Household Appliance Inventory</h1>
        </div>

        <div>
          <Link href="/part-b-c/add">
            <h2>Add Appliance</h2>
          </Link>
          <Link href="/part-b-c/search">
            <h2>Search Appliance</h2>
          </Link>
          <Link href="/part-b-c/update">
            <h2>Update Appliance</h2>
          </Link>
          <Link href="/part-b-c/delete">
            <h2>Delete Appliance</h2>
          </Link>
        </div>
      </div>
    </div>
  );
}