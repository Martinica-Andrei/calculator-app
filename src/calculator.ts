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

const operatorToFuncMap = new Map<Operator, typeof add>([
    [Operator.Plus, add],
    [Operator.Minus, subtract],
    [Operator.Multiplication, multiply],
    [Operator.Division, divide],
]);

export class Calculator {
    private static readonly _numberRegex = /^(?:([1-9]+\d*)|0?(?!\d))\.?\d*$/;
    private readonly _numbers: [string, string] = ["", ""];
    private _activeNumberIndex: number = 0;
    private _operator: Operator | null = null;

    constructor() {
        this.reset();
    }

    public input(value: string) {
        const operator = stringToOperatorMap.get(value);

        if (operator != undefined) {
            this.handleOperator(operator);
            return;
        }

        const newNumber = this.activeNumber + value;
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
        return !Calculator._numberRegex.test(number);
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
        this._numbers[this._activeNumberIndex] = this.activeNumber.slice(0, this.activeNumber.length - 1);
    }

    private handleEqualOperator() {
        if (this._activeNumberIndex === 0) {
            return;
        }

        const [a, b] = this._numbers.map(parseFloat);
        const operation = operatorToFuncMap.get(this._operator!)!;

        const result = operation(a, b).toString();

        this.reset();
        this._numbers[0] = result;
    }
}

function add(a: number, b: number) {
    return a + b;
}

function subtract(a: number, b: number) {
    return a - b;
}

function multiply(a: number, b: number) {
    return a * b;
}

function divide(a: number, b: number) {
    return a / b;
}