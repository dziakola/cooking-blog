"use strict";
const listArticles = document.querySelector(".titles");

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

  listArticles.innerHTML = "";
  /*wyciągniecie wszystkich artykułów*/
  const allArticles = document.querySelectorAll(".post" + customSelector);
  for (let article of allArticles) {
    /*wyciągnięcie id artykułów*/
    const idArticle = article.getAttribute("id");
    /*odczytanie tytułu artykułów*/
    const titleArticle = document
      .getElementById(idArticle)
      .querySelector(".post-title").innerHTML;
    /*dodanie kodu html wraz ze zmniennymi dot.artykułów, do elementu z listą artykułów*/
    const html = `<li><a href="#${idArticle}"><span>${titleArticle}</span></a></li>`;
    listArticles.insertAdjacentHTML("beforeend", html);
    //listArticles.innerHTML += html;
  }
  const links = document.querySelectorAll(".titles a");
  for (let link of links) {
    link.addEventListener("click", titleClickHandler);
  }
}
/*generowanie tagów*/
function generateTags() {
  const allArticles = document.querySelectorAll(".post");
  for (let article of allArticles) {
    /* find tags wrapper */
    let listTag = article.querySelector(".post-tags .list");
    let html = "";
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute("data-tags");
    /*make array from articleTags*/
    const articleTagsArray = articleTags.split(" ");

    for (let tag of articleTagsArray) {
      html = html + `<li><a href="#tag-${tag}">${tag}</a></li>`;
    }
    /*filling tags wrapper*/
    listTag.innerHTML = html;
  }
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
  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for (let activeTag of activeTags) {
    console.log(activeTags);
    /* remove class active */
    activeTag.classList.remove(".active");
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const clickedTags = document.querySelectorAll('a[href="' + href + '"]');
  console.log(clickedTags);
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
  for (let linkTag of allListTags) {
    linkTag.addEventListener("click", tagClickHandler);
  }
}

addClickListenersToTags();
