import Script from 'next/script'
 
function Gtag() {
  return (
    <div className="container">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-4WWJ8F67H9" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-4WWJ8F67H9');
        `}
      </Script>
    </div>
  )
}
 
export default Gtag