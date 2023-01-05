"use strict";

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const activeLinks = document.querySelectorAll(".titles a.active");
  const activeArticles = document.querySelectorAll("article.active");
  /* remove class 'active' from all article links  */
  for (let activeLink of activeLinks) {
    activeLink.classList.remove("active");
  }
  /* add class 'active' to the clicked link */
  clickedElement.classList.add("active");
  /* remove class 'active' from all articles */
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove("active");
  }
  /* get 'href' attribute from the clicked link */
  const articleFinder = clickedElement.getAttribute("href");
  /* find the correct article using the selector (value of 'href' attribute) */
  const clickedArticle = document.querySelector(articleFinder);
  /* add class 'active' to the correct article */
  clickedArticle.classList.add("active");
}

const links = document.querySelectorAll(".titles a");
for (let link of links) {
  link.addEventListener("click", titleClickHandler);
}
