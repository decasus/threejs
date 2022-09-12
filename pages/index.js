import Head from 'next/head'
import Scene from "../components/scene/scene";

export default function Home() {
    return (
        <div>
            <Head>
                <title>ThreeJS</title>
            </Head>
            <Scene/>
        </div>
    )
}