import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import LogoLoader from './Loading';

function PageWrapper({ children }) {
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [showChildren, setShowChildren] = useState(false);  // New state variable
    const router = useRouter();
  
    useEffect(() => {
      // Function to update the percentage (you can customize this logic)
      const updatePercentage = (val) => {
        setPercentage(val);
        if (val < 100) {
          setTimeout(() => updatePercentage(val + 25), 500);  // Increment by 25 every 500ms
        } else {
          setLoading(false);  // Hide loader once percentage reaches 100
        }
      };
  
      // Event handlers
      const handleRouteChangeStart = () => {
        setLoading(true);
        setShowChildren(false);  // Hide children when route change starts
        updatePercentage(0);
      };
      const handleRouteChangeComplete = () => {
        setLoading(false);  // Set loading to false, which sets `show` in LogoLoader to false
        setTimeout(() => {
          setShowChildren(true);  // Show children after 1s
        }, 1000);
      };
      const handleRouteChangeError = () => setLoading(false);
  
      // Listen for route changes
      router.events.on('routeChangeStart', handleRouteChangeStart);
      router.events.on('routeChangeComplete', handleRouteChangeComplete);
      router.events.on('routeChangeError', handleRouteChangeError);
  
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
        {showChildren ? children : null}
      </>
    );
}

export default PageWrapper;
