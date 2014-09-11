angular.module('getSaldoTarjeta', []).factory('getSaldoTarjeta_', [
  '$http',
  function ($http) {
    var promise;
    var getSaldoTarjeta_ = {
        get: function (numeroTarjeta) {
          if (!promise) {
            //http://localhost:8080/webapps/consultasaldos/home?numeroTarjeta=4152822090000220
            var url = 'localhost:8080';
            promise = $http.get('http://' + url + '/webapps/consultasaldos/home?numeroTarjeta=' + numeroTarjeta.toUpperCase() + '&submit=Ingresar').then(function (response) {
              return response.data;
            });
          }
          return promise;
        }
      };
    return getSaldoTarjeta_;
  }
]);