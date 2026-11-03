import { $ } from "./querySelectors";
import { setTheme, Theme } from "./themes";

const radioTheme1El = $<HTMLInputElement>("#theme-1")!;
const radioTheme2El = $<HTMLInputElement>("#theme-2")!;
const radioTheme3El = $<HTMLInputElement>("#theme-3")!;

export function initRadioThemes() {
    radioTheme1El.addEventListener("change", () => setTheme(Theme.First));
    radioTheme2El.addEventListener("change", () => setTheme(Theme.Second));
    radioTheme3El.addEventListener("change", () => setTheme(Theme.Third));

    radioTheme1El.checked = true;
    setTheme(Theme.First);
}