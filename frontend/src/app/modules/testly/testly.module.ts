import * as angular from 'angular';
import * as controllers from './testly.controllers';
import * as services from './testly.services';


/**
 * Testly Module
 */
let testly = angular.module('testly', [])
    .controller('RunController', controllers.RunController)
    .controller('RunsController', controllers.RunsController)
    .service('TestlyService', services.TestlyService);

export default testly;
