import es from "./es";
import en from "./en";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
];

const storedLanguage = localStorage.getItem("language");
var language = storedLanguage ? storedLanguage : null;
if (!language) {
  language = navigator.language.startsWith("es") ? "es" : "en";
  localStorage.setItem("language", language);
}

const texts = {
  es,
  en,
};

export const t = texts[language];
export { languages };

export default texts;