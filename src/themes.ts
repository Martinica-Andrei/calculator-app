export enum Theme {
    First,
    Second,
    Third
}

const themeClasses = ["theme-1", "theme-2", "theme-3"];

export function setTheme(theme: Theme): void {
    removeThemes();
    const themeClass = themeClasses[theme];
    document.body.classList.add(themeClass);
}

function removeThemes(){
    themeClasses.forEach(themeClass => document.body.classList.remove(themeClass));
}