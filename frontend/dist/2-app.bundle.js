/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = angular;

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var angular = __webpack_require__(0);
var controllers = __webpack_require__(10);
var services = __webpack_require__(11);
/**
 * Testly Module
 */
var testly = angular.module('testly', [])
    .controller('RunController', controllers.RunController)
    .controller('RunsController', controllers.RunsController)
    .service('TestlyService', services.TestlyService);
exports.default = testly;


/***/ }),
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var angular = __webpack_require__(0);
__webpack_require__(7);
var App = (function () {
    function App() {
        this.restrict = 'E';
        this.templateUrl = 'templates/app.html';
        this.controller = 'AppCtrl';
        this.controllerAs = 'app';
    }
    App.instance = function () {
        return new App;
    };
    return App;
}());
var AppCtrl = (function () {
    function AppCtrl() {
        this.url = 'https://github.com/mochawich/testly';
    }
    return AppCtrl;
}());
exports.default = angular.module('app', ['ngRoute', 'ngMaterial', 'ngMessages', 'md.data.table', 'testly'])
    .directive('app', App.instance)
    .controller('AppCtrl', AppCtrl)
    .config(function ($routeProvider) {
    $routeProvider
        .when('/', {
        templateUrl: 'templates/testly/runs.html'
    })
        .when('/run/:runId', {
        templateUrl: 'templates/testly/run.html'
    });
});


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(13);
__webpack_require__(12);
/**
 * Controller responsible for a single test run.
 */
var RunController = (function () {
    function RunController($scope, $routeParams, service) {
        var _this = this;
        this.$scope = $scope;
        this.$routeParams = $routeParams;
        this.service = service;
        this.attrs = ['id', 'requested_by', 'status_display', 'created_at', 'path', 'environment', 'interface_display', 'logs'];
        this.blockAttrs = ['path', 'logs'];
        this.success = function (res) {
            _this.run = res.data;
        };
        if ($routeParams.runId) {
            this.id = $routeParams.runId;
            $scope.$watch('$viewContentLoaded', function () { return _this.getRun(); });
        }
    }
    /**
     * Returns whether the attribute should be displayed as a block
     * @param attr
     * @returns {boolean}
     */
    RunController.prototype.isBlockAttr = function (attr) {
        return this.blockAttrs.indexOf(attr) != -1;
    };
    ;
    RunController.prototype.getRun = function () {
        this.service.getRun(this.id).then(this.success);
    };
    ;
    return RunController;
}());
RunController.$inject = ['$scope', '$routeParams', 'TestlyService'];
exports.RunController = RunController;
/**
 * Controller responsible for list of test runs.
 */
var RunsController = (function () {
    function RunsController($scope, $location, service) {
        var _this = this;
        this.$scope = $scope;
        this.$location = $location;
        this.service = service;
        this.runs = {};
        this.count = 0;
        // Table properties
        this.query = {
            limit: 5,
            page: 1,
        };
        this.selected = [];
        this.autoRefresh = false;
        this.autoRefreshRate = 5000;
        this.timer = null;
        // Add run form properties
        this.formData = {};
        this.errors = {};
        /**
         * Fetches runs from backend
         */
        this.getRuns = function () {
            _this.promise = _this.service.getRuns(_this.query).then(_this.getRunsSuccess);
        };
        /**
         * Navigates to a specific run
         * @param run
         */
        this.onSelect = function (run) {
            _this.$location.url("/run/" + run.id);
        };
        this.getRunsSuccess = function (res) {
            _this.runs = res.data.results;
            _this.count = res.data.count;
        };
        this.addRunSuccess = function (res) {
            _this.errors = {};
            _this.getRuns();
        };
        this.addRunFailure = function (res) {
            _this.errors = res.data;
        };
        console.log('Initiated RunsController');
        this.getRuns();
    }
    /**
     * Adds a run
     */
    RunsController.prototype.addRun = function () {
        if (this.$scope.newRunForm.$valid) {
            this.service.addRun(this.formData).then(this.addRunSuccess, this.addRunFailure);
        }
    };
    ;
    /**
     * Resets add run form
     */
    RunsController.prototype.reset = function () {
        this.$scope.newRunForm.$setPristine();
        this.$scope.newRunForm.$setUntouched();
        this.formData = {};
        this.errors = {};
    };
    ;
    /**
     * Toggles runs table auto refresh
     */
    RunsController.prototype.togglePulling = function () {
        var _this = this;
        if (!this.timer) {
            this.timer = setInterval(function () { return _this.getRuns(); }, this.autoRefreshRate);
        }
        else {
            clearInterval(this.timer);
            this.timer = null;
        }
    };
    ;
    return RunsController;
}());
RunsController.$inject = ['$scope', '$location', 'TestlyService'];
exports.RunsController = RunsController;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * TestlyService
 * Responsible for communication between frontend and backend.
 */
