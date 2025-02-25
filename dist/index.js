"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ThrottleFetch = /** @class */ (function () {
    function ThrottleFetch(action) {
        var _this = this;
        // dirty 是用来节流请求的，flushing 是用来节流宏任务赋值操作的
        this.dirty = true;
        this.flushing = false;
        this.do = false;
        this.result = null;
        this.set = new Set();
        // act 的行为：
        // 1 - 不管在同步异步中都表现出仅返回同一个缓存值的行为；
        // 2 - 触发了refresh，之后的act值应该产生变化；
        // 3 - 用户定义的诸如click等渲染层事件触发了act，也会产生变化（因为上一次循环已经结束，dirty已经变成了true）
        this.act = function () { return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var res, error_1, excutor_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.dirty) return [3 /*break*/, 7];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        this.dirty = false;
                        if (!this.refreshAction.length) return [3 /*break*/, 3];
                        // 增加一个改变result的副作用
                        return [4 /*yield*/, this.clearRefreshStack()];
                    case 2:
                        // 增加一个改变result的副作用
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.currentAction()];
                    case 4:
                        res = _a.sent();
                        this.result = res;
                        _a.label = 5;
                    case 5:
                        this.do = true;
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        reject(error_1);
                        return [3 /*break*/, 7];
                    case 7:
                        if (!this.do) return [3 /*break*/, 9];
                        // 增加一个改变result的副作用，查看是否有refresh事件
                        return [4 /*yield*/, this.clearRefreshStack()
                            // 执行所有的异步任务
                        ];
                    case 8:
                        // 增加一个改变result的副作用，查看是否有refresh事件
                        _a.sent();
                        // 执行所有的异步任务
                        resolve(this.result);
                        // 执行所有的同步任务（节流一下，仅第一次会执行）
                        if (!this.flushing) {
                            this.flushing = true;
                            this.set.forEach(function (excutor) {
                                excutor(_this.result);
                            });
                        }
                        return [3 /*break*/, 10];
                    case 9:
                        excutor_1 = function (result) {
                            setTimeout(function () {
                                resolve(result);
                                _this.set.delete(excutor_1);
                                !_this.set.size && _this.reset();
                            });
                        };
                        this.set.add(excutor_1);
                        _a.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        }); }); };
        this.reset = function () {
            _this.do = false;
            _this.flushing = false;
            _this.dirty = true;
        };
        // 等待刷新的任务
        this.refreshAction = [];
        this.clearRefreshStack = function () { return __awaiter(_this, void 0, void 0, function () {
            var act, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.refreshAction.length) return [3 /*break*/, 2];
                        this.reset();
                        act = this.refreshAction.shift();
                        if (!act) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, act()];
                    case 1:
                        _a.result = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        // refresh的行为：但凡使用refresh都会reset dirty并触发act，改变后续act的值
        // 具体后续act是由哪个refresh触发的，看是外部调用是同步还是异步
        // 1.异步按照异步的顺序在后面的act必然是前面的act或是refresh的结果
        // 2.同步按照同步实际的执行，同一执行时间单位的，结果相同
        this.refresh = function () { return __awaiter(_this, void 0, void 0, function () {
            var act;
            return __generator(this, function (_a) {
                act = this.act;
                this.refreshAction.push(act);
                return [2 /*return*/, act()];
            });
        }); };
        this.currentAction = action;
    }
    return ThrottleFetch;
}());
exports.default = ThrottleFetch;
