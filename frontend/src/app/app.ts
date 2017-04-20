import * as angular from 'angular';
import './modules/testly/testly.module';


class App implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'src/app/app.html';
    controller = 'AppCtrl';
    controllerAs = 'app';

    static instance(): ng.IDirective {
        return new App;
    }
}


class AppCtrl implements ng.IController {
    url = 'https://github.com/mochawich/testly';
}


export default angular.module('app', ['ngRoute', 'ngMaterial', 'ngMessages', 'md.data.table', 'testly'])
    .directive('app', App.instance)
    .controller('AppCtrl', AppCtrl)
    .config(($routeProvider) => {
        $routeProvider
            .when('/', {
                templateUrl: 'src/app/modules/testly/testly.templates/runs.html'
            })
            .when('/run/:runId', {
                templateUrl: 'src/app/modules/testly/testly.templates/run.html'
            });
    });
