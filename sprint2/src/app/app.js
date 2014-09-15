angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ui.router','bchile-filters'
])
.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location,$filter,$http) {

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
    }

  });
  $scope.formatoTarjeta = function(tarjeta){
    if(tarjeta == null ) return "-";
    enmascaramientoTarjeta = 'XXXX '+tarjeta.numProducto.substring(tarjeta.numProducto.length-4, tarjeta.numProducto.length);
    if(tarjeta.titularidad=="T") titularidad = "TIT";
    else titularidad = "ADI";
    return titularidad+" "+tarjeta.marca+" "+enmascaramientoTarjeta;
  };

  $scope.pesos = function(strCurrency){
      //pesos currency has decimal then round it to nearest value.
      numCurrency = Number(strCurrency);      
      if ( typeof strCurrency == 'undefined')
          strCurrency = '';
      if (strCurrency != '-0')
          strCurrency = Number(strCurrency);
      strCurrency = (strCurrency.toString()).trim();
      var strCurrencyNew = '';
      var i = 1;
      var isNegative = false;

      if (strCurrency.indexOf('.') != -1) {
          return "$" + strCurrency;
      }
      var splitter = "-";
      var oldCurrency = strCurrency.toString();
      var prefix = "$";

      if (oldCurrency.indexOf(splitter) != -1) {
          oldCurrency = oldCurrency.substr(1, oldCurrency.length);
          prefix = "$-";
      }

      while (1) {
          index = i * 3;

          if (oldCurrency.length > index) {
              suffix = oldCurrency.substring(oldCurrency.length - index);
              oldCurrency = oldCurrency.substring(0, oldCurrency.length - index);
              strCurrencyNew = suffix + "." + strCurrencyNew;
          } else {
              strCurrencyNew = oldCurrency + "." + strCurrencyNew;
              break;
          }
      }
      return prefix + strCurrencyNew.substr(0, strCurrencyNew.length - 1);
    };
    $scope.dolar = function(usdAmount){
      if(isNaN(Number(usdAmount))) return 'US$0,00';
      if(usdAmount == "0"){return 'US$0,00'};
        if(Math.round(usdAmount) != usdAmount){
        var sinDecimal = usdAmount.split(".");
     
        var amount; 
        amount = Number(sinDecimal[0]+sinDecimal[1])/Math.pow(10,Number(sinDecimal[1].length));
      
        if (usdAmount.toString().indexOf(".") != -1) {
            amount = amount.toFixed(2);
        } else {
            amount = usdAmount;
        }

        var amountStr = amount.toString().trim().replace(".", ",").split(",");
        var modifiedAmt;
        if (amountStr.length > 1)
            modifiedAmt = $scope.pesos(amountStr[0]) + "," + amountStr[1];
        else
            modifiedAmt = $scope.pesos(amountStr.toString());
        return 'US'+modifiedAmt;
        
      }
      else{
        var amount;
        amount = Number(usdAmount);   
        if (usdAmount.toString().indexOf(".") != -1) {
            amount = amount.toFixed(2);
        } else {
            amount = usdAmount;
        }
        var amountStr = amount.toString().trim().replace(".", ",").split(",");
        var modifiedAmt;
        if (amountStr.length > 1)
            modifiedAmt = $scope.pesos(amountStr[0]) + "," + amountStr[1];
        else
            modifiedAmt = $scope.pesos(amountStr.toString());

        if (modifiedAmt.indexOf(",00") > -1) return modifiedAmt;
        else{return modifiedAmt+',00'}        
      }
    }
});

//// Tabs ////

var TabsDemoCtrl = function ($scope) {
  
};

//// Toggle ///////
function CollapseDemoCtrl($scope) {
  $scope.isCollapsed = true ;
  $scope.labelBotton = "Ver más";
  $scope.arrow = 'glyphicon glyphicon-chevron-down';
  $scope.select = function($event){ 
    if($scope.isCollapsed){
      $scope.isCollapsed = false;
      $scope.labelBotton = "Subir";
      $scope.arrow= 'glyphicon glyphicon-chevron-up';
    }
    else{
      $scope.isCollapsed = true;
      $scope.labelBotton = "Ver más";
      $scope.arrow = 'glyphicon glyphicon-chevron-down';
    }
  } 
}

//// slider /////

function CarouselDemoCtrl($scope) {
  $scope.myInterval = 999999999;
  var slides = $scope.slides = [];
  $scope.addSlide = function() {
    var newWidth = 600 + slides.length;
    slides.push({
      
    });
  };
  for (var i=0; i<1; i++) {
    $scope.addSlide();
  }
}

function GetDataTarjetas($scope,$http){
  $http.get('dummieInfoTarjetas.js').
  success(function(data, status, headers, config) {
  console.debug("success");
  $scope.tarjetas = data;
  console.log($scope.tarjetas);

  /// LLAMADA  A SERVICIO REST
//  var res = $http.get('/service/consultasaldos/home?numeroTarjeta=4152822090000204&submit=Ingresar');        
  //var res = $http.get('/service/consultasaldos/home?numeroTarjeta=4152822090000204&submit=Ingresar');        


  var res= $http.get('service/tarjeta/lista?numeroTarjeta=0004966701190000247&opcionFiltro=F&filler=000&submit=Ingresar');

        res.success(function(data, status, headers, config) {

            console.log(data);
              alert("1");
        });

  //FILTRAR TARJETAS ACTIVAS
  for(var i = 0 ; i < $scope.tarjetas.length; i++){
    if($scope.tarjetas[i].estado != "Vigente o Activo") {
      $scope.tarjetas.splice(i--, 1);
    }
  }
  $scope.tarjetaSeleccionada = $scope.tarjetas[0];
  //LLAMAR SERVICIO DE SALDOS PARA TARJETA 0 y guardarlos en saldosTarjeta y movimientos para esa tarjeta
    $http.get('dummie.js').
    success(function(data, status, headers, config) {
    console.debug("success");
    $scope.saldosTarjeta = data;
    }).
    error(function(data, status, headers, config) {
    });
///////////////////////////////////////////////////    
  }).
  error(function(data, status, headers, config) {
  });

  $scope.mostrarDatosTarjetaSeleccionada = function($event,tarjetaSeleccionada,$http) {
    console.log(tarjetaSeleccionada);
    $scope.tarjetaSeleccionada = tarjetaSeleccionada;   
    //LLAMAR SERVICIOS oara VER SALDOS PARA tarjetaSeleccionada
    if(tarjetaSeleccionada.marca[0] == "A"){
    $scope.saldosTarjeta.cupoAvancesInternacional = "12312";
    }
    else{
    $scope.saldosTarjeta.cupoAvancesInternacional = "45667757";
    }
    //////////////////////////////////////////////////
    console.log($scope.saldosTarjeta);
    console.log($scope.tarjetaSeleccionada);

  } 
}





