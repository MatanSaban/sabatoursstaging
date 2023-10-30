import React from 'react'
import PageHero from '../../Components/Misc/PageHero/PageHero'
import PriceForm from '../../Components/Form/PriceForm'
import LogoLoader from '../../Components/Misc/Loading'
import { LoadScript } from '@react-google-maps/api'
import styles from './priceOfferPage.module.scss'
const libraries = ["places"]; // define the libraries needed


const OnlineOffer = (props) => {
    return (
        <div className={styles.priceOfferWrapper}>
            <PageHero title={"הצעת מחיר אונליין להסעה"} />
            <LoadScript
                googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}
                libraries={libraries}
                loadingElement={<LogoLoader percentage={null} showPercentage={false} show={false} />}
            >
                <div className={styles.priceFormWrapper}>
                    <PriceForm
                        handlePopup={props.handlePopup}
                        sendDataToApp={props?.sendDataToApp}
                        userRoute={props?.userRoute}
                        windowWidth={props?.windowWidth}
                    />
                </div>
            </LoadScript>
        </div>
    )
}

export default OnlineOffer