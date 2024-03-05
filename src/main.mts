import {
  argbFromHex,
  themeFromSourceColor,
  applyTheme,
} from "@material/material-color-utilities"
import "@material/web/button/filled-button.js"
import "@material/web/textfield/filled-text-field.js"
import "@material/web/textfield/outlined-text-field.js"

enum TrafficLightStage {
  RED, // Stop
  RED_AND_AMBER, // Prepare to go
  GREEN, // Go
  AMBER, // Stop if you can do so safely
}

class TrafficLightController {
  private stage: TrafficLightStage = TrafficLightStage.RED
  private element: HTMLElement

  constructor(element: HTMLElement) {
    this.element = element
    this.render()
  }

  private setLights(lightValues: {
    red: boolean
    amber: boolean
    green: boolean
  }) {
    Object.entries(lightValues).forEach(([color, value]) => {
      const lightElement = this.element.querySelector<HTMLElement>(
        `.traffic-light-${color}`
      )
      if (lightElement) {
        value
          ? (lightElement.dataset.active = "true")
          : delete lightElement.dataset.active
      }
    })
  }

  render() {
    const stage = this.getStage()
    if (stage == TrafficLightStage.RED)
      return this.setLights({ red: true, amber: false, green: false })
    if (stage == TrafficLightStage.RED_AND_AMBER)
      return this.setLights({ red: true, amber: true, green: false })
    if (stage == TrafficLightStage.GREEN)
      return this.setLights({ red: false, amber: false, green: true })
    if (stage == TrafficLightStage.AMBER)
      return this.setLights({ red: false, amber: true, green: false })
    throw new Error(`Unhandled traffic light stage: ${stage}`)
  }

  nextStage() {
    const totalStages = Object.keys(TrafficLightStage).length / 2
    const currentStage = this.stage
    const nextStage = (currentStage + 1) % totalStages
    this.setStage(nextStage)
  }

  setStage(stage: TrafficLightStage) {
    this.stage = stage
    this.render()
  }

  getStage() {
    return this.stage
  }
}

function updateMaterialColors(baseColor: string) {
  const theme = themeFromSourceColor(argbFromHex(baseColor))
  applyTheme(theme, { target: document.body, dark: systemDark.matches })
}

// Material color theme
const DEFAULT_TMEME_COLOR = "#cc3232"
const systemDark = window.matchMedia("(prefers-color-scheme: dark)")
updateMaterialColors(DEFAULT_TMEME_COLOR)
systemDark.addEventListener("change", () =>
  updateMaterialColors(DEFAULT_TMEME_COLOR)
)

function onFormSubmit(event: SubmitEvent) {
  event.preventDefault()

  const form = event.target as HTMLFormElement
  const formData = new FormData(form)
  console.log(formData)
}

function setupForm() {
  const form = document.querySelector<HTMLFormElement>("form.data-collection")!
  form.addEventListener("submit", onFormSubmit)
}

const trafficLightElement = document.querySelector<HTMLElement>(
  ".traffic-light-graphic"
)!
const trafficLights = new TrafficLightController(trafficLightElement)
trafficLightElement.addEventListener("click", () => trafficLights.nextStage())

setupForm()

const themeColorInput =
  document.querySelector<HTMLInputElement>(".theme-color-input")!
themeColorInput.value = DEFAULT_TMEME_COLOR
themeColorInput.addEventListener("input", () => {
  updateMaterialColors(themeColorInput.value)
})
