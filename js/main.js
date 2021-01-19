const input = e(".search-input");
const searchButton = e(".search-button");
const pageContainer = e("#page-container");

const activeLanguage = e(".search-language-active");
const languages = es(".search-language-item");

function __main() {
  initNetWork();

  for (const element of languages) {
    const lg = element.dataset.lg;
    bindEvent(element, "click", () => {
      Config.api = `https://${lg}.wikipedia.org/`;
      switchLanguages(lg);
    });
  }

  bindEvent(searchButton, "click", () => {
    clearNetwork();
    searchNetwork(input.value);
    addNodes(input.value, 0);
  });
}

__main();
