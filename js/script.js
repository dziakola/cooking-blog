"use strict";
const templates = {
  articleLink: Handlebars.compile(
    document.querySelector("#template-article-link").innerHTML
  ),
  tagLink: Handlebars.compile(
    document.querySelector("#template-tag-link").innerHTML
  ),
  tagCloudLink: Handlebars.compile(
    document.querySelector("#template-tag-cloud-link").innerHTML
  ),
};
const optArticleSelector = ".post",
  optTitleSelector = ".post-title",
  optTitleListSelector = ".titles",
  optArticleTagSelector = ".post-tags .list",
  optArticleAuthorsSelector = ".post .post-author",
  //lista tagów w prawej kolumnie
  optTagsListSelector = ".sidebar .tags",
  optCloudClassCount = 4,
  optCloudClassPrefix = "tag-size-",
  optRightColumnAuthorsSelector = ".sidebar .authors";
generateTitleLinks();

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const activeLinks = document.querySelectorAll(".titles a.active");
  const activeArticles = document.querySelectorAll("article.active");

  /* remove class 'active' from all article links  */
  for (let activeLink of activeLinks) {
    activeLink.classList.remove("active");
  }
  /* remove class 'active' from all articles */
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove("active");
  }
  /* add class 'active' to the clicked link */
  clickedElement.classList.add("active");
  /* get 'href' attribute from the clicked link */
  const articleFinder = clickedElement.getAttribute("href");
  /* find the correct article using the selector (value of 'href' attribute) */
  const chosenArticle = document.querySelector(articleFinder);

  /* add class 'active' to the correct article */
  chosenArticle.classList.add("active");
}

function generateTitleLinks(customSelector = "") {
  /*odczytanie i wyzerowanie listy artykułów*/

  const listArticles = document.querySelector(optTitleListSelector);
  listArticles.innerHTML = "";
  let html = "";
  /*wyciągniecie wszystkich artykułów*/
  const allArticles = document.querySelectorAll(
    optArticleSelector + customSelector
  );

  for (let article of allArticles) {
    /*wyciągnięcie id artykułów*/
    const idArticle = article.getAttribute("id");
    /*odczytanie tytułu artykułów*/
    const titleArticle = document
      .getElementById(idArticle)
      .querySelector(optTitleSelector).innerHTML;
    /*dodanie kodu html wraz ze zmniennymi dot.artykułów, do elementu z listą artykułów*/
    const linkHTMLData = { id: idArticle, title: titleArticle };
    const linkHTML = templates.articleLink(linkHTMLData);
    html += linkHTML;
  }
  listArticles.innerHTML = html;
  const links = document.querySelectorAll(".titles a");
  for (let link of links) {
    link.addEventListener("click", titleClickHandler);
  }
}
//zwraca najmniejszą i największą ilość tagów, w obiekcie
function calculateTagsParams(tags) {
  const params = { max: 1, min: 9999 };
  for (let tag in tags) {
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    } else if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}
//porównuje liczbe wystąpień taga z największą i najmniejszą ilością wszystkich tagów
function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  return optCloudClassPrefix + classNumber;
}
/*generowanie tagów*/
function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  const allArticles = document.querySelectorAll(optArticleSelector);
  for (let article of allArticles) {
    /* find tags wrapper */
    let listTag = article.querySelector(optArticleTagSelector);
    let html = "";
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute("data-tags");
    /*make array from articleTags*/
    const articleTagsArray = articleTags.split(" ");

    for (let tag of articleTagsArray) {
      const linkHTMLData = { id: tag, title: tag };
      const linkHTML = templates.tagLink(linkHTMLData);
      //const linkHTML = `<li><a href="#tag-${tag}">${tag}</a></li>`;
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags*/
      if (!allTags.hasOwnProperty(tag)) {
        /* [NEW] add generated code to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    /*filling tags wrapper*/
    listTag.innerHTML = html;
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);
  /* [NEW] add html from allTags to tagList */
  //tagList.innerHTML = allTags.join(" ");
  const tagsParams = calculateTagsParams(allTags);
  console.log("tagsParams:", tagsParams);
  //all links HTML code
  const allTagsData = { tags: [] };
  //for each tag in allTags
  for (let tag in allTags) {
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams),
    });
  }
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute("href");
  console.log(href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  /*href będzie w tym przypadku id danego taga*/
  const tag = href.replace("#tag-", "");
  console.log(tag);
  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for (let activeTag of activeTags) {
    /* remove class active */
    activeTag.classList.remove(".active");
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const clickedTags = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  /* add class active */
  for (let clickedTag of clickedTags) {
    //console.log(clickedTag);
    clickedTag.classList.add(".active");
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const allListTags = document.querySelectorAll(".post-tags li a");
  const allListTagsRight = document.querySelectorAll(".sidebar .tags li a");
  for (let linkTag of allListTags) {
    linkTag.addEventListener("click", tagClickHandler);
  }
  for (let linkTagRight of allListTagsRight) {
    linkTagRight.addEventListener("click", tagClickHandler);
  }
}

addClickListenersToTags();

function generateAuthors() {
  /*obiekt autorzy i liczba ich artykułów*/
  const objAuthors = {};
  /*wszystkie artykuły*/
  const allArticles = document.querySelectorAll(optArticleSelector);
  const articleAuthorList = [];
  const listAuthorsRight = document.querySelector(
    optRightColumnAuthorsSelector
  );
  for (let article of allArticles) {
    /*autor artykułu w kolumnie środkowej selector*/
    const listAuthors = article.querySelector(optArticleAuthorsSelector);
    /*autor artykułu w kolumnie prawej selector*/

    /*wrapper z autorem danego artykułu*/
    const articleAuthor = article.getAttribute("data-author");
    /*stworzenie tablicy z autorami artykułów*/
    articleAuthorList.push(articleAuthor);
    /*uzupełnianie jednego paragrafu przy każdym obrocie pętli*/
    const linkHTMLData = { id: articleAuthor, title: articleAuthor };
    const linkHTML = templates.articleLink(linkHTMLData);
    listAuthors.innerHTML = `<a href="#author-${articleAuthor}">${articleAuthor}</a>`;
  }

  /*tworzenie obiektu z listą autorów i liczbą ich artykułów*/
  for (let author of articleAuthorList) {
    if (!objAuthors.hasOwnProperty(author)) {
      objAuthors[author] = 1;
    } else {
      objAuthors[author]++;
    }
  }
  let html = "";
  for (let author in objAuthors) {
    html += `<li><a href="#author-${author}">${author} (${objAuthors[author]})</a></li>`;
  }
  listAuthorsRight.innerHTML = html;
}
generateAuthors();

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute("href");
  const author = href.replace("#author-", "");
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
  for (let activeAuthor of activeAuthors) {
    /* remove class active */
    activeAuthor.classList.remove(".active");
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const clickedAuthors = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  /* add class active */
  for (let clickedAuthor of clickedAuthors) {
    //console.log(clickedTag);
    clickedAuthor.classList.add(".active");
  }

  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  const allLinkAuthors = document.querySelectorAll(".post .post-author a");
  const allLinkAuthorsRight = document.querySelectorAll(".sidebar .authors a");
  for (let linkAuthor of allLinkAuthors) {
    linkAuthor.addEventListener("click", authorClickHandler);
  }
  for (let linkAuthor of allLinkAuthorsRight) {
    linkAuthor.addEventListener("click", authorClickHandler);
  }
}
addClickListenersToAuthors();
