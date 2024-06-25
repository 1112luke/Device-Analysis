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
    var newdata = [];
    for (var i = 0; i < condensed[0].length; i++) {
        var out = [];
        //do this backwards to y intercept is x intercept
        out[1] = condensed[0][i];
        out[0] = condensed[1][i];

        newdata.push(out);
    }

    return regression.linear(newdata);
}

function getVbk(data) {
    for (var i = 0; i < data[0].length; i++) {
        if (data[0][i + 1] > data[0][i]) {
            return data[0][i];
        }
    }
}

export { getRon as default, getVbk };
