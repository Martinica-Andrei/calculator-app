import { Calculator, Operator } from "./calculator";
import { $ } from "./querySelectors";

const operand1El = $("#operand-1")!;
const operand2El = $("#operand-2")!;
const buttonsEl = $("#buttons")!;

const calculator = new Calculator();

const operatorToStringMap = new Map<Operator, string>([
    [Operator.Plus, "+"],
    [Operator.Minus, "-"],
    [Operator.Multiplication, "x"],
    [Operator.Division, "/"],
]);

export function initCalculatorUI() {
    buttonsEl.addEventListener("click", e => {
        if (e.target instanceof HTMLButtonElement) {
            const button = e.target as HTMLButtonElement;
            calculator.input(button.textContent);
            updateUI();
        }
    });

    document.addEventListener("keydown", e => {
        const key = filterKey(e.key);
        if (key != undefined){
            calculator.input(key);
            updateUI();
            e.preventDefault();
        }
    });
}

function updateUI() {
    const numbers = calculator.numbers;
    const operator = calculator.operator;

    operand1El.textContent = processNumber(numbers[0]) + convertOperatorToString(operator);
    operand2El.textContent = processNumber(numbers[1]);

    if (operator == null) {
        operand1El.classList.add("large-operand");
        operand2El.classList.remove("large-operand");
    }
    else {
        operand1El.classList.remove("large-operand");
        operand2El.classList.add("large-operand");
    }

    operand1El.parentElement!.scrollLeft = Number.MAX_SAFE_INTEGER;
}

function convertOperatorToString(operator: Operator | null): string {
    if (operator == null) {
        return "";
    }

    const str = operatorToStringMap.get(operator);
    if (str == null) {
        return "";
    }

    return " " + str;
}

function processNumber(number: string) {
    const [whole, fraction] = number.split(".");
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return fraction === undefined ? grouped : `${grouped}.${fraction}`;
}

function filterKey(key: string): string | undefined {
    const validDirectKeys = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "x", "/", "=", "."]);
    const validMappedKeys = new Map<string, string>([
        ["*", "x"],
        ["Backspace", "del"],
        ["Escape", "reset"],
        ["Enter", "="]
    ]);

    if (validDirectKeys.has(key)){
        return key;
    }

    return validMappedKeys.get(key);
}