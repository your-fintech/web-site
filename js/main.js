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

        /* Lazy load */
        if(pageSectionElements[index] && pageSectionElements[index].querySelector('.statue')) {
          pageSectionElements[index].querySelector('.section-statue').removeAttribute('loading');
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
function loadCalendly() {
  const script = document.createElement("script");
  script.src = "https://assets.calendly.com/assets/external/widget.js";
  script.async = true;
  document.getElementsByTagName("head")[0].appendChild(script);
  script.addEventListener("load",initCalendly);
}

function initCalendly() {
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
      
      /* Popup button close handler */
      popup.querySelector(".calendly-close-button").addEventListener(
        "click",() => popup.classList.remove("is-active"), {
          once: true
        }
      );
    });
  });
}

window.addEventListener("load", () => {
  onWindowLoad();
  loadCalendly();
});


/* Preloader */

function onWindowLoad() {
  setTimeout(() => {
    document.body.style.overflow = "auto";
    removeLoadingLazyAttribute();
  }, 1000);
}

function removeLoadingLazyAttribute() {
  if(document.querySelectorAll('img[loading="lazy"]')){
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      img.removeAttribute('loading');
    });
  }
}
