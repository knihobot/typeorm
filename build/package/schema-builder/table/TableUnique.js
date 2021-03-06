"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableUnique = void 0;
var tslib_1 = require("tslib");
/**
 * Database's table unique constraint stored in this class.
 */
var TableUnique = /** @class */ (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function TableUnique(options) {
        /**
         * Columns that contains this constraint.
         */
        this.columnNames = [];
        this.name = options.name;
        this.columnNames = options.columnNames;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a new copy of this constraint with exactly same properties.
     */
    TableUnique.prototype.clone = function () {
        return new TableUnique({
            name: this.name,
            columnNames: (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(this.columnNames), false)
        });
    };
    // -------------------------------------------------------------------------
    // Static Methods
    // -------------------------------------------------------------------------
    /**
     * Creates unique from the unique metadata object.
     */
    TableUnique.create = function (uniqueMetadata) {
        return new TableUnique({
            name: uniqueMetadata.name,
            columnNames: uniqueMetadata.columns.map(function (column) { return column.databaseName; })
        });
    };
    return TableUnique;
}());
exports.TableUnique = TableUnique;

//# sourceMappingURL=TableUnique.js.map
