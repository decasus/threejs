import {useEffect, useRef} from "react";

const Scene = () => {

    const mount = useRef(null);

    useEffect(() => {
        let scene;

        import("./src/Scene.js").then(({default: Scene}) => {
            scene = Scene;
            scene.init(mount);
        })

        return () => {
            scene.destroy();
        }
    }, [])

    return (
        <div className="mount" ref={mount}></div>
    );
};

export default Scene;
