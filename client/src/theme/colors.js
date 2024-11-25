const customColors = {
  main: "#005878",
  mainAlpha: "#00587824",
  red: "#D32F2F",
  redAlpha: "#FDECEA",
  green: "#2E8B57",
  greenAlpha: "#E6FAF1",
  blue: "#1E90FF",
  blueAlpha: "#A9C9FF",
  yellow: "#FF8C00",
  yellowAlpha: "#FFFAE6",
  purple: "#6A5ACD",
  purpleAlpha: "#EFE6FF",
  default: "#333",
  defaultAlpha: "#F5F5F5",
};

const colorCombinations = {
  red: {
    color: customColors.red,
    backgroundColor: customColors.redAlpha,
  },
  green: {
    color: customColors.green,
    backgroundColor: customColors.greenAlpha,
  },
  blue: {
    color: customColors.blue,
    backgroundColor: customColors.blueAlpha,
  },
  yellow: {
    color: customColors.yellow,
    backgroundColor: customColors.yellowAlpha,
  },
  purple: {
    color: customColors.purple,
    backgroundColor: customColors.purpleAlpha,
  },
  main: {
    color: customColors.main,
    backgroundColor: customColors.mainAlpha,
  },
  default: {
    color: customColors.default,
    backgroundColor: customColors.defaultAlpha,
  },
};

const palette = {
  primary: {
    main: "#005878",
    light: "#00587824",
    dark: "#004660",
    contrastText: "#ffffff",
  },
  background: {
    default: "#EEF3F6",
  },
  common: {
    black: "#000000",
    white: "#FFFFFF",
  },
  borderColor: {
    main: "#e8ebee",
  },
};

export { customColors, colorCombinations, palette };
