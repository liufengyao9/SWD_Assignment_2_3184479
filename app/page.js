import Link from 'next/link';

export default function Home() {
  return (
    <>

      <h1>SWD Assigment_1 Fengyao Liu 3184479</h1>
      <Link href="/part-a">
        <button >
          Go to part-a
        </button>
      </Link>

      <br />

      <Link href="/part-b-c">
        <button >
          Go to part-b-c
        </button>
      </Link>
    </>
  );
}