import { useEffect, useState } from "react";

const useDeviceOrientation = () => {
    const [orientation, setOrientation] = useState({
        isUnder: false,
        isPortrait: false,
        shouldShowRotateMessage: false
    });

    useEffect(() => {
        const checkOrientation = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const isUnder = width <= 1500;
            const isPortrait = height > width;

            setOrientation({
                isUnder,
                isPortrait,
                shouldShowRotateMessage: isUnder && isPortrait
            });
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    return orientation;
};

export default useDeviceOrientation;