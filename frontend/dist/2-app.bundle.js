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
var App = /** @class */ (function () {
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
var AppCtrl = /** @class */ (function () {
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
var RunController = /** @class */ (function () {
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
    RunController.$inject = ['$scope', '$routeParams', 'TestlyService'];
    return RunController;
}());
exports.RunController = RunController;
/**
 * Controller responsible for list of test runs.
 */
var RunsController = /** @class */ (function () {
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
    RunsController.$inject = ['$scope', '$location', 'TestlyService'];
    return RunsController;
}());
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
var TestlyService = /** @class */ (function () {
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
    TestlyService.$inject = ['$http'];
    return TestlyService;
}());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2ZkZWU0ODIyMmQ4MTE1NzgxNTMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYW5ndWxhclwiIiwid2VicGFjazovLy8uL3NyYy9hcHAvbW9kdWxlcy90ZXN0bHkvdGVzdGx5Lm1vZHVsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL21vZHVsZXMvdGVzdGx5L3Rlc3RseS5jb250cm9sbGVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL21vZHVsZXMvdGVzdGx5L3Rlc3RseS5zZXJ2aWNlcy50cyIsIndlYnBhY2s6Ly8vLi9+L2FuZ3VsYXItbWF0ZXJpYWwtZGF0YS10YWJsZS9kaXN0L21kLWRhdGEtdGFibGUuY3NzIiwid2VicGFjazovLy8uL34vYW5ndWxhci1tYXRlcmlhbC9hbmd1bGFyLW1hdGVyaWFsLm1pbi5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDaEVBLHlCOzs7Ozs7Ozs7Ozs7Ozs7QUNBQSxxQ0FBbUM7QUFDbkMsMENBQW9EO0FBQ3BELHVDQUE4QztBQUc5Qzs7R0FFRztBQUNILElBQUksTUFBTSxHQUFHLE9B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R0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBa0QvQixvQkFBQztDQUFBO0FBckRZLHNDQUFhOzs7Ozs7O0FDTjFCLHlDOzs7Ozs7QUNBQSx5QyIsImZpbGUiOiIyLWFwcC5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDkpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDNmZGVlNDgyMjJkODExNTc4MTUzIiwibW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYW5ndWxhclwiXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCAqIGFzIGFuZ3VsYXIgZnJvbSAnYW5ndWxhcic7XG5pbXBvcnQgKiBhcyBjb250cm9sbGVycyBmcm9tICcuL3Rlc3RseS5jb250cm9sbGVycyc7XG5pbXBvcnQgKiBhcyBzZXJ2aWNlcyBmcm9tICcuL3Rlc3RseS5zZXJ2aWNlcyc7XG5cblxuLyoqXG4gKiBUZXN0bHkgTW9kdWxlXG4gKi9cbmxldCB0ZXN0bHkgPSBhbmd1bGFyLm1vZHVsZSgndGVzdGx5JywgW10pXG4gICAgLmNvbnRyb2xsZXIoJ1J1bkNvbnRyb2xsZXInLCBjb250cm9sbGVycy5SdW5Db250cm9sbGVyKVxuICAgIC5jb250cm9sbGVyKCdSdW5zQ29udHJvbGxlcicsIGNvbnRyb2xsZXJzLlJ1bnNDb250cm9sbGVyKVxuICAgIC5zZXJ2aWNlKCdUZXN0bHlTZXJ2aWNlJywgc2VydmljZXMuVGVzdGx5U2VydmljZSk7XG5cbmV4cG9ydCBkZWZhdWx0IHRlc3RseTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hcHAvbW9kdWxlcy90ZXN0bHkvdGVzdGx5Lm1vZHVsZS50cyIsImltcG9ydCAqIGFzIGFuZ3VsYXIgZnJvbSAnYW5ndWxhcic7XG5pbXBvcnQgJy4vbW9kdWxlcy90ZXN0bHkvdGVzdGx5Lm1vZHVsZSc7XG5cblxuY2xhc3MgQXBwIGltcGxlbWVudHMgbmcuSURpcmVjdGl2ZSB7XG4gICAgcmVzdHJpY3QgPSAnRSc7XG4gICAgdGVtcGxhdGVVcmwgPSAndGVtcGxhdGVzL2FwcC5odG1sJztcbiAgICBjb250cm9sbGVyID0gJ0FwcEN0cmwnO1xuICAgIGNvbnRyb2xsZXJBcyA9ICdhcHAnO1xuXG4gICAgc3RhdGljIGluc3RhbmNlKCk6IG5nLklEaXJlY3RpdmUge1xuICAgICAgICByZXR1cm4gbmV3IEFwcDtcbiAgICB9XG59XG5cblxuY2xhc3MgQXBwQ3RybCBpbXBsZW1lbnRzIG5nLklDb250cm9sbGVyIHtcbiAgICB1cmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL21vY2hhd2ljaC90ZXN0bHknO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ25nUm91dGUnLCAnbmdNYXRlcmlhbCcsICduZ01lc3NhZ2VzJywgJ21kLmRhdGEudGFibGUnLCAndGVzdGx5J10pXG4gICAgLmRpcmVjdGl2ZSgnYXBwJywgQXBwLmluc3RhbmNlKVxuICAgIC5jb250cm9sbGVyKCdBcHBDdHJsJywgQXBwQ3RybClcbiAgICAuY29uZmlnKCgkcm91dGVQcm92aWRlcikgPT4ge1xuICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgLndoZW4oJy8nLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvdGVzdGx5L3J1bnMuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbignL3J1bi86cnVuSWQnLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvdGVzdGx5L3J1bi5odG1sJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYXBwL2FwcC50cyIsImltcG9ydCB7VGVzdGx5U2VydmljZX0gZnJvbSAnLi90ZXN0bHkuc2VydmljZXMnO1xuaW1wb3J0ICcuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYW5ndWxhci1tYXRlcmlhbC9hbmd1bGFyLW1hdGVyaWFsLm1pbi5jc3MnO1xuaW1wb3J0ICcuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYW5ndWxhci1tYXRlcmlhbC1kYXRhLXRhYmxlL2Rpc3QvbWQtZGF0YS10YWJsZS5jc3MnO1xuXG5cbi8qKlxuICogQ29udHJvbGxlciByZXNwb25zaWJsZSBmb3IgYSBzaW5nbGUgdGVzdCBydW4uXG4gKi9cbmV4cG9ydCBjbGFzcyBSdW5Db250cm9sbGVyIGltcGxlbWVudHMgbmcuSUNvbnRyb2xsZXIge1xuICAgIHB1YmxpYyBpZDtcbiAgICBwdWJsaWMgcnVuO1xuICAgIHB1YmxpYyBhdHRycyA9IFsnaWQnLCAncmVxdWVzdGVkX2J5JywgJ3N0YXR1c19kaXNwbGF5JywgJ2NyZWF0ZWRfYXQnLCAncGF0aCcsICdlbnZpcm9ubWVudCcsICdpbnRlcmZhY2VfZGlzcGxheScsICdsb2dzJ107XG4gICAgcHJpdmF0ZSBibG9ja0F0dHJzID0gWydwYXRoJywgJ2xvZ3MnXTtcblxuICAgIHN0YXRpYyAkaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJ1Rlc3RseVNlcnZpY2UnXTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUsIHByaXZhdGUgJHJvdXRlUGFyYW1zLCBwcml2YXRlIHNlcnZpY2U6IFRlc3RseVNlcnZpY2UpIHtcbiAgICAgICAgaWYgKCRyb3V0ZVBhcmFtcy5ydW5JZCkge1xuICAgICAgICAgICAgdGhpcy5pZCA9ICRyb3V0ZVBhcmFtcy5ydW5JZDtcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJyR2aWV3Q29udGVudExvYWRlZCcsICgpID0+IHRoaXMuZ2V0UnVuKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHRoZSBhdHRyaWJ1dGUgc2hvdWxkIGJlIGRpc3BsYXllZCBhcyBhIGJsb2NrXG4gICAgICogQHBhcmFtIGF0dHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBwdWJsaWMgaXNCbG9ja0F0dHIoYXR0cikge1xuICAgICAgICByZXR1cm4gdGhpcy5ibG9ja0F0dHJzLmluZGV4T2YoYXR0cikgIT0gLTE7XG4gICAgfTtcblxuICAgIHByaXZhdGUgZ2V0UnVuKCkge1xuICAgICAgICB0aGlzLnNlcnZpY2UuZ2V0UnVuKHRoaXMuaWQpLnRoZW4odGhpcy5zdWNjZXNzKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBzdWNjZXNzID0gKHJlcykgPT4ge1xuICAgICAgICB0aGlzLnJ1biA9IHJlcy5kYXRhO1xuICAgIH07XG59XG5cbmludGVyZmFjZSBJUnVuc1Njb3BlIGV4dGVuZHMgbmcuSVNjb3BlIHtcbiAgICBuZXdSdW5Gb3JtOiBuZy5JRm9ybUNvbnRyb2xsZXI7XG59XG5cbi8qKlxuICogQ29udHJvbGxlciByZXNwb25zaWJsZSBmb3IgbGlzdCBvZiB0ZXN0IHJ1bnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBSdW5zQ29udHJvbGxlciBpbXBsZW1lbnRzIG5nLklDb250cm9sbGVyIHtcbiAgICBwdWJsaWMgcnVucyA9IHt9O1xuICAgIHB1YmxpYyBjb3VudCA9IDA7XG5cbiAgICAvLyBUYWJsZSBwcm9wZXJ0aWVzXG4gICAgcHVibGljIHF1ZXJ5ID0ge1xuICAgICAgICBsaW1pdDogNSxcbiAgICAgICAgcGFnZTogMSxcbiAgICB9O1xuICAgIHB1YmxpYyBwcm9taXNlO1xuICAgIHB1YmxpYyBzZWxlY3RlZCA9IFtdO1xuICAgIHB1YmxpYyBhdXRvUmVmcmVzaCA9IGZhbHNlO1xuICAgIHByaXZhdGUgYXV0b1JlZnJlc2hSYXRlID0gNTAwMDtcbiAgICBwcml2YXRlIHRpbWVyID0gbnVsbDtcblxuICAgIC8vIEFkZCBydW4gZm9ybSBwcm9wZXJ0aWVzXG4gICAgcHVibGljIGZvcm1EYXRhID0ge307XG4gICAgcHVibGljIGVycm9ycyA9IHt9O1xuXG4gICAgc3RhdGljICRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnVGVzdGx5U2VydmljZSddO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSAkc2NvcGU6IElSdW5zU2NvcGUsIHByaXZhdGUgJGxvY2F0aW9uLCBwcml2YXRlIHNlcnZpY2U6IFRlc3RseVNlcnZpY2UpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0luaXRpYXRlZCBSdW5zQ29udHJvbGxlcicpO1xuICAgICAgICB0aGlzLmdldFJ1bnMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHJ1bnMgZnJvbSBiYWNrZW5kXG4gICAgICovXG4gICAgcHVibGljIGdldFJ1bnMgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvbWlzZSA9IHRoaXMuc2VydmljZS5nZXRSdW5zKHRoaXMucXVlcnkpLnRoZW4odGhpcy5nZXRSdW5zU3VjY2Vzcyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE5hdmlnYXRlcyB0byBhIHNwZWNpZmljIHJ1blxuICAgICAqIEBwYXJhbSBydW5cbiAgICAgKi9cbiAgICBwdWJsaWMgb25TZWxlY3QgPSAocnVuKSA9PiB7XG4gICAgICAgIHRoaXMuJGxvY2F0aW9uLnVybChgL3J1bi8ke3J1bi5pZH1gKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIHJ1blxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRSdW4oKSB7XG4gICAgICAgIGlmICh0aGlzLiRzY29wZS5uZXdSdW5Gb3JtLiR2YWxpZCkge1xuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLmFkZFJ1bih0aGlzLmZvcm1EYXRhKS50aGVuKHRoaXMuYWRkUnVuU3VjY2VzcywgdGhpcy5hZGRSdW5GYWlsdXJlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgYWRkIHJ1biBmb3JtXG4gICAgICovXG4gICAgcHVibGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLiRzY29wZS5uZXdSdW5Gb3JtLiRzZXRQcmlzdGluZSgpO1xuICAgICAgICB0aGlzLiRzY29wZS5uZXdSdW5Gb3JtLiRzZXRVbnRvdWNoZWQoKTtcbiAgICAgICAgdGhpcy5mb3JtRGF0YSA9IHt9O1xuICAgICAgICB0aGlzLmVycm9ycyA9IHt9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGVzIHJ1bnMgdGFibGUgYXV0byByZWZyZXNoXG4gICAgICovXG4gICAgcHVibGljIHRvZ2dsZVB1bGxpbmcoKSB7XG4gICAgICAgIGlmICghdGhpcy50aW1lcikge1xuICAgICAgICAgICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKCgpID0+IHRoaXMuZ2V0UnVucygpLCB0aGlzLmF1dG9SZWZyZXNoUmF0ZSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwcml2YXRlIGdldFJ1bnNTdWNjZXNzID0gKHJlcykgPT4ge1xuICAgICAgICB0aGlzLnJ1bnMgPSByZXMuZGF0YS5yZXN1bHRzO1xuICAgICAgICB0aGlzLmNvdW50ID0gcmVzLmRhdGEuY291bnQ7XG4gICAgfTtcblxuICAgIHByaXZhdGUgYWRkUnVuU3VjY2VzcyA9IChyZXMpID0+IHtcbiAgICAgICAgdGhpcy5lcnJvcnMgPSB7fTtcbiAgICAgICAgdGhpcy5nZXRSdW5zKCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgYWRkUnVuRmFpbHVyZSA9IChyZXMpID0+IHtcbiAgICAgICAgdGhpcy5lcnJvcnMgPSByZXMuZGF0YTtcbiAgICB9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FwcC9tb2R1bGVzL3Rlc3RseS90ZXN0bHkuY29udHJvbGxlcnMudHMiLCJkZWNsYXJlIGNvbnN0IEFQSV9VUkw7XG5cbi8qKlxuICogVGVzdGx5U2VydmljZVxuICogUmVzcG9uc2libGUgZm9yIGNvbW11bmljYXRpb24gYmV0d2VlbiBmcm9udGVuZCBhbmQgYmFja2VuZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFRlc3RseVNlcnZpY2Uge1xuICAgIHB1YmxpYyBhc3NldHMgPSB7fTtcblxuICAgIHN0YXRpYyAkaW5qZWN0ID0gWyckaHR0cCddO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuZ2V0QXNzZXRzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHVibGljIG1ldGhvZHNcbiAgICAgKi9cblxuICAgIHB1YmxpYyBnZXRBc3NldHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRodHRwLmdldChgJHtBUElfVVJMfS9hc3NldHNgKVxuICAgICAgICAgICAgLnRoZW4oKHJlcykgPT4gdGhpcy5hc3NldHMgPSByZXMuZGF0YSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFJ1bnMocXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGh0dHAuZ2V0KGAke0FQSV9VUkx9L3J1bnNgLCB7cGFyYW1zOiBxdWVyeX0pXG4gICAgICAgICAgICAudGhlbigocmVzKSA9PiB0aGlzLmhhbmRsZVJ1bnNSZXNwb25zZShyZXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0UnVuKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRodHRwLmdldChgJHtBUElfVVJMfS9ydW5zLyR7aWR9YClcbiAgICAgICAgICAgIC50aGVuKChyZXMpID0+IHRoaXMuaGFuZGxlUnVuUmVzcG9uc2UocmVzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZFJ1bihkYXRhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRodHRwLnBvc3QoYCR7QVBJX1VSTH0vcnVuc2AsIGRhdGEpXG4gICAgICAgICAgICAudGhlbigocmVzKSA9PiB0aGlzLmhhbmRsZVJ1blJlc3BvbnNlKHJlcykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByaXZhdGUgbWV0aG9kc1xuICAgICAqL1xuXG4gICAgcHJpdmF0ZSBoYW5kbGVSdW5zUmVzcG9uc2UocmVzKSB7XG4gICAgICAgIHJlcy5kYXRhLnJlc3VsdHMuZm9yRWFjaCgocnVuKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlZm9ybWF0UnVuKHJ1bik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVSdW5SZXNwb25zZShyZXMpIHtcbiAgICAgICAgdGhpcy5yZWZvcm1hdFJ1bihyZXMuZGF0YSk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWZvcm1hdFJ1bihydW4pIHtcbiAgICAgICAgcnVuLmludGVyZmFjZV9kaXNwbGF5ID0gdGhpcy5hc3NldHNbJ2ludGVyZmFjZXMnXVtydW4uaW50ZXJmYWNlXTtcbiAgICAgICAgcnVuLnN0YXR1c19kaXNwbGF5ID0gdGhpcy5hc3NldHNbJ3N0YXR1c2VzJ11bcnVuLnN0YXR1c107XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FwcC9tb2R1bGVzL3Rlc3RseS90ZXN0bHkuc2VydmljZXMudHMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbmd1bGFyLW1hdGVyaWFsLWRhdGEtdGFibGUvZGlzdC9tZC1kYXRhLXRhYmxlLmNzc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYW5ndWxhci1tYXRlcmlhbC9hbmd1bGFyLW1hdGVyaWFsLm1pbi5jc3Ncbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=