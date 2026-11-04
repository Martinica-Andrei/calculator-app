import BigNumber from "bignumber.js";

export enum Operator {
    Plus,
    Minus,
    Multiplication,
    Division,
    Equal,
    Delete,
    Reset
}

const stringToOperatorMap = new Map<string, Operator>([
    ["+", Operator.Plus],
    ["-", Operator.Minus],
    ["x", Operator.Multiplication],
    ["/", Operator.Division],
    ["=", Operator.Equal],
    ["del", Operator.Delete],
    ["reset", Operator.Reset],
])

const operatorToFuncMap = new Map<Operator, (a: BigNumber, b: BigNumber) => BigNumber>([
    [Operator.Plus, (a, b) => a.plus(b)],
    [Operator.Minus, (a, b) => a.minus(b)],
    [Operator.Multiplication, (a, b) => a.multipliedBy(b)],
    [Operator.Division, (a, b) => a.dividedBy(b)],
]);

export class Calculator {
    private static readonly _numberRegex = /^[+\-]?(?:([1-9]+\d*)|0?(?!\d))\.?\d*$/;
    private readonly _numbers: [string, string] = ["", ""];
    private _activeNumberIndex: number = 0;
    private _operator: Operator | null = null;

    constructor() {
        this.reset();
    }

    public input(value: string) {
        const operator = stringToOperatorMap.get(value);

        if (operator != undefined) {
            if ([Operator.Plus, Operator.Minus].includes(operator) && this._numbers[0].length === 0) {
                this._numbers[0] = value;
                return;
            }
            this.handleOperator(operator);
            return;
        }

        let newNumber: string;
        if (this.activeNumber === "0" && value !== ".") {
            newNumber = value;
        }
        else {
            newNumber = this.activeNumber + value;
        }
        if (this.isNumberInvalid(newNumber)) {
            return;
        }

        this._numbers[this._activeNumberIndex] = newNumber;
    }

    public get numbers() {
        return [...this._numbers];
    }

    public get operator() {
        return this._operator;
    }

    private get activeNumber() {
        return this._numbers[this._activeNumberIndex];
    }

    private isNumberInvalid(number: string) {
        return !Calculator._numberRegex.test(number) || Number.isNaN(parseFloat(number));
    }

    private handleOperator(operator: Operator) {
        switch (operator) {
            case Operator.Plus:
            case Operator.Minus:
            case Operator.Multiplication:
            case Operator.Division:
                this.handleNormalOperator(operator);
                break;
            case Operator.Reset:
                this.reset();
                break;
            case Operator.Delete:
                this.removeLastCharFromActiveNumber();
                break;
            case Operator.Equal:
                this.handleEqualOperator();
                break;
        }
    }

    private handleNormalOperator(operator: Operator) {
        if (this._activeNumberIndex > 0 || this.activeNumber.length === 0 || this.isNumberInvalid(this.activeNumber)) {
            return;
        }
        this._operator = operator;
        this._activeNumberIndex = 1;
    }

    private reset() {
        for (let i = 0; i < this._numbers.length; i++) {
            this._numbers[i] = "";
        }

        this._activeNumberIndex = 0;
        this._operator = null;
    }

    private removeLastCharFromActiveNumber() {
        if (this.activeNumber.length > 0) {
            this._numbers[this._activeNumberIndex] = this.activeNumber.slice(0, this.activeNumber.length - 1);
        }
        else {
            this._activeNumberIndex = 0;
            this._operator = null;
        }
    }

    private handleEqualOperator() {
        if (this._numbers[1].length === 0) {
            return;
        }
        
        const [a, b] = this._numbers.map((n) => new BigNumber(n));
        const result = operatorToFuncMap.get(this._operator!)!(a, b);
        this.reset();
        this._numbers[0] = result.isFinite() ? result.toFixed() : "";
    }
}