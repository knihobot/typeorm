"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationGenerateCommand = void 0;
var tslib_1 = require("tslib");
var ConnectionOptionsReader_1 = require("../connection/ConnectionOptionsReader");
var CommandUtils_1 = require("./CommandUtils");
var globals_1 = require("../globals");
var StringUtils_1 = require("../util/StringUtils");
var chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
var sqlFormatter_1 = require("@sqltools/formatter/lib/sqlFormatter");
/**
 * Generates a new migration file with sql needs to be executed to update schema.
 */
var MigrationGenerateCommand = /** @class */ (function () {
    function MigrationGenerateCommand(connection) {
        this.command = "migration:generate";
        this.describe = "Generates a new migration file with sql needs to be executed to update schema.";
        this.aliases = "migrations:generate";
        this.connection = connection;
    }
    MigrationGenerateCommand.prototype.builder = function (args) {
        return args
            .option("c", {
            alias: "connection",
            default: "default",
            describe: "Name of the connection on which run a query."
        })
            .option("n", {
            alias: "name",
            describe: "Name of the migration class.",
            demand: true,
            type: "string"
        })
            .option("d", {
            alias: "dir",
            describe: "Directory where migration should be created."
        })
            .option("p", {
            alias: "pretty",
            type: "boolean",
            default: false,
            describe: "Pretty-print generated SQL",
        })
            .option("f", {
            alias: "config",
            default: "ormconfig",
            describe: "Name of the file with connection configuration."
        })
            .option("o", {
            alias: "outputJs",
            type: "boolean",
            default: false,
            describe: "Generate a migration file on Javascript instead of Typescript",
        })
            .option("dr", {
            alias: "dryrun",
            type: "boolean",
            default: false,
            describe: "Prints out the contents of the migration instead of writing it to a file",
        })
            .option("ch", {
            alias: "check",
            type: "boolean",
            default: false,
            describe: "Verifies that the current database is up to date and that no migrations are needed. Otherwise exits with code 1.",
        });
    };
    MigrationGenerateCommand.prototype.handler = function (args) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var timestamp, extension, filename, directory, connectionOptionsReader, connectionOptions, err_1, connectionOptionsReader, connectionOptions, upSqls_1, downSqls_1, connection, _a, sqlInMemory, fileContent, path, err_2;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (args._[0] === "migrations:generate") {
                            console.log("'migrations:generate' is deprecated, please use 'migration:generate' instead");
                        }
                        timestamp = new Date().getTime();
                        extension = args.outputJs ? ".js" : ".ts";
                        filename = timestamp + "-" + args.name + extension;
                        directory = args.dir;
                        if (!!directory) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        connectionOptionsReader = new ConnectionOptionsReader_1.ConnectionOptionsReader({
                            root: process.cwd(),
                            configName: args.config
                        });
                        return [4 /*yield*/, connectionOptionsReader.get(args.connection)];
                    case 2:
                        connectionOptions = _b.sent();
                        directory = connectionOptions.cli ? connectionOptions.cli.migrationsDir : undefined;
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        _b.trys.push([4, 17, , 18]);
                        connectionOptionsReader = new ConnectionOptionsReader_1.ConnectionOptionsReader({
                            root: process.cwd(),
                            configName: args.config
                        });
                        return [4 /*yield*/, connectionOptionsReader.get(args.connection)];
                    case 5:
                        connectionOptions = _b.sent();
                        Object.assign(connectionOptions, {
                            synchronize: false,
                            migrationsRun: false,
                            dropSchema: false,
                            logging: false
                        });
                        upSqls_1 = [], downSqls_1 = [];
                        if (!this.connection) return [3 /*break*/, 6];
                        _a = this.connection;
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, (0, globals_1.createConnection)(connectionOptions)];
                    case 7:
                        _a = _b.sent();
                        _b.label = 8;
                    case 8:
                        connection = _a;
                        _b.label = 9;
                    case 9:
                        _b.trys.push([9, , 11, 13]);
                        return [4 /*yield*/, connection.driver.createSchemaBuilder().log()];
                    case 10:
                        sqlInMemory = _b.sent();
                        if (args.pretty) {
                            sqlInMemory.upQueries.forEach(function (upQuery) {
                                upQuery.query = MigrationGenerateCommand.prettifyQuery(upQuery.query);
                            });
                            sqlInMemory.downQueries.forEach(function (downQuery) {
                                downQuery.query = MigrationGenerateCommand.prettifyQuery(downQuery.query);
                            });
                        }
                        sqlInMemory.upQueries.forEach(function (upQuery) {
                            upSqls_1.push("        await queryRunner.query(`" + upQuery.query.replace(new RegExp("`", "g"), "\\`") + "`" + MigrationGenerateCommand.queryParams(upQuery.parameters) + ");");
                        });
                        sqlInMemory.downQueries.forEach(function (downQuery) {
                            downSqls_1.push("        await queryRunner.query(`" + downQuery.query.replace(new RegExp("`", "g"), "\\`") + "`" + MigrationGenerateCommand.queryParams(downQuery.parameters) + ");");
                        });
                        return [3 /*break*/, 13];
                    case 11: return [4 /*yield*/, connection.close()];
                    case 12:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 13:
                        if (!upSqls_1.length) {
                            if (args.check) {
                                console.log(chalk_1.default.green("No changes in database schema were found"));
                                process.exit(0);
                            }
                            else {
                                console.log(chalk_1.default.yellow("No changes in database schema were found - cannot generate a migration. To create a new empty migration use \"typeorm migration:create\" command"));
                                process.exit(1);
                            }
                        }
                        else if (!args.name) {
                            console.log(chalk_1.default.yellow("Please specify a migration name using the `-n` argument"));
                            process.exit(1);
                        }
                        fileContent = args.outputJs ?
                            MigrationGenerateCommand.getJavascriptTemplate(args.name, timestamp, upSqls_1, downSqls_1.reverse()) :
                            MigrationGenerateCommand.getTemplate(args.name, timestamp, upSqls_1, downSqls_1.reverse());
                        if (directory && !directory.startsWith("/")) {
                            directory = process.cwd() + "/" + directory;
                        }
                        path = (directory ? (directory + "/") : "") + filename;
                        if (args.check) {
                            console.log(chalk_1.default.yellow("Unexpected changes in database schema were found in check mode:\n\n" + chalk_1.default.white(fileContent)));
                            process.exit(1);
                        }
                        if (!args.dryrun) return [3 /*break*/, 14];
                        console.log(chalk_1.default.green("Migration " + chalk_1.default.blue(path) + " has content:\n\n" + chalk_1.default.white(fileContent)));
                        return [3 /*break*/, 16];
                    case 14: return [4 /*yield*/, CommandUtils_1.CommandUtils.createFile(path, fileContent)];
                    case 15:
                        _b.sent();
                        console.log(chalk_1.default.green("Migration " + chalk_1.default.blue(path) + " has been generated successfully."));
                        _b.label = 16;
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        err_2 = _b.sent();
                        console.log(chalk_1.default.black.bgRed("Error during migration generation:"));
                        console.error(err_2);
                        process.exit(1);
                        return [3 /*break*/, 18];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Protected Static Methods
    // -------------------------------------------------------------------------
    /**
     * Formats query parameters for migration queries if parameters actually exist
     */
    MigrationGenerateCommand.queryParams = function (parameters) {
        if (!parameters || !parameters.length) {
            return "";
        }
        return ", " + JSON.stringify(parameters);
    };
    /**
     * Gets contents of the migration file.
     */
    MigrationGenerateCommand.getTemplate = function (name, timestamp, upSqls, downSqls) {
        var migrationName = "" + (0, StringUtils_1.camelCase)(name, true) + timestamp;
        return "import {MigrationInterface, QueryRunner} from \"typeorm\";\n\nexport class " + migrationName + " implements MigrationInterface {\n    name = '" + migrationName + "'\n\n    public async up(queryRunner: QueryRunner): Promise<void> {\n" + upSqls.join("\n") + "\n    }\n\n    public async down(queryRunner: QueryRunner): Promise<void> {\n" + downSqls.join("\n") + "\n    }\n\n}\n";
    };
    /**
     * Gets contents of the migration file in Javascript.
     */
    MigrationGenerateCommand.getJavascriptTemplate = function (name, timestamp, upSqls, downSqls) {
        var migrationName = "" + (0, StringUtils_1.camelCase)(name, true) + timestamp;
        return "const { MigrationInterface, QueryRunner } = require(\"typeorm\");\n\nmodule.exports = class " + migrationName + " {\n    name = '" + migrationName + "'\n\n    async up(queryRunner) {\n" + upSqls.join("\n") + "\n    }\n\n    async down(queryRunner) {\n" + downSqls.join("\n") + "\n    }\n}\n";
    };
    /**
     *
     */
    MigrationGenerateCommand.prettifyQuery = function (query) {
        var formattedQuery = (0, sqlFormatter_1.format)(query, { indent: "    " });
        return "\n" + formattedQuery.replace(/^/gm, "            ") + "\n        ";
    };
    return MigrationGenerateCommand;
}());
exports.MigrationGenerateCommand = MigrationGenerateCommand;

//# sourceMappingURL=MigrationGenerateCommand.js.map
