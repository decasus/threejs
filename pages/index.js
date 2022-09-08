import Head from 'next/head'
import styles from '../styles/Home.module.css'
//import SceneComponent from "../components/scene/scene";
import dynamic from 'next/dynamic';
import {Suspense} from 'react';

const SceneComponent = dynamic(() => import('../components/scene/scene'), {
    suspense: true,
})

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>ThreeJS</title>
            </Head>
            <Suspense fallback={<div>Loading...</div>}>
                <SceneComponent/>
            </Suspense>
        </div>
    )
}
