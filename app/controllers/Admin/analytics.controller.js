'use strict'

import NodeCache from "node-cache";
import moment from "moment";
import { getTopAddressOrders } from "../../services/Admin/analytics.service.js";

//Set cache expiry time
const cache = new NodeCache({ stdTTL: 21600 });

export const getTopOrders = async (req, res, next) => {

    //Get Current date and 30 days ago. Can be changed to pick from request
    const topOrderKey = moment().format('Y-M-D');
    const fromDate    = moment().startOf('day').subtract(30, 'days').toDate();
    const toDate      = moment().endOf('day').toDate();

    // const fromDate = new Date(new Date().setDate(toDate.getDate() - 31));
    if (cache.has(topOrderKey)) {
        console.log("Inside cache",  cache.get(topOrderKey));
        return res.status(200).json({
                                success: true,
                                message: `Order data as between ${fromDate} to ${toDate}`,
                                data   : cache.get(topOrderKey)
                            });
    }

    const topAddressOrders =  await getTopAddressOrders(fromDate, toDate);
    cache.set(topOrderKey, topAddressOrders);

    res.status(200).json({
                        success: true,
                        message: `Order data as between ${fromDate} to ${toDate}`,
                        data   : topAddressOrders
                    });
}