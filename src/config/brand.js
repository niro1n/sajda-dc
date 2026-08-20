const BRAND_COLOR = "#00BB97";
const BRAND_ICON = "https://imgur.com/LGjFKad.jpg";

function createBrandFooter(text) {
  return {
    text,
    iconURL: BRAND_ICON,
  };
}

module.exports = {
  BRAND_COLOR,
  BRAND_ICON,
  createBrandFooter,
};
