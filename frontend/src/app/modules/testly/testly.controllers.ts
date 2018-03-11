import {TestlyService} from './testly.services';
import '../../../../node_modules/angular-material/angular-material.min.css';
import '../../../../node_modules/angular-material-data-table/dist/md-data-table.css';


/**
 * Controller responsible for a single test run.
 */
export class RunController implements ng.IController {
    public id;
    public run;
    public attrs = ['id', 'requested_by', 'status_display', 'created_at', 'path', 'environment', 'interface_display', 'logs'];
    private blockAttrs = ['path', 'logs'];

    static $inject = ['$scope', '$routeParams', 'TestlyService'];

    constructor(private $scope: ng.IScope, private $routeParams, private service: TestlyService) {
        if ($routeParams.runId) {
            this.id = $routeParams.runId;
            $scope.$watch('$viewContentLoaded', () => this.getRun());
        }
    }

    /**
     * Returns whether the attribute should be displayed as a block
     * @param attr
     * @returns {boolean}
     */
    public isBlockAttr(attr) {
        return this.blockAttrs.indexOf(attr) != -1;
    };

    private getRun() {
        this.service.getRun(this.id).then(this.success);
    };

    private success = (res) => {
        this.run = res.data;
    };
}


/**
 * Controller responsible for list of test runs.
 */
export class RunsController implements ng.IController {
    public runs = {};
    public count = 0;

    // Table properties
    public query = {
        limit: 5,
        page: 1,
    };
    public promise;
    public selected = [];
    public autoRefresh = false;
    private autoRefreshRate = 5000;
    private timer = null;

    // Add run form properties
    public formData = {};
    public errors = {};

    static $inject = ['$scope', '$location', 'TestlyService'];

    constructor(private $scope: ng.IScope, private $location, private service: TestlyService) {
        console.log('Initiated RunsController');
        this.getRuns();
    }

    /**
     * Fetches runs from backend
     */
    public getRuns = () => {
        this.promise = this.service.getRuns(this.query).then(this.getRunsSuccess);
    };

    /**
     * Navigates to a specific run
     * @param run
     */
    public onSelect = (run) => {
        this.$location.url(`/run/${run.id}`);
    };

    /**
     * Adds a run
     */
    public addRun() {
        if (this.$scope.newRunForm.$valid) {
            this.service.addRun(this.formData).then(this.addRunSuccess, this.addRunFailure);
        }
    };

    /**
     * Resets add run form
     */
    public reset() {
        this.$scope.newRunForm.$setPristine();
        this.$scope.newRunForm.$setUntouched();
        this.formData = {};
        this.errors = {};
    };

    /**
     * Toggles runs table auto refresh
     */
    public togglePulling() {
        if (!this.timer) {
            this.timer = setInterval(() => this.getRuns(), this.autoRefreshRate);

        } else {
            clearInterval(this.timer);
            this.timer = null;
        }
    };

    private getRunsSuccess = (res) => {
        this.runs = res.data.results;
        this.count = res.data.count;
    };

    private addRunSuccess = (res) => {
        this.errors = {};
        this.getRuns();
    };

    private addRunFailure = (res) => {
        this.errors = res.data;
    };
}
