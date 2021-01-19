const log = console.log.bind(console);

const e = (selector) => document.querySelector(selector);

const es = (selector) => document.querySelectorAll(selector);

const bindEvent = (element, eventName, callback) => {
  element.addEventListener(eventName, callback);
};

const openUrl = (title) => {
  const page = encodeURIComponent(title);
  const url = `${Config.api}wiki/${page}`;
  window.open(url, "_blank");
};

const switchLanguages = (lg) => {
  Config.language = lg;
  Config.api = `https://${lg}.wikipedia.org/`;

  switch (lg) {
    case "en":
      activeLanguage.innerText = "English";
      searchButton.innerText = "Search";
      input.placeholder = "Search Wikipedia...";
      break;
    case "zh":
      activeLanguage.innerText = "中文";
      searchButton.innerText = "搜索";
      input.placeholder = "搜索维基百科...";
      break;
    default:
      break;
  }
};
