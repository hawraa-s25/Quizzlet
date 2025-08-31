import React from "react"
import ThemeContext from "./ThemeContext"
export default function ThemeProvider({children}){
    const [theme, setTheme]=React.useState("light")
    function toggleTheme(){
        setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"))
    }
    const value={theme, toggleTheme}
    return(
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}
