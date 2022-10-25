// Add scroll top event listener
if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
} else {
  window.onbeforeunload = function() {
    window.scrollTo(0, 0);
  };
}

/* Elements */
const navContainerElement = document.body.querySelector(".nav");
const mobileNavButton = navContainerElement.querySelector(".nav-mobile-button");

const openNavigationState = "nav-menu-opened";
const activeState = "is-active";

/* Mob menu handler */

function toggleMobileNaigation() {
  navContainerElement.classList.toggle(openNavigationState);
}

mobileNavButton.addEventListener("click", toggleMobileNaigation);

/* Full page-scroll observer */
const wrapperElement = document.querySelector(".wrapper");
const getSiblings = (n) => [...n.parentElement.children].filter((c) => c.nodeType == 1 && c != n);

if (wrapperElement) {
  const pageSectionElements = wrapperElement.querySelectorAll("section");
  observerWatch(pageSectionElements);
}

function observerWatch(pageSectionElements) {
  const config = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  let observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const {
        isIntersecting,
        target
      } = entry;
      if (isIntersecting === true) {
        const index = [...pageSectionElements].indexOf(target) + 1;
        updateElementAttribute(wrapperElement, index);
        /* Statue animation */
        const statue = pageSectionElements[index - 1].querySelector('.section-statue');
        if (statue) {
          statue.classList.add('is-animated');
        }


        /* Logo animation */
        const currentLogo = document.querySelectorAll(".nav-logo img")[
          index - 1
        ];
        if (currentLogo) {
          currentLogo.classList.add(activeState);
          getSiblings(currentLogo).forEach((logo) =>
            logo.classList.remove(activeState)
          );
        }

        /* Gradient animation */
        const currentGradient = document.querySelectorAll(".gradient")[
          index - 1
        ];
        if (currentGradient) {
          currentGradient.classList.add(activeState);
          getSiblings(currentGradient).forEach((gradient) =>
            gradient.classList.remove(activeState)
          );
        }
      }
    });
  }, config);

  if (pageSectionElements) {
    pageSectionElements.forEach((section) => {
      observer.observe(section);
    });
  }
}

function updateElementAttribute(element, attrName) {
  if (element) {
    element.dataset.currentSection = attrName;
  }
}

/* Preloader */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelector(".preloader").style.display = "none";
    document.body.style.overflow = "auto";
  }, 1000);
});

/* Hash scroll */
window.addEventListener("DOMContentLoaded", () => {
  const pageHash = window.location.hash.slice(1);
  if (pageHash && document.getElementById(`${pageHash}`)) {
    document.getElementById(`${pageHash}`).scrollIntoView({
      block: "center",
    });
  }
});

/* Calendly form */

function renderCalendly() {
  const widgetUrl = "https://calendly.com/yft_/meeting";
  const calendlyPopup = document.querySelector(".calendly-popup");
  Calendly.initInlineWidget({
    url: widgetUrl,
    parentElement: calendlyPopup,
  });

  setCallendlyEvents(calendlyPopup);
}

function setCallendlyEvents(popup) {
  document.querySelectorAll('[data-action="form"]').forEach((button) => {
    button.addEventListener("click", () => {
      popup.classList.add("is-active");
      popup.querySelector(".calendly-close-button").addEventListener(
        "click",
        (evt) => {
          popup.classList.remove("is-active");
        }, {
          once: true
        }
      );
    });
  });
}


window.addEventListener("load", renderCalendly, {
  once: true
});
