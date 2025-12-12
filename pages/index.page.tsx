import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamic import for client-side only rendering (Heavy UI & Browser APIs)
const FluidColorGenerator = dynamic(
  () => import('../components/FluidColorGenerator'),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <Head>
        <title>PiCSSo | Paint with Code</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>
      <FluidColorGenerator />
    </>
  );
}
