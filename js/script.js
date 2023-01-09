"use strict";

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

function generateTitleLinks() {
  /*odczytanie i wyzerowanie listy artykułów*/
  const listArticles = document.querySelector(".titles");
  listArticles.innerHTML = "";
  console.log(listArticles);
  /*wyciągniecie wszystkich artykułów*/
  const allArticles = document.querySelectorAll(".post");

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
  console.log(links);
  for (let link of links) {
    link.addEventListener("click", titleClickHandler);
  }
}
