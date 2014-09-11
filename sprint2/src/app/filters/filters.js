

/* Filters */
var isBoolean = function ( obj ) {
    return obj === true || obj === false || Object.prototype.toString.call(obj) === '[object Boolean]';
};

angular.module('bchile-filters', []).filter('lessThanZero', function () {
    return function (input) {
        return input < 0 ? 0 : input;
    };
}).filter('rut', function RutFilter() {
    return function (rut) {
        if (angular.isUndefined(rut)) {
            return '';
        }
        var sRut;
        var sRutFormateado = '';
        var strRut = rut.replace(/^0+/, '');

        while (strRut.indexOf(".") != -1) {
            strRut = strRut.replace(".", "");
        }
        while (strRut.indexOf("-") != -1) {
            strRut = strRut.replace("-", "");
        }
        sRut = strRut;
        var sDV = sRut.charAt(sRut.length - 1);
        sRut = sRut.substring(0, sRut.length - 1);
        while (sRut.length > 3) {
            sRutFormateado = "." + sRut.substr(sRut.length - 3) + sRutFormateado;
            sRut = sRut.substring(0, sRut.length - 3);
        }
        sRutFormateado = sRut + sRutFormateado;
        sRutFormateado += "-" + sDV;

        return sRutFormateado;
    };
}).filter('multiCurrency',function MultiCurrencyFilter($filter,$locale) {
    var numberFilter = $filter('number');
    var formats = $locale.NUMBER_FORMATS;
    var pattern = formats.PATTERNS[1];
    formats.DEFAULT_PRECISION = angular.isUndefined(formats.DEFAULT_PRECISION) ? 2 : formats.DEFAULT_PRECISION;
    var processAmount =  function ( amount, currencySymbol, fractionSize, suffixSymbol ) {
        if ( !angular.isNumber(amount) ) { return ''; }
        if ( angular.isUndefined(currencySymbol) ) { currencySymbol = formats.CURRENCY_SYM; }

        var isNegative = amount < 0;
        var parts = [];

        suffixSymbol = isBoolean(fractionSize) ? fractionSize : suffixSymbol;
        fractionSize = isBoolean(fractionSize) ? formats.DEFAULT_PRECISION : fractionSize;
        fractionSize = angular.isUndefined(fractionSize) ? formats.DEFAULT_PRECISION : fractionSize;

        amount = Math.abs(amount);

        var number = numberFilter( amount, fractionSize );

        parts.push(isNegative ? pattern.negPre : pattern.posPre);
        parts.push(!suffixSymbol ? currencySymbol : number);
        parts.push(suffixSymbol ? currencySymbol : number);
        parts.push(isNegative ? pattern.negSuf : pattern.posSuf);

        return parts.join('').replace(/\u00A4/g, '');
    };

    return function(amount, type) {
        switch(type) {
            case 'usd':
                return processAmount(amount, '$', 2, false);
            case 'euro':
                return processAmount(amount, '\u20ac', 2, true);
            case 'clp':
                return processAmount(amount, '$', 0, false);
            default:
                return processAmount(amount, '$', 0, false);
        }
    };
});


