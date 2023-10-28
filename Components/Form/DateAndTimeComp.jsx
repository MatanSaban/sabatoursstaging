import React, { useEffect, useRef } from 'react';
import DatePicker from "react-datepicker";
import he from "date-fns/locale/he";
import { registerLocale } from "react-datepicker";
import { format } from "date-fns";
import { BiSolidTimeFive } from 'react-icons/bi';

registerLocale("he", he);

const DateTimePicker = ({
    resolvedMinTimeValue,
    route,
    handleDateChange,
    CustomDateInput,
    today,
    isMobile,
    endPointInputRef,
    setDatePickerRef,
    ...props
}) => {

    const datePickerRef = useRef();

    useEffect(() => {
        setDatePickerRef(datePickerRef);
    },[props])

    return (
        <> 
            <div className={`${props.labelAndInputWrapper}`} style={isMobile ? {marginTop: "20px"} : {}}>
                <label htmlFor="date">תאריך יציאה:</label>
                <div className={`${props.inputWrapper} ${props.datePickerWrapper}`}>
                    <DatePicker
                        ref={datePickerRef}
                        locale={he}
                        name="date"
                        showTimeSelect
                        timeCaption="שעה"
                        parent="startPoint"
                        minDate={new Date()}
                        minTime={resolvedMinTimeValue}
                        maxTime={
                            new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                today.getDate(),
                                23,
                                30
                            )
                        }
                        customInput={<CustomDateInput />}
                        selected={route?.startPoint?.date}
                        dateFormat="dd/MM/yyyy"
                        onChange={(date) => {
                            handleDateChange(date, {
                                target: {
                                    name: "date",
                                    closest: () => document.getElementById(props.wayType),
                                    attributes: {
                                        parent: {
                                            value: "startPoint",
                                        },
                                    },
                                },
                            });
                        }}
                    />
                </div>
            </div>
            <div className={`${props.labelAndInputWrapper}`} style={isMobile ? {marginTop: "20px"} : {}}>
                <label htmlFor="time">שעת יציאה:</label>
                <div className={`${props.inputWrapper} ${props.timeInputWrapper}`}>
                    <i className={props.timePickerIcon}>
                        <BiSolidTimeFive />
                    </i>
                    <input
                        type="text"
                        name="time"
                        id="time"
                        parent="startPoint"
                        required
                        disabled
                        value={
                            route?.startPoint?.date &&
                            format(route?.startPoint?.date, "HH:mm")
                        }
                    />
                </div>
            </div>
        </>
    );
};

export default DateTimePicker;