var TestlyService = (function () {
    function TestlyService($http) {
        this.$http = $http;
        this.assets = {};
        this.getAssets();
    }
    /**
     * Public methods
     */
    TestlyService.prototype.getAssets = function () {
        var _this = this;
        return this.$http.get("http://localhost:8000" + "/assets")
            .then(function (res) { return _this.assets = res.data; });
    };
    TestlyService.prototype.getRuns = function (query) {
        var _this = this;
        return this.$http.get("http://localhost:8000" + "/runs", { params: query })
            .then(function (res) { return _this.handleRunsResponse(res); });
    };
    TestlyService.prototype.getRun = function (id) {
        var _this = this;
        return this.$http.get("http://localhost:8000" + "/runs/" + id)
            .then(function (res) { return _this.handleRunResponse(res); });
    };
    TestlyService.prototype.addRun = function (data) {
        var _this = this;
        return this.$http.post("http://localhost:8000" + "/runs", data)
            .then(function (res) { return _this.handleRunResponse(res); });
    };
    /**
     * Private methods
     */
    TestlyService.prototype.handleRunsResponse = function (res) {
        var _this = this;
        res.data.results.forEach(function (run) {
            _this.reformatRun(run);
        });
        return res;
    };
    TestlyService.prototype.handleRunResponse = function (res) {
        this.reformatRun(res.data);
        return res;
    };
    TestlyService.prototype.reformatRun = function (run) {
        run.interface_display = this.assets['interfaces'][run.interface];
        run.status_display = this.assets['statuses'][run.status];
    };
    return TestlyService;
}());
TestlyService.$inject = ['$http'];
exports.TestlyService = TestlyService;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 13 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMGVmYzkyYzhkOWFlMzI1ZTdiYzMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYW5ndWxhclwiIiwid2VicGFjazovLy8uL3NyYy9hcHAvbW9kdWxlcy90ZXN0bHkvdGVzdGx5Lm1vZHVsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL21vZHVsZXMvdGVzdGx5L3Rlc3RseS5jb250cm9sbGVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL21vZHVsZXMvdGVzdGx5L3Rlc3RseS5zZXJ2aWNlcy50cyIsIndlYnBhY2s6Ly8vLi9+L2FuZ3VsYXItbWF0ZXJpYWwtZGF0YS10YWJsZS9kaXN0L21kLWRhdGEtdGFibGUuY3NzIiwid2VicGFjazovLy8uL34vYW5ndWxhci1tYXRlcmlhbC9hbmd1bGFyLW1hdGVyaWFsLm1pbi5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDaEVBLHlCOzs7Ozs7Ozs7Ozs7Ozs7QUNBQSxxQ0FBbUM7QUFDbkMsMENBQW9EO0FBQ3BELHVDQUE4QztBQUc5Qzs7R0FFRztBQUNILElBQUksTUFBTSxHQUFHLE9B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b0JBQUM7QUFBRCxDQUFDO0FBbERVLHFCQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUhsQixzQ0FBYTs7Ozs7OztBQ04xQix5Qzs7Ozs7O0FDQUEseUMiLCJmaWxlIjoiMi1hcHAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA5KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAwZWZjOTJjOGQ5YWUzMjVlN2JjMyIsIm1vZHVsZS5leHBvcnRzID0gYW5ndWxhcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImFuZ3VsYXJcIlxuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgKiBhcyBhbmd1bGFyIGZyb20gJ2FuZ3VsYXInO1xuaW1wb3J0ICogYXMgY29udHJvbGxlcnMgZnJvbSAnLi90ZXN0bHkuY29udHJvbGxlcnMnO1xuaW1wb3J0ICogYXMgc2VydmljZXMgZnJvbSAnLi90ZXN0bHkuc2VydmljZXMnO1xuXG5cbi8qKlxuICogVGVzdGx5IE1vZHVsZVxuICovXG5sZXQgdGVzdGx5ID0gYW5ndWxhci5tb2R1bGUoJ3Rlc3RseScsIFtdKVxuICAgIC5jb250cm9sbGVyKCdSdW5Db250cm9sbGVyJywgY29udHJvbGxlcnMuUnVuQ29udHJvbGxlcilcbiAgICAuY29udHJvbGxlcignUnVuc0NvbnRyb2xsZXInLCBjb250cm9sbGVycy5SdW5zQ29udHJvbGxlcilcbiAgICAuc2VydmljZSgnVGVzdGx5U2VydmljZScsIHNlcnZpY2VzLlRlc3RseVNlcnZpY2UpO1xuXG5leHBvcnQgZGVmYXVsdCB0ZXN0bHk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYXBwL21vZHVsZXMvdGVzdGx5L3Rlc3RseS5tb2R1bGUudHMiLCJpbXBvcnQgKiBhcyBhbmd1bGFyIGZyb20gJ2FuZ3VsYXInO1xuaW1wb3J0ICcuL21vZHVsZXMvdGVzdGx5L3Rlc3RseS5tb2R1bGUnO1xuXG5cbmNsYXNzIEFwcCBpbXBsZW1lbnRzIG5nLklEaXJlY3RpdmUge1xuICAgIHJlc3RyaWN0ID0gJ0UnO1xuICAgIHRlbXBsYXRlVXJsID0gJ3RlbXBsYXRlcy9hcHAuaHRtbCc7XG4gICAgY29udHJvbGxlciA9ICdBcHBDdHJsJztcbiAgICBjb250cm9sbGVyQXMgPSAnYXBwJztcblxuICAgIHN0YXRpYyBpbnN0YW5jZSgpOiBuZy5JRGlyZWN0aXZlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBcHA7XG4gICAgfVxufVxuXG5cbmNsYXNzIEFwcEN0cmwgaW1wbGVtZW50cyBuZy5JQ29udHJvbGxlciB7XG4gICAgdXJsID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS9tb2NoYXdpY2gvdGVzdGx5Jztcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJywgJ25nTWF0ZXJpYWwnLCAnbmdNZXNzYWdlcycsICdtZC5kYXRhLnRhYmxlJywgJ3Rlc3RseSddKVxuICAgIC5kaXJlY3RpdmUoJ2FwcCcsIEFwcC5pbnN0YW5jZSlcbiAgICAuY29udHJvbGxlcignQXBwQ3RybCcsIEFwcEN0cmwpXG4gICAgLmNvbmZpZygoJHJvdXRlUHJvdmlkZXIpID0+IHtcbiAgICAgICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC53aGVuKCcvJywge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3Rlc3RseS9ydW5zLmh0bWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLndoZW4oJy9ydW4vOnJ1bklkJywge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3Rlc3RseS9ydW4uaHRtbCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FwcC9hcHAudHMiLCJpbXBvcnQge1Rlc3RseVNlcnZpY2V9IGZyb20gJy4vdGVzdGx5LnNlcnZpY2VzJztcbmltcG9ydCAnLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2FuZ3VsYXItbWF0ZXJpYWwvYW5ndWxhci1tYXRlcmlhbC5taW4uY3NzJztcbmltcG9ydCAnLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2FuZ3VsYXItbWF0ZXJpYWwtZGF0YS10YWJsZS9kaXN0L21kLWRhdGEtdGFibGUuY3NzJztcblxuXG4vKipcbiAqIENvbnRyb2xsZXIgcmVzcG9uc2libGUgZm9yIGEgc2luZ2xlIHRlc3QgcnVuLlxuICovXG5leHBvcnQgY2xhc3MgUnVuQ29udHJvbGxlciBpbXBsZW1lbnRzIG5nLklDb250cm9sbGVyIHtcbiAgICBwdWJsaWMgaWQ7XG4gICAgcHVibGljIHJ1bjtcbiAgICBwdWJsaWMgYXR0cnMgPSBbJ2lkJywgJ3JlcXVlc3RlZF9ieScsICdzdGF0dXNfZGlzcGxheScsICdjcmVhdGVkX2F0JywgJ3BhdGgnLCAnZW52aXJvbm1lbnQnLCAnaW50ZXJmYWNlX2Rpc3BsYXknLCAnbG9ncyddO1xuICAgIHByaXZhdGUgYmxvY2tBdHRycyA9IFsncGF0aCcsICdsb2dzJ107XG5cbiAgICBzdGF0aWMgJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICdUZXN0bHlTZXJ2aWNlJ107XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlICRzY29wZTogbmcuSVNjb3BlLCBwcml2YXRlICRyb3V0ZVBhcmFtcywgcHJpdmF0ZSBzZXJ2aWNlOiBUZXN0bHlTZXJ2aWNlKSB7XG4gICAgICAgIGlmICgkcm91dGVQYXJhbXMucnVuSWQpIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSAkcm91dGVQYXJhbXMucnVuSWQ7XG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCckdmlld0NvbnRlbnRMb2FkZWQnLCAoKSA9PiB0aGlzLmdldFJ1bigpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGUgYXR0cmlidXRlIHNob3VsZCBiZSBkaXNwbGF5ZWQgYXMgYSBibG9ja1xuICAgICAqIEBwYXJhbSBhdHRyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgcHVibGljIGlzQmxvY2tBdHRyKGF0dHIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvY2tBdHRycy5pbmRleE9mKGF0dHIpICE9IC0xO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGdldFJ1bigpIHtcbiAgICAgICAgdGhpcy5zZXJ2aWNlLmdldFJ1bih0aGlzLmlkKS50aGVuKHRoaXMuc3VjY2Vzcyk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgc3VjY2VzcyA9IChyZXMpID0+IHtcbiAgICAgICAgdGhpcy5ydW4gPSByZXMuZGF0YTtcbiAgICB9O1xufVxuXG5cbi8qKlxuICogQ29udHJvbGxlciByZXNwb25zaWJsZSBmb3IgbGlzdCBvZiB0ZXN0IHJ1bnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBSdW5zQ29udHJvbGxlciBpbXBsZW1lbnRzIG5nLklDb250cm9sbGVyIHtcbiAgICBwdWJsaWMgcnVucyA9IHt9O1xuICAgIHB1YmxpYyBjb3VudCA9IDA7XG5cbiAgICAvLyBUYWJsZSBwcm9wZXJ0aWVzXG4gICAgcHVibGljIHF1ZXJ5ID0ge1xuICAgICAgICBsaW1pdDogNSxcbiAgICAgICAgcGFnZTogMSxcbiAgICB9O1xuICAgIHB1YmxpYyBwcm9taXNlO1xuICAgIHB1YmxpYyBzZWxlY3RlZCA9IFtdO1xuICAgIHB1YmxpYyBhdXRvUmVmcmVzaCA9IGZhbHNlO1xuICAgIHByaXZhdGUgYXV0b1JlZnJlc2hSYXRlID0gNTAwMDtcbiAgICBwcml2YXRlIHRpbWVyID0gbnVsbDtcblxuICAgIC8vIEFkZCBydW4gZm9ybSBwcm9wZXJ0aWVzXG4gICAgcHVibGljIGZvcm1EYXRhID0ge307XG4gICAgcHVibGljIGVycm9ycyA9IHt9O1xuXG4gICAgc3RhdGljICRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnVGVzdGx5U2VydmljZSddO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSAkc2NvcGU6IG5nLklTY29wZSwgcHJpdmF0ZSAkbG9jYXRpb24sIHByaXZhdGUgc2VydmljZTogVGVzdGx5U2VydmljZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnSW5pdGlhdGVkIFJ1bnNDb250cm9sbGVyJyk7XG4gICAgICAgIHRoaXMuZ2V0UnVucygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZldGNoZXMgcnVucyBmcm9tIGJhY2tlbmRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0UnVucyA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9taXNlID0gdGhpcy5zZXJ2aWNlLmdldFJ1bnModGhpcy5xdWVyeSkudGhlbih0aGlzLmdldFJ1bnNTdWNjZXNzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTmF2aWdhdGVzIHRvIGEgc3BlY2lmaWMgcnVuXG4gICAgICogQHBhcmFtIHJ1blxuICAgICAqL1xuICAgIHB1YmxpYyBvblNlbGVjdCA9IChydW4pID0+IHtcbiAgICAgICAgdGhpcy4kbG9jYXRpb24udXJsKGAvcnVuLyR7cnVuLmlkfWApO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgcnVuXG4gICAgICovXG4gICAgcHVibGljIGFkZFJ1bigpIHtcbiAgICAgICAgaWYgKHRoaXMuJHNjb3BlLm5ld1J1bkZvcm0uJHZhbGlkKSB7XG4gICAgICAgICAgICB0aGlzLnNlcnZpY2UuYWRkUnVuKHRoaXMuZm9ybURhdGEpLnRoZW4odGhpcy5hZGRSdW5TdWNjZXNzLCB0aGlzLmFkZFJ1bkZhaWx1cmUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyBhZGQgcnVuIGZvcm1cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuJHNjb3BlLm5ld1J1bkZvcm0uJHNldFByaXN0aW5lKCk7XG4gICAgICAgIHRoaXMuJHNjb3BlLm5ld1J1bkZvcm0uJHNldFVudG91Y2hlZCgpO1xuICAgICAgICB0aGlzLmZvcm1EYXRhID0ge307XG4gICAgICAgIHRoaXMuZXJyb3JzID0ge307XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZXMgcnVucyB0YWJsZSBhdXRvIHJlZnJlc2hcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9nZ2xlUHVsbGluZygpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRpbWVyKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5nZXRSdW5zKCksIHRoaXMuYXV0b1JlZnJlc2hSYXRlKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcbiAgICAgICAgICAgIHRoaXMudGltZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHByaXZhdGUgZ2V0UnVuc1N1Y2Nlc3MgPSAocmVzKSA9PiB7XG4gICAgICAgIHRoaXMucnVucyA9IHJlcy5kYXRhLnJlc3VsdHM7XG4gICAgICAgIHRoaXMuY291bnQgPSByZXMuZGF0YS5jb3VudDtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBhZGRSdW5TdWNjZXNzID0gKHJlcykgPT4ge1xuICAgICAgICB0aGlzLmVycm9ycyA9IHt9O1xuICAgICAgICB0aGlzLmdldFJ1bnMoKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBhZGRSdW5GYWlsdXJlID0gKHJlcykgPT4ge1xuICAgICAgICB0aGlzLmVycm9ycyA9IHJlcy5kYXRhO1xuICAgIH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYXBwL21vZHVsZXMvdGVzdGx5L3Rlc3RseS5jb250cm9sbGVycy50cyIsImRlY2xhcmUgY29uc3QgQVBJX1VSTDtcblxuLyoqXG4gKiBUZXN0bHlTZXJ2aWNlXG4gKiBSZXNwb25zaWJsZSBmb3IgY29tbXVuaWNhdGlvbiBiZXR3ZWVuIGZyb250ZW5kIGFuZCBiYWNrZW5kLlxuICovXG5leHBvcnQgY2xhc3MgVGVzdGx5U2VydmljZSB7XG4gICAgcHVibGljIGFzc2V0cyA9IHt9O1xuXG4gICAgc3RhdGljICRpbmplY3QgPSBbJyRodHRwJ107XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlICRodHRwOiBuZy5JSHR0cFNlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5nZXRBc3NldHMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQdWJsaWMgbWV0aG9kc1xuICAgICAqL1xuXG4gICAgcHVibGljIGdldEFzc2V0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGh0dHAuZ2V0KGAke0FQSV9VUkx9L2Fzc2V0c2ApXG4gICAgICAgICAgICAudGhlbigocmVzKSA9PiB0aGlzLmFzc2V0cyA9IHJlcy5kYXRhKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0UnVucyhxdWVyeSkge1xuICAgICAgICByZXR1cm4gdGhpcy4kaHR0cC5nZXQoYCR7QVBJX1VSTH0vcnVuc2AsIHtwYXJhbXM6IHF1ZXJ5fSlcbiAgICAgICAgICAgIC50aGVuKChyZXMpID0+IHRoaXMuaGFuZGxlUnVuc1Jlc3BvbnNlKHJlcykpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRSdW4oaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGh0dHAuZ2V0KGAke0FQSV9VUkx9L3J1bnMvJHtpZH1gKVxuICAgICAgICAgICAgLnRoZW4oKHJlcykgPT4gdGhpcy5oYW5kbGVSdW5SZXNwb25zZShyZXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkUnVuKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGh0dHAucG9zdChgJHtBUElfVVJMfS9ydW5zYCwgZGF0YSlcbiAgICAgICAgICAgIC50aGVuKChyZXMpID0+IHRoaXMuaGFuZGxlUnVuUmVzcG9uc2UocmVzKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJpdmF0ZSBtZXRob2RzXG4gICAgICovXG5cbiAgICBwcml2YXRlIGhhbmRsZVJ1bnNSZXNwb25zZShyZXMpIHtcbiAgICAgICAgcmVzLmRhdGEucmVzdWx0cy5mb3JFYWNoKChydW4pID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVmb3JtYXRSdW4ocnVuKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZVJ1blJlc3BvbnNlKHJlcykge1xuICAgICAgICB0aGlzLnJlZm9ybWF0UnVuKHJlcy5kYXRhKTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZm9ybWF0UnVuKHJ1bikge1xuICAgICAgICBydW4uaW50ZXJmYWNlX2Rpc3BsYXkgPSB0aGlzLmFzc2V0c1snaW50ZXJmYWNlcyddW3J1bi5pbnRlcmZhY2VdO1xuICAgICAgICBydW4uc3RhdHVzX2Rpc3BsYXkgPSB0aGlzLmFzc2V0c1snc3RhdHVzZXMnXVtydW4uc3RhdHVzXTtcbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYXBwL21vZHVsZXMvdGVzdGx5L3Rlc3RseS5zZXJ2aWNlcy50cyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FuZ3VsYXItbWF0ZXJpYWwtZGF0YS10YWJsZS9kaXN0L21kLWRhdGEtdGFibGUuY3NzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbmd1bGFyLW1hdGVyaWFsL2FuZ3VsYXItbWF0ZXJpYWwubWluLmNzc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==