import { __awaiter, __generator } from "tslib";
/**
 * Broadcaster execution result - promises executed by operations and number of executed listeners and subscribers.
 */
var BroadcasterResult = /** @class */ (function () {
    function BroadcasterResult() {
        /**
         * Number of executed listeners and subscribers.
         */
        this.count = 0;
        /**
         * Promises returned by listeners and subscribers which needs to be awaited.
         */
        this.promises = [];
    }
    /**
     * Wait for all promises to settle
     */
    BroadcasterResult.prototype.wait = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.promises.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(this.promises)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this];
                }
            });
        });
    };
    return BroadcasterResult;
}());
export { BroadcasterResult };

//# sourceMappingURL=BroadcasterResult.js.map
