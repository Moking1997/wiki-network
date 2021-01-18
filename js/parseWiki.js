const domParser = new DOMParser();

const getPageTitle = (url) =>
  url
    .split("/")
    .filter((el) => el)
    .pop()
    .split("#")[0];

const isArticle = (name) =>
  !(name.endsWith(":") ? name.slice(0, -1) : name).includes(":");

const getFirstParagraph = (element) => {
  return Array.from(
    element.querySelectorAll(".mw-parser-output > p:not(.mw-empty-elt)")
  ).find((p) => !p.querySelector("#coordinates"));
};

const getPageData = function (page) {
  const url = `${Config.api}w/api.php?format=json&origin=*&action=parse&prop=text&section=0&redirects=1&page=${page}`;
  return fetch(url).then((response) => response.json());
};

const parseWikiData = function (res) {
  if (res.error) {
    log(res.error.code);
    pageContainer.innerHTML = "";
    return [];
  } else {
    const doc = domParser.parseFromString(res.parse.text["*"], "text/html");
    let firstParagraph = getFirstParagraph(doc);

    // toggle description
    showDescription(firstParagraph);

    links = Array.from(firstParagraph.querySelectorAll("a"))
      .map((link) => link.getAttribute("href"))
      .filter((href) => href && href.startsWith("/wiki/"))
      .map(getPageTitle)
      .filter(isArticle)
      .map((title) => title.replace(/_/g, " "));
    return links;
  }
};

const getLinks = function (page) {
  return getPageData(page).then((res) => parseWikiData(res));
};

const showDescription = function (firstParagraph) {
  pageContainer.innerHTML = "";
  pageContainer.appendChild(firstParagraph);
  const aLinks = es("a");
  for (let index = 0; index < aLinks.length; index++) {
    const el = aLinks[index];
    const title = el.title;
    const href = el.getAttribute("href");
    if (href.startsWith("/wiki/")) {
      bindEvent(el, "click", (e) => {
        e.preventDefault();
        openUrl(title);
      });
      bindEvent(el, "mouseenter", () => {
        activeNetworkHover(title.toLowerCase());
      });
      bindEvent(el, "mouseleave", () => {
        clearNetworkHover();
      });
    }
  }
};
