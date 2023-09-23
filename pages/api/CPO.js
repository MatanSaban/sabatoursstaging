import axios from 'axios';

const FUEL_CONSUMPTION = {
    taxi: 15,
    vipTaxi: 13,
    '14SeatsMiniBus': 9,
    '19SeatsMiniBus': 7,
    bus: 3
};

const FULL_DAY_PRICES = {
    taxi: 1000,
    vipTaxi: 1500,
    '14SeatsMiniBus': 1800,
    '19SeatsMiniBus': 2500,
    bus: 3500
};

export default async (req, res) => {
    if (req.method === "POST") {
        try {
            const { properties } = req.body;
            let holidays = await fetchIsraeliHolidays();
            let { total, priceDetails } = getPriceOffer(properties.route, holidays);
            priceDetails.forEach((charge) => {
                return total += charge.amount;
            })

            res.status(200).json({ price: Math.floor(total), priceDetails });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
};

function getVehicleOptions(passengerCount) {
    if (passengerCount <= 4) {
        return ['taxi'];
    } else if (passengerCount <= 8) {
        return ['vipTaxi', 'taxi'];
    } else if (passengerCount <= 14) {
        return ['14SeatsMiniBus'];
    } else if (passengerCount <= 19) {
        return ['19SeatsMiniBus', '14SeatsMiniBus', 'taxi'];
    } else {
        return ['bus'];
    }
}

function calculateFuelCost(distance, fuelPrice, vehicleType) {
    const litersNeeded = distance / FUEL_CONSUMPTION[vehicleType];
    return litersNeeded * fuelPrice;
}

function calculateTripCost(route, fuelPrice) {
    const vehicleOptions = getVehicleOptions(route.passengers);
    const totalDistance = route.outbound.distance + (route.routeType === "TwoWays" ? route.inbound.distance : 0);

    let vehicleCosts = {};
    for (let vehicle of vehicleOptions) {
        const fuelCost = calculateFuelCost(totalDistance, fuelPrice, vehicle);
        vehicleCosts[vehicle] = fuelCost * 3.5;
    }

    return vehicleCosts;
}

function calculateExtraFees(route, holidays) {
    let extraCharge = 0;

    // Holiday check
    extraCharge += holidayPriceAdjustment(route, holidays);

    // Day of the week check
    const dayOfWeek = new Date(route.outbound.startPoint.date).getDay();
    if (dayOfWeek === 5) { // Friday
        extraCharge *= 1.5;
    } else if (dayOfWeek === 6) { // Saturday
        extraCharge *= 2;
    }

    // Time of the day check
    const startTime = new Date(route.outbound.startPoint.time).getHours();
    if (startTime >= 0 && startTime < 8) {
        extraCharge += 250;
    } else if (startTime >= 10 && startTime < 15.5) {
        extraCharge -= 150;
    } else if (startTime >= 15.5 && startTime < 20) {
        extraCharge += 150;
    } else if (startTime >= 20 && startTime < 24) {
        extraCharge += 200;
    }

    return extraCharge;
}

function calculateFullDayPrice(route, bestOption) {
    let totalDuration = route.outbound.duration;
    if (route.routeType === "TwoWays") {
        totalDuration += route.inbound.duration;
    }
    // For MultiWays and TailGaterDriver, you might need additional logic here

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

    const fuelPrice = 7.30; // This should be dynamic based on admin input
    const tripCosts = calculateTripCost(route, fuelPrice);
    let bestOption = Object.keys(tripCosts).reduce((a, b) => tripCosts[a] < tripCosts[b] ? a : b);

    result.total = tripCosts[bestOption];
    result.priceDetails.push({ amount: tripCosts[bestOption], reason: `Base price for ${bestOption}` });

    const extraFees = calculateExtraFees(route, holidays);
    result.total += extraFees;
    result.priceDetails.push({ amount: extraFees, reason: "Extra fees" });

    const fullDayCost = calculateFullDayPrice(route, bestOption);
    result.total += fullDayCost;
    result.priceDetails.push({ amount: fullDayCost, reason: "Full day price" });

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

function holidayPriceAdjustment(route, holidays) {
    let extraCharge = 0;

    if (isHoliday(route.outbound.startPoint.date, holidays)) {
        extraCharge += 250;
    } else if (isHolidayEve(route.outbound.startPoint.date, holidays)) {
        extraCharge += 150;
    }

    return extraCharge;
}
