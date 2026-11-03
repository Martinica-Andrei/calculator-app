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
}

function updateUI() {
    const numbers = calculator.numbers;
    const operator = calculator.operator;

    operand1El.textContent = processNumber(numbers[0]) + convertOperatorToString(operator);
    operand2El.textContent = processNumber(numbers[1]);

    if (operator == null){
        operand1El.classList.add("large-operand");
        operand2El.classList.remove("large-operand");
    }
    else{
        operand1El.classList.remove("large-operand");
        operand2El.classList.add("large-operand");
    }

    operand1El.scrollLeft = Number.MAX_SAFE_INTEGER;
    operand2El.scrollLeft = Number.MAX_SAFE_INTEGER;
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

function processNumber(number : string){
    return number.replace(".", ",");
}