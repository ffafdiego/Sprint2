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

  $scope.formatoTarjetaTablaMovimientos = function(tarjeta){
    if(tarjeta == null ) return "-";
    enmascaramientoTarjeta = tarjeta.numProducto.substring(tarjeta.numProducto.length-4, tarjeta.numProducto.length);
    if(tarjeta.titularidad=="T") titularidad = "TIT";
    else titularidad = "ADI";
    return titularidad+"-"+enmascaramientoTarjeta;
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
    };
    $scope.formatoHora = function(hora){
      formatoHora = hora.substring(hora.length-3, "");
        return formatoHora;
    };
    $scope.formatoFechaAño = function(fecha){
        agno = fecha.substring(fecha.length-10, fecha.length-6);
        return agno;
      };

    $scope.formatoFechaDia = function(fecha){
        dia = fecha.substring(fecha.length-2, fecha.length);
        fecha = dia + " de ";
        return fecha;
      };

    $scope.formatoFechaMes = function(fecha){
      var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', ' Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      mes = fecha.substring(fecha.length-5, fecha.length-3);
      mes = parseInt(mes);
      mesf = meses[mes - 1];      
      return mesf;
    };
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

//  var res = $http.get('/service/tarjeta/consultaProd?rutCliente=8024544-0&productos=TNM&submit2=Ingresar');        
//    $http.get('/service/tarjeta/consultaSaldo?numeroTarjeta='+$scope.tarjetaSeleccionada.numProducto+'&secuenciaTarjeta=1&filler02=000&rutCliente=8024544-0&submit2=Ingresar').

function GetDataTarjetas($scope,$http){
  var rut  = "5886090-5";
  $http.get('dummieInfoTarjetas.js').
  success(function(data, status, headers, config) {
    console.debug("success");
    $scope.tarjetas = data.producto;
    //ORDEN DE TARJETAS
    $scope.tarjetas.sort(function(a, b){
      var tarjeta1=$scope.formatoTarjeta(a), tarjeta2=$scope.formatoTarjeta(b);
      if(tarjeta1.substring(0,3) == "TIT") return 0;
      if(tarjeta2.substring(0,3) == "TIT") return 1;
      if (tarjeta1 < tarjeta2) //sort string ascending
        return -1 
      if (tarjeta1 > tarjeta2)
        return 1
      return 0; //default return value (no sorting)
    })
    $scope.tarjetaSeleccionada = $scope.tarjetas[0];
  //LLAMAR SERVICIO DE SALDOS PARA TARJETA 0 y guardarlos en saldosTarjeta y movimientos para esa tarjeta
    $http.get('dummie.js').
    success(function(data, status, headers, config) {
      console.debug("success");
      $scope.saldosTarjeta = data;
      }).
    error(function(data, status, headers, config) {
    });

    // LLAMA SERVICIOS MOVIMIENTOS

    $http.get('dummieTransacciones.js').
      success(function(data, status, headers, config) {
      var transaccion = data;
      if (transaccion.transacciones == null){
        console.log("no hay nada");
      }
      $scope.movimientosNacionales = [];
      $scope.movimientosInternacionales = [];
      var fecha ;
      $scope.mesf;
      var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', ' Agosto', 'Septiembre', 'Octubre', 'Noviembre', ' Diciembre'];
      for(var i = 0 ; i < transaccion.transacciones.length; i++){
        if(transaccion.transacciones[i].origenTransaccion == "NAC") {
          $scope.movimientosNacionales.push(transaccion.transacciones[i]);
        }
        else{
          $scope.movimientosInternacionales.push(transaccion.transacciones[i]);
        }     
      }
    }). 
    error(function(data, status, headers, config) {
    });

///////////////////////////////////////////////////
  }).
  error(function(data, status, headers, config) {
  });
  $scope.mostrarDatosTarjetaSeleccionada = function($event,tarjetaSeleccionada) {
    $scope.tarjetaSeleccionada = tarjetaSeleccionada;
    $http.get('/service/tarjeta/consultaSaldo?numeroTarjeta='+$scope.tarjetaSeleccionada.numProducto+'&secuenciaTarjeta=1&filler02=000&rutCliente='+rut+'&submit2=Ingresar').
    success(function(data, status, headers, config) {
      console.debug("success");
      $scope.saldosTarjeta = data;
      }).
    error(function(data, status, headers, config) {
    });

    $http.get('/service/tarjeta/lista?numeroTarjeta='+$scope.tarjetaSeleccionada.numProducto+'&opcionFiltro=F&filler=000&rutCliente='+rut+'&submit=Ingresar').
      success(function(data, status, headers, config) {
      var transaccion = data;
      if (transaccion.transacciones == null){
      }
      $scope.movimientosNacionales = [];
      $scope.movimientosInternacionales = [];
      var fecha ;
      $scope.mesf;
      var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', ' Agosto', 'Septiembre', 'Octubre', 'Noviembre', ' Diciembre'];
      for(var i = 0 ; i < transaccion.transacciones.length; i++){
        if(transaccion.transacciones[i].origenTransaccion == "NAC") {
          $scope.movimientosNacionales.push(transaccion.transacciones[i]);
        }
        else{
          $scope.movimientosInternacionales.push(transaccion.transacciones[i]);
        }     
      }
    }). 
    error(function(data, status, headers, config) {
    });

  }
} 






