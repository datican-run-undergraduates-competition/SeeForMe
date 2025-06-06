import { Moon, Sun, Contrast } from "lucide-react"
import { useTheme } from "../context/theme-context"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <ToggleGroup type="single" value={theme} onValueChange={(value) => value && setTheme(value)}>
      <ToggleGroupItem value="light" aria-label="Light mode">
        <Sun className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark mode">
        <Moon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grayscale" aria-label="Grayscale mode">
        <Contrast className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
