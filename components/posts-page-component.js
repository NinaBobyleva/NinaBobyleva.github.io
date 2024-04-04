import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, renderApp , setPosts } from "../index.js";
import { likePosts, dislikePosts, getPosts } from "../api";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";


export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  // console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = posts.map((post, index) => {
    return `<div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  <li class="post">
                    <div class="post-header" data-user-id=${post.user.id}>
                        <img src=${post.user.imageUrl} class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src=${post.imageUrl}>
                    </div>
                    <div class="post-likes">
                      <button data-index="${index}" data-post-id=${post.id} class="like-button">
                        <img src="./assets/images/${post.isLiked ? 'like-active.svg' : 'like-not-active.svg'}">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${post.likes.length > 1 ? `${post.likes[0]['name']} и еще  ${post.likes.length - 1}` : `${post.likes.length > 0 ? post.likes[0]['name'] : "0"}` }</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                      ${formatDistanceToNow(new Date(post.createdAt), {addSuffix: true, locale: ru})}
                    </p>
                  </li>
                </ul>
              </div>`}).join('');

  appEl.innerHTML = appHtml;

  
  for (const likeButtonElement of document.querySelectorAll('.like-button')) {
    likeButtonElement.addEventListener('click', () => {
      const index = likeButtonElement.dataset.index;
      if (posts[index].isLiked === false) {
        return likePosts(likeButtonElement.dataset.postId)
          .then(() => {
            getPosts().then((data) => {
              setPosts(data);
              renderApp();
            })
          });
      } else {
        return dislikePosts(likeButtonElement.dataset.postId)
          .then(() => {
            getPosts().then((data) => {
              setPosts(data);
              renderApp();
            })
          });
      }
    });
  }


  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }


}