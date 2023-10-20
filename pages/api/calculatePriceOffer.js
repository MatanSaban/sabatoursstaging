import axios from 'axios';

const DIESEL_PRICE = 8;

const FULL_DAY_PRICES = { // used for 10 hours and upto 300 kilometers
    taxi: 1000,
    vipTaxi: 1500,
    minibus14: 1800,
    minibus19: 24500,
    midibus: 3000,
    bus: 3500,
    maxiBus: 3800,
};

const VEHICLES = {
    taxi: {
        fuelConsumption: 15,
        fullDayPrice: 1000,
        maxPassengers: 4,
        maxSuitcases: 2,
        minPrice: 100,
        passengersAndSuitcasesCombos: [
            { passengers: 1, suitcases: 4 },
            { passengers: 2, suitcases: 2 }
        ]
    },
    vipTaxi: {
        fuelConsumption: 17,
        fullDayPrice: 1500,
        maxPassengers: 10,
        maxSuitcases: 4,
        minPrice: 150,
        passengersAndSuitcasesCombos: [
            { passengers: 6, suitcases: 6 }
        ]
    },
    minibus14: {
        fuelConsumption: 20,
        fullDayPrice: 1800,
        maxPassengers: 14,
        maxSuitcases: 4,
        minPrice: 250,
        passengersAndSuitcasesCombos: [
            { passengers: 8, suitcases: 6 }
        ]
    },
    minibus19: {
        fuelConsumption: 24,
        fullDayPrice: 2450,
        maxPassengers: 19,
        maxSuitcases: 10,
        minPrice: 200,
        passengersAndSuitcasesCombos: [
            { passengers: 15, suitcases: 15 }
        ]
    },
    midibus: {
        fuelConsumption: 26,
        fullDayPrice: 3000,
        maxPassengers: 35,
        maxSuitcases: 35,
        minPrice: 350,
        passengersAndSuitcasesCombos: []
    },
    bus: {
        fuelConsumption: 30,
        fullDayPrice: 3500,
        maxPassengers: 55,
        maxSuitcases: 55,
        minPrice: 500,
        passengersAndSuitcasesCombos: []
    },
    maxiBus: {
        fuelConsumption: 34,
        fullDayPrice: 3800,
        maxPassengers: 60,
        maxSuitcases: 60,
        minPrice: 650,
        passengersAndSuitcasesCombos: []
    },
};

// Calculate the pricePerKilometer for each vehicle
for (const vehicleType in VEHICLES) {
    const fuelConsumption = VEHICLES[vehicleType].fuelConsumption;
    VEHICLES[vehicleType].pricePerKilometer = (fuelConsumption / 100) * DIESEL_PRICE ;
}

