import {Dimensions, PixelRatio, Platform, NetInfo} from 'react-native';

const device = Dimensions.get("window");
export const devHeight = device.height;
export const devWidth = device.width;


/**
 *
 * @returns unixTimeStamp : 2018-10-03T17:26:14.118Z

 */
export const getUnixTimestamp = () => {
    let ts = new Date();
    return (ts.toISOString());
};

/**
 * check empty
 * @param obj
 * @returns {boolean}
 */
export function isEmpty(obj) {
    if (obj !== null && obj !== undefined) {//for general objects
        if (typeof (obj) === 'string') {
            if (obj.trim() === '' || obj == 'null') {//for string
                return true;
            }
            else {
                return false;
            }
        }
        else if (obj.length <= 0) {//for array
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return true;
    }
}


