import regression from "regression";

function getRon(data) {
    //get max and min values of dataset
    var min = Infinity;
    var max = 0;
    for (var i = 0; i < data[0].length; i++) {
        //get max and min y values
        if (data[1][i] > max) {
            max = data[1][i];
        }
        if (data[1][i] < min) {
            min = data[1][i];
        }
    }

    //get 5% values for each side
    var range = max - min;
    var maxvalue = max - range * 0.05;
    var minvalue = min + range * 0.05;

    //remove all datapoints that lie outside of max and min value
    var condensed = [[], []];
    for (var i = 0; i < data[0].length; i++) {
        if (data[1][i] > minvalue && data[1][i] < maxvalue) {
            condensed[0].push(data[0][i]);
            condensed[1].push(data[1][i]);
        }
    }

    //convert data to proper format
    var newdata = convertForRegression(condensed);

    return regression.linear(newdata);
}

function getVbk(data) {
    for (var i = 0; i < data[0].length; i++) {
        if (data[0][i + 1] > data[0][i]) {
            return data[0][i];
        }
    }
}

function convertForRegression(data) {
    var newdata = [];
    for (var i = 0; i < data[0].length; i++) {
        var out = [];
        //do this backwards so y intercept is x intercept
        out[0] = data[0][i];
        out[1] = data[1][i];

        newdata.push(out);
    }

    return newdata;
}

function getRonPoints(data) {
    //get linear regression for every datarange datapoints
    console.log(data);
    var output = [[], []];
    var datarange = 20;
    for (var i = 0; i < data[0].length; i++) {
        if (i < datarange) {
            var min = 0;
            var max = i + datarange;
        } else if (i > data[0].length - datarange) {
            var min = i - datarange;
            var max = data[0].length;
        } else {
            min = i - datarange;
            max = i + datarange;
        }

        //get linear regression on data in this range
        var subset = [[], []];
        for (var j = min; j < max; j++) {
            subset[0].push(data[0][j]);
            subset[1].push(data[1][j]);
        }
        subset = convertForRegression(subset);

        //get regression
        var result = regression.linear(subset);
        output[0].push(data[0][i]);
        output[1].push(1 / result.equation[0]);
    }

    //filter data
    //remove all points greater than max of iv and less than 0
    for (var i = 0; i < output[0].length; i++) {
        if (output[1][i] < 0) {
            output[1][i] = 1;
        }
    }

    //get minron
    var minron = Infinity;
    for (var i = 0; i < output[0].length; i++) {
        if (output[1][i] > 0 && output[1][i] < minron) {
            minron = output[1][i];
        }
    }

    return { ronpoints: output, minval: minron };
}

function calculateDeviceStats(devices) {
    var tempdevices = [...devices];

    //for each device
    //keep track of nuber of stats
    var maxvbk = -Infinity;
    var maxron = -Infinity;
    var minvbk = Infinity;
    var minron = Infinity;
    for (var i = 0; i < tempdevices.length; i++) {
        for (var j = 0; j < tempdevices[0].length; j++) {
            var device = tempdevices[i][j];

            //if device has iv data
            if (device.data.iv.length > 0) {
                //calculate ron differential

                var { ronpoints, minval } = getRonPoints(device.data.iv);
                tempdevices[i][j].data.ron = ronpoints;
                minval = +minval.toFixed(5);
                tempdevices[i][j].stats.ron = minval;

                /*
                //calculate linear regression to get x intercept of turn on voltage
                //calculate turn on voltage
                var result = getRon(device.data.iv);
                var ron = Math.abs(result.equation[1]) / result.equation[0];
                //do weird rounding businees to fix weird bug
                tempdevices[i][j].stats.ron = ron.toFixed(3);

                */
                //gradient handling
                if (minval < minron) {
                    minron = minval;
                }
                if (minval > maxron) {
                    maxron = minval;
                }
            }
            //if device has breakdown data
            if (device.data.breakdown.length > 0) {
                //get Vbk
                var vbk = getVbk(device.data.breakdown);
                console.log(i, j, vbk);
                tempdevices[i][j].stats.vbk = vbk;

                //gradient handling
                if (vbk < minvbk) {
                    minvbk = vbk;
                }
                if (vbk > maxvbk) {
                    maxvbk = vbk;
                }
            }
        }
    }
    //calculate gradients
    var ronrange = maxron - minron;
    var vbkrange = maxvbk - minvbk;
    console.log(maxron, minron);
    for (var i = 0; i < tempdevices.length; i++) {
        for (var j = 0; j < tempdevices[0].length; j++) {
            //gradients are values 0-1
            //iv stats
            if (tempdevices[i][j].data.iv.length > 0) {
                tempdevices[i][j].stats.rongradient =
                    (tempdevices[i][j].stats.ron - minron) / ronrange;
            }

            //breakdown stats
            if (tempdevices[i][j].data.breakdown.length > 0) {
                tempdevices[i][j].stats.vbkgradient =
                    (tempdevices[i][j].stats.vbk - minvbk) / vbkrange;
            }
        }
    }
    return tempdevices;
}

export { getRon as default, getVbk, calculateDeviceStats };
