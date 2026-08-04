const lightbox = document.querySelector("#screenshot-lightbox");

document.querySelectorAll("[data-coming-soon-browser]").forEach((button) => {
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  const browser = button.dataset.comingSoonBrowser;
  const statusId = button.getAttribute("aria-controls");
  const status = statusId ? document.getElementById(statusId) : null;

  if (!browser || !(status instanceof HTMLElement)) {
    return;
  }

  button.addEventListener("click", () => {
    button.setAttribute("aria-expanded", "true");
    status.textContent = `${browser} support is coming soon.`;
    status.hidden = false;
  });
});

if (lightbox instanceof HTMLDialogElement) {
  const lightboxImage = lightbox.querySelector("#screenshot-lightbox-image");
  const lightboxTitle = lightbox.querySelector("#screenshot-lightbox-title");
  const lightboxCaption = lightbox.querySelector("#screenshot-lightbox-caption");
  const lightboxCounter = lightbox.querySelector("#screenshot-lightbox-counter");
  const closeButton = lightbox.querySelector("[data-lightbox-close]");
  const previousButton = lightbox.querySelector("[data-lightbox-prev]");
  const nextButton = lightbox.querySelector("[data-lightbox-next]");

  if (
    lightboxImage instanceof HTMLImageElement &&
    lightboxTitle instanceof HTMLElement &&
    lightboxCaption instanceof HTMLElement &&
    lightboxCounter instanceof HTMLElement &&
    closeButton instanceof HTMLButtonElement &&
    previousButton instanceof HTMLButtonElement &&
    nextButton instanceof HTMLButtonElement
  ) {
    let storyLinks = [];
    let currentIndex = 0;
    let lastTrigger = null;

    const render = () => {
      const currentLink = storyLinks[currentIndex];
      const sourceImage = currentLink?.querySelector("img");
      const sourceFigure = currentLink?.closest("figure");

      if (!(sourceImage instanceof HTMLImageElement)) {
        return;
      }

      lightboxImage.src = sourceImage.currentSrc || sourceImage.src;
      lightboxImage.alt = sourceImage.alt;
      lightboxTitle.textContent = currentLink.closest(".screenshot-story")?.querySelector("h3")?.textContent || "DutchMate in action";
      lightboxCaption.textContent = sourceFigure?.querySelector("figcaption")?.textContent?.trim() || sourceImage.alt;
      lightboxCounter.textContent = `${currentIndex + 1} of ${storyLinks.length}`;
      previousButton.disabled = storyLinks.length < 2;
      nextButton.disabled = storyLinks.length < 2;
    };

    const move = (offset) => {
      if (storyLinks.length < 2) {
        return;
      }

      currentIndex = (currentIndex + offset + storyLinks.length) % storyLinks.length;
      render();
    };

    document.querySelectorAll(".screenshot-link").forEach((link) => {
      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      link.addEventListener("click", (event) => {
        event.preventDefault();
        const story = link.closest(".screenshot-story");
        storyLinks = story ? [...story.querySelectorAll(".screenshot-link")] : [link];
        currentIndex = storyLinks.indexOf(link);
        lastTrigger = link;
        render();
        lightbox.showModal();
        closeButton.focus();
      });
    });

    closeButton.addEventListener("click", () => lightbox.close());
    previousButton.addEventListener("click", () => move(-1));
    nextButton.addEventListener("click", () => move(1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        lightbox.close();
      }
    });

    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
    });

    lightbox.addEventListener("close", () => {
      lightboxImage.removeAttribute("src");
      lastTrigger?.focus();
      lastTrigger = null;
    });
  }
}
