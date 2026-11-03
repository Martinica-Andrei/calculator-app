export enum Theme {
    First = "theme-1",
    Second = "theme-2",
    Third = "theme-3"
}

export function setTheme(theme: Theme): void {
    removeThemes();
    document.body.classList.add(theme);
}

function removeThemes(){
    Object.values(Theme).forEach(themeClass => document.body.classList.remove(themeClass));
}