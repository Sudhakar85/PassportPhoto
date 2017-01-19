Filters = {
    brightnessValue: 0,
    contrastValue: 0,
    originalImageData: null,
    currentCanvas: null,
    updateCanVas: null
};
Filters.setCanvas = function (canvas) {
    this.currentCanvas = canvas;
}
Filters.getCanvas = function () {
    return this.currentCanvas;
};

Filters.Init = function () {
    this.brightnessValue = 0;
    this.contrastValue = 0;
};
Filters.getContext = function () {
    return this.getCanvas().getContext('2d');
};

Filters.width = function () {
    return this.getCanvas().width;
};
Filters.height = function () {
    return this.getCanvas().height;
};
Filters.getPixels = function (canvas) {
    this.setCanvas(canvas);
    var context = this.getContext();
    this.originalImageData = context.getImageData(0, 0, this.width(), this.height());
    return this.originalImageData;
};
Filters.brightness = function (pixels, adjustment) {

    var d = pixels.data;
    for (var i = 0; i < d.length; i+=4)
    {
        d[i] += adjustment;
        d[i + 1] += adjustment;
        d[i + 2] += adjustment;
    }
    this.originalImageData.data = d;

    ImageResizeModule.updateCanEdit(this.originalImageData);
};

Filters.contrast = function (pixels, adjustment) {

    //var d = pixels.data;
    //for (var i = 0; i < d.length; i++) {
    //    d[i] *= adjustment;
    //    d[i + 1] *= adjustment;
    //    d[i + 2] *= adjustment;
    //}

    var d = pixels.data;
    var factor = (259 * (adjustment + 255)) / (255 * (259 - adjustment));

    for (var i = 0; i < d.length; i += 4) {
        d[i] = factor * (d[i] - 128) + 128;
        d[i + 1] = factor * (d[i + 1] - 128) + 128;
        d[i + 2] = factor * (d[i + 2] - 128) + 128;
    }

    this.originalImageData.data = d;    
    ImageResizeModule.updateCanEdit(this.originalImageData);
};

Filters.autoEnhance = function (pixels, gamaAdjustment)
{
    var gamma = parseFloat(gamaAdjustment);    
    var gammaInvert = 1 / gamma;    
    var pix = pixels.data;
    var hslValue = { h: 0, s: 0, l: 0 };
    var rgbValue = { r: 0, g: 0, b: 0 };

    for (var i = 0; i < pix.length; i += 4)
    {
        rgbToHsl(pix[i], pix[i + 1], pix[i + 2], hslValue);
        hslValue.l = Math.pow(hslValue.l, gammaInvert);
        hslToRgb(hslValue.h, hslValue.s, hslValue.l, rgbValue);
        pix[i] = rgbValue.r;
        pix[i + 1] = rgbValue.g;
        pix[i + 2] = rgbValue.b;
    }

    this.originalImageData.data = pix;
    //ImageResizeModule.settings.canEnhance.getContext('2d').putImageData(this.originalImageData, 0, 0);
    ImageResizeModule.updatecanEnhance(this.originalImageData);
};

function rgbToHsl(R, G, B, res) {

    var var_R = (R / 255); //RGB from 0 to 255
    var var_G = (G / 255);
    var var_B = (B / 255);

    var H = 0,
        S = 0,
        L = 0;

    var var_Min = Math.min(var_R, var_G, var_B); //Min. value of RGB
    var var_Max = Math.max(var_R, var_G, var_B); //Max. value of RGB
    var del_Max = var_Max - var_Min; //Delta RGB value

    L = (var_Max + var_Min) / 2;

    if (del_Max == 0) { //This is a gray, no chroma...
        H = 0; //HSL results from 0 to 1
        S = 0;
    } else { //Chromatic data...    
        S = (L < 0.5) ? del_Max / (var_Max + var_Min) : del_Max / (2 - var_Max - var_Min);


        var del_R = (((var_Max - var_R) / 6) + (del_Max / 2)) / del_Max;
        var del_G = (((var_Max - var_G) / 6) + (del_Max / 2)) / del_Max;
        var del_B = (((var_Max - var_B) / 6) + (del_Max / 2)) / del_Max;

        if (var_R == var_Max) {
            H = del_B - del_G;
        } else if (var_G == var_Max) {
            H = (1 / 3) + del_R - del_B;
        } else if (var_B == var_Max) {
            H = (2 / 3) + del_G - del_R;
        }

        if (H < 0) H += 1;
        if (H > 1) H -= 1;
    }
    res.h = H;
    res.s = S;
    res.l = L;
}

function hslToRgb(H, S, L, res) {
    var R = 0,
        G = 0,
        B = 0;
    var var_1 = 0,
        var_2 = 0;

    if (S == 0) { //HSL from 0 to 1
        R = L * 255; //RGB results from 0 to 255
        G = L * 255;
        B = L * 255;
    } else {
        var_2 = (L < 0.5) ? L * (1 + S) : (L + S) - (S * L);
        var_1 = 2 * L - var_2

        R = 255 * Hue_2_RGB(var_1, var_2, H + (1 / 3));
        G = 255 * Hue_2_RGB(var_1, var_2, H);
        B = 255 * Hue_2_RGB(var_1, var_2, H - (1 / 3));
    }
    res.r = R;
    res.g = G;
    res.b = B;
}

function Hue_2_RGB(v1, v2, vH) { //Function Hue_2_RGB

    if (vH < 0) vH += 1;
    if (vH > 1) vH -= 1;
    if ((6 * vH) < 1) return (v1 + (v2 - v1) * 6 * vH);
    if ((2 * vH) < 1) return (v2);
    if ((3 * vH) < 2) return (v1 + (v2 - v1) * ((2 / 3) - vH) * 6);
    return (v1);
}