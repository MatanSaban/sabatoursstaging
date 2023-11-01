import React, { useState, useEffect, Children, cloneElement } from 'react';
import { useRouter } from "next/router";
import LogoLoader from './Loading';

function PageWrapper({ children, ...props }) {
    const [loading, setLoading] = useState(true);  // Set initial loading state to true
    const [percentage, setPercentage] = useState(0);
    const [showChildren, setShowChildren] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Function to handle updating the percentage and loading state
        const updatePercentage = (val) => {
            setPercentage(val);
            if (val < 100) {
                setTimeout(() => updatePercentage(val + 25), 500);
            } else {
                setLoading(false);
            }
        };

        // Event handlers
        const handleRouteChangeStart = () => {
            setLoading(false);
            setShowChildren(true);
            updatePercentage(0);
        };
        const handleRouteChangeComplete = () => {
            setLoading(false);
            setShowChildren(true);
        };
        const handleRouteChangeError = () => setLoading(false);

        // Listen for route changes
        router.events.on('routeChangeStart', handleRouteChangeStart);
        router.events.on('routeChangeComplete', handleRouteChangeComplete);
        router.events.on('routeChangeError', handleRouteChangeError);

        // Ensure children are shown on initial load
        if (router.isReady) {
            setLoading(false);
            setShowChildren(true);
        }

        return () => {
            // Cleanup event listeners
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
            router.events.off('routeChangeError', handleRouteChangeError);
        };
    }, [router]);

    return (
        <>
            {loading ? <LogoLoader percentage={percentage} show={true} showPercentage={false} /> : <LogoLoader percentage={percentage} show={false} showPercentage={false} />}
            {showChildren ?
                <div>
                    {Children.map(children, child => {
                        return cloneElement(child, props);
                    })}
                </div>
                : null}
        </>
    );
}

export default PageWrapper;
