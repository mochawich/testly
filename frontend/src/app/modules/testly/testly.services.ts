declare const API_URL;

/**
 * TestlyService
 * Responsible for communication between frontend and backend.
 */
export class TestlyService {
    public assets = {};

    static $inject = ['$http'];

    constructor(private $http: ng.IHttpService) {
        this.getAssets();
    }

    /**
     * Public methods
     */

    public getAssets() {
        return this.$http.get(`${API_URL}/assets`)
            .then((res) => this.assets = res.data);
    }

    public getRuns(query) {
        return this.$http.get(`${API_URL}/runs`, {params: query})
            .then((res) => this.handleRunsResponse(res));
    }

    public getRun(id) {
        return this.$http.get(`${API_URL}/runs/${id}`)
            .then((res) => this.handleRunResponse(res));
    }

    public addRun(data) {
        return this.$http.post(`${API_URL}/runs`, data)
            .then((res) => this.handleRunResponse(res));
    }

    /**
     * Private methods
     */

    private handleRunsResponse(res) {
        res.data.results.forEach((run) => {
            this.reformatRun(run);
        });
        return res
    }

    private handleRunResponse(res) {
        this.reformatRun(res.data);
        return res;
    }

    private reformatRun(run) {
        run.interface_display = this.assets['interfaces'][run.interface];
        run.status_display = this.assets['statuses'][run.status];
    }
}
