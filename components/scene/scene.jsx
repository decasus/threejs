import {useEffect, useRef} from "react";

const Scene = () => {

    const mount = useRef(null);

    useEffect(() => {
        import("./src/Scene.js").then(({default: Scene}) => {
            Scene.init(mount);
        })
    }, [])

    return (
        <div className="mount" ref={mount}></div>
    );
};

export default Scene;