export default async (req, res) => {
    if (req.method === "POST") {
        try {
            const { properties } = req.body;
            let holidays = await fetchIsraeliHolidays();
            let { total: initialTotal, priceDetails } = getPriceOffer(properties.route, holidays); // Rename total to initialTotal
            let total = 0; // Initialize total to 0
            priceDetails.map((charge) => {
                total += charge.amount; // Add each charge to the total
                return total;
            })

            res.status(200).json({ price: Math.floor(total), priceDetails });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
};

function getVehicleOptions(passengerCount, suitcaseCount) {
    const vehicleList = [
        'taxi', 'vipTaxi', 'minibus14', 'minibus19', 'midibus', 'bus', 'maxiBus'
    ];

    for (const vehicle of vehicleList) {
        const vehicleDef = VEHICLES[vehicle];

        // Regular checks
        if (passengerCount <= vehicleDef.maxPassengers) {
            // Special suitcase conditions
            for (const combo of vehicleDef.passengersAndSuitcasesCombos) {
                if (passengerCount === combo.passengers && suitcaseCount <= combo.suitcases) {
                    return [vehicle];
                }
            }

            // Regular suitcase condition
            if (suitcaseCount <= vehicleDef.maxSuitcases) {
                return [vehicle];
            }
        }
    }

    // If no exact match is found, offer more than one vehicle
    let potentialVehicles = [];
    for (const vehicle of vehicleList) {
        const vehicleDef = VEHICLES[vehicle];
        if (passengerCount <= vehicleDef.maxPassengers && suitcaseCount <= vehicleDef.maxSuitcases) {
            potentialVehicles.push(vehicle);
        }
    }

    return potentialVehicles.length ? potentialVehicles : ["No suitable vehicle found."];
}




function calculateFuelCost(distance, vehicleType) {
    const fuelExpense = distance * VEHICLES[vehicleType].pricePerKilometer;
    console.log('price per km');
    console.log(VEHICLES[vehicleType].pricePerKilometer);
    console.log('distance');
    console.log(distance);
    console.log('fuelExpense');
    console.log(fuelExpense);
    return fuelExpense;
}


function calculateTripCost(route) {
    const vehicleOptions = getVehicleOptions(route.passengers, route.suitcases);
    const totalDistance = route.outbound.distance + (route.routeType === "TwoWays" ? route.inbound.distance : 0);

    let vehicleCosts = {};
    for (let option of vehicleOptions) {
        const vehicles = option.split('+');
        let totalCostForOption = 0;
        for (let vehicle of vehicles) {
            const fuelCost = calculateFuelCost(totalDistance, vehicle);
            totalCostForOption += fuelCost * 3.7;
        }
        vehicleCosts[option] = totalCostForOption;
    }
    console.log("vehicleCosts")
    console.log(vehicleCosts)

    return vehicleCosts;
}


function calculateExtraFees(route, holidays, result) {
    let basePrice = result.total;
    let extraCharge = 0;

    // Day of the week check
    const dayOfWeek = new Date(route.outbound.startPoint.date).getDay();
    const startTime = new Date(route.outbound.startPoint.time).getHours();

    function applyHigherCharge(percentage, fixedFee, reason) {
        let percentCharge = basePrice * percentage;
        let charge = Math.max(percentCharge, fixedFee);
        extraCharge += charge;
        result.priceDetails.push({ amount: charge, reason: reason });
    }

    switch (dayOfWeek) {
        case 0: // Sunday
            if (startTime < 4) {
                applyHigherCharge(0.25, 150, "Sunday early morning adjustment (0-4 AM)");
            } else if (startTime < 8 && startTime > 4) {
                applyHigherCharge(0.15, 100, "Sunday early morning adjustment (4-8 AM)");
            }
            break;
        case 4: // Thursday
            if (startTime >= 18) {
                applyHigherCharge(0.15, 150, "Thursday evening adjustment (6 PM - midnight)");
            }
            break;
        case 5: // Friday
            if (startTime < 6) {
                applyHigherCharge(0.5, 150, "Friday early morning adjustment (0-6 AM)");
            } else if (startTime < 15) {
                applyHigherCharge(0.25, 100, "Friday morning to afternoon adjustment (6 AM - 3 PM)");
            } else if (startTime < 18) {
                applyHigherCharge(0.5, 150, "Friday afternoon adjustment (3-6 PM)");
            } else {
                applyHigherCharge(1, 300, "Friday evening adjustment (6 PM - midnight)");
            }
            break;
        case 6: // Saturday
            if (startTime < 19) {
                applyHigherCharge(1, 250, "Saturday adjustment (until 7 PM)");
            } else {
                applyHigherCharge(0.75, 200, "Saturday evening adjustment (7 PM - midnight)");
            }
            break;
    }

    // Time of the day check
    // if (startTime < 8) {
    //     extraCharge += basePrice * 0.2;
    //     result.priceDetails.push({ amount: basePrice * 0.2, reason: "Early morning adjustment (0-8 AM)" });
    // } else if (startTime >= 14 && startTime < 17) {
    //     extraCharge += basePrice * 0.1;
    //     result.priceDetails.push({ amount: basePrice * 0.1, reason: "Mid-afternoon adjustment (2 PM - 5 PM)" });
    // } else if (startTime >= 17 && startTime < 20) {
    //     extraCharge += basePrice * 0.05;
    //     result.priceDetails.push({ amount: basePrice * 0.05, reason: "Late afternoon adjustment (5 PM - 8 PM)" });
    // } else if (startTime >= 20) {
    //     extraCharge += basePrice * 0.15;
    //     result.priceDetails.push({ amount: basePrice * 0.15, reason: "Evening adjustment (8 PM - midnight)" });
    // }

    // Holiday check
    extraCharge += holidayPriceAdjustment(route, holidays, basePrice, result.priceDetails);

    return extraCharge;
}


function holidayPriceAdjustment(route, holidays, basePrice, priceDetails) {
    let holidayExtraCharge = 0;
    if (holidays.includes(route.outbound.startPoint.date)) {
        holidayExtraCharge += basePrice * 0.25;
        priceDetails.push({ amount: basePrice * 0.25, reason: "Holiday adjustment" });
        if (new Date(route.outbound.startPoint.time).getHours() >= 17) {
            holidayExtraCharge += basePrice;
            priceDetails.push({ amount: basePrice, reason: "Holiday evening adjustment (5 PM - midnight)" });
        }
    }
    return holidayExtraCharge;
}

function calculateFullDayPrice(route, bestOption) {
    let totalDuration = route.outbound.duration;
    if (route.routeType === "TwoWays") {
        totalDuration += route.inbound.duration;
    }

    const fullDays = Math.floor(totalDuration / 720); // 720 minutes = 12 hours
    const remainder = totalDuration % 720;

    let fullDayPrice = fullDays * FULL_DAY_PRICES[bestOption];
    if (remainder > 0) {
        fullDayPrice += FULL_DAY_PRICES[bestOption]; // Add another full day price for the remainder
    }

    return fullDayPrice;
}


function getPriceOffer(route, holidays) {
    let result = { total: 0, priceDetails: [] };

    // 1. Calculate the expenses of the drive first
    const tripExpenses = calculateTripCost(route);
    let bestOption = Object.keys(tripExpenses).reduce((a, b) => {
        return tripExpenses[a] < tripExpenses[b] ? a : b;
    });
    const baseExpense = tripExpenses[bestOption];

    // 2. Calculate the cost to the client based on the total expense
    result.total = baseExpense; // This is the base cost for the client
    result.priceDetails.push({ amount: baseExpense, reason: `Base price for ${bestOption}`, carType: bestOption });

    // 3. Add any extra fees if applicable
    const extraFees = calculateExtraFees(route, holidays, result);
    result.total += extraFees;

    // Calculate stop prices for outbound and inbound
    if (route.outbound.stops.length) {
        let stopPrice = route.outbound.stops.length * (route.outbound.stops[0].city === route.outbound.startPoint.city ? 15 : 30);
        result.total += stopPrice;
        result.priceDetails.push({ amount: stopPrice, reason: "Outbound stops price" });
    }
    if (route.routeType === "TwoWays" && route.inbound.stops.length) {
        let stopPrice = route.inbound.stops.length * (route.inbound.stops[0].city === route.inbound.startPoint.city ? 15 : 30);
        result.total += stopPrice;
        result.priceDetails.push({ amount: stopPrice, reason: "Inbound stops price" });
    }

    // 4. Check if the total price is below the minimum price for the selected vehicle
    const selectedVehicle = VEHICLES[bestOption];
    if (result.total < selectedVehicle.minPrice) {
        result.total = selectedVehicle.minPrice;
        result.priceDetails.push({ amount: selectedVehicle.minPrice, reason: "Minimum price applied" });
    }

    console.log('result');
    console.log(result);

    return result;
}



async function fetchIsraeliHolidays() {
    const data = {
        resource_id: '67492cda-b36e-45f4-9ed1-0471af297e8b',
        limit: 50
    };

    try {
        const response = await axios.get('https://data.gov.il/api/3/action/datastore_search', { params: data });

        if (response.data && response.data.result && response.data.result.records) {
            return response.data.result.records.map(record => ({
                start: new Date(record.HolidayStart),
                end: new Date(record.HolidayEnds)
            }));
        } else {
            console.error("Unexpected data structure from API:", response.data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching Israeli holidays:", error);
        return [];
    }
}

function isHoliday(date, holidays) {
    return holidays.some(holiday =>
        date >= holiday.start && date <= holiday.end
    );
}

function isHolidayEve(date, holidays) {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return isHoliday(nextDay, holidays);
}

