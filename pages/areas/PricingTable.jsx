import React from "react";
import styles from './pricingTable.module.scss';  // Adjust the path if necessary

const PricingTable = ({ tableObj, cityName }) => {
    return (
        <div className={styles.pricingTableWrapper}>
            <h2 className={styles.pricingTableTitle}>מחירון הסעות</h2>
            {Object.keys(tableObj)?.map((rowByPassengersNum, index) => {
                let tableTitle;
                switch (rowByPassengersNum) {
                    case "upto_4":
                        tableTitle = "עד 4 נוסעים";
                        break;
                    case "over_4_upto_10":
                        tableTitle = "מעל 4 ועד 10 נוסעים";
                        break;
                    case "over_10_upto_19":
                        tableTitle = "מעל 10 ועד 19 נוסעים";
                        break;
                    case "over_19_upto_60":
                        tableTitle = "מעל 19 ועד 60 נוסעים";
                        break;
                }
                return (
                    <div key={index} className={styles.pricingTable}>
                        <h3 className={styles.tableTitle}>{tableTitle}</h3>
                        <table>
                            <thead>
                                <th>מאיפה לאיפה</th>
                                <th>תיאור</th>
                                <th>טווח מחירים</th>
                            </thead>
                            <tbody>
                                {Object.values(tableObj[rowByPassengersNum])?.map((row, rowIndex) => {
                                    return (
                                        <tr key={rowIndex}>
                                            <td>{row?.title?.replace("[city_name]", `${cityName}`)}</td>
                                            <td><div dangerouslySetInnerHTML={{ __html: row?.text?.replace("[city_name]", `${cityName}`)?.replace(".", ".<br/>") }} /></td>
                                            <td>{`₪${row?.price_range?.low_range} - ₪${row?.price_range?.high_range}`}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            })}
        </div>
    );
};

export default PricingTable;
