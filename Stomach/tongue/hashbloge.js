const lastPoste = 2; // You need to MANUALLY change this to the number of your last/newest poste each time.
const firstPoste = 1; // This is the first poste. Don't change this unless your first poste is not 1 for some reason.
let currentPosteId = null;
let init = false;
let loading = false;

async function loadContent(posteId) {
  const blogContent = document.getElementById('blog-content');
  if (!blogContent || loading || posteId === currentPosteId) return;
  loading = true;
  currentPosteId = posteId;

  //This adds the 'fade-out' class defined in the CSS above, used for the fading out animation when changing bloge postes. The timeout here sets a slight delay to make sure that the animation plays smoothly even if the user clicks multiple times, the content hasn't fully loaded, etc.
  blogContent.classList.add('fade-out');
  await new Promise(resolve => setTimeout(resolve, 400));
  // If you do not want a fade-out animation and want the postes to appear instantly, delete the code above AND the other code slightly below this.

  try {
    const response = await fetch(`${posteId}`); // Depending on your website's redirect rules, you might also need to replace ${posteId} with ${posteId}.html
    if (!response.ok) throw new Error('The file is missing!'); // Message if the poste is not found eg you go to blog#10 but your bloge only has 9 postes. You can change this error message to something else if you want to be quirky widdit.
    const content = await response.text();
    blogContent.innerHTML = content;
  } catch (error) {
    blogContent.innerHTML = `<p>ERROR: ${error.message}</p>`; // Appears before the error message above. Again, you can replace 'ERROR' here with a different word if you want.
  }

  //Delete the code below AND the code slightly above this (read the comments) if you want to turn off the fade-out animations.
  blogContent.classList.remove('fade-out');

  // This is the 'scroll to top' animation where the page automatically scrolls back to top when changing entries.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 10); // minor delay because that fuck-ass scroll won't work otherwise
    });
  });

  // If you do not want a scrolling animation and want the scrolling to move to the top, instantly, delete the code above and uncomment the code below.
  //  window.scrollTo(0, 0);

  greyNav(posteId);
  loading = false;
}

function greyNav(posteId) {
  const olderNav = document.getElementById('older');
  const newerNav = document.getElementById('newer');
  olderNav.classList.toggle('disabled', posteId <= firstPoste);
  newerNav.classList.toggle('disabled', posteId >= lastPoste);
}

function getPosteId() {
  const hash = window.location.hash.slice(1);
  const posteId = parseInt(hash, 10);
  return isNaN(posteId) ? lastPoste : posteId;
}

function setPoste(posteId) {
  if (`#${posteId}` !== window.location.hash) {
    window.location.hash = `#${posteId}`;
  } else {
    loadContent(posteId);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const olderNav = document.getElementById('older');
  const newerNav = document.getElementById('newer');

  if (olderNav) {
    olderNav.addEventListener('click', () => {
      const posteId = getPosteId();
      if (posteId > firstPoste) setPoste(posteId - 1);
    });
  }

  if (newerNav) {
    newerNav.addEventListener('click', () => {
      const posteId = getPosteId();
      if (posteId < lastPoste) setPoste(posteId + 1);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      event.preventDefault();
      const target = event.currentTarget.getAttribute('href').slice(1);
      const posteId = parseInt(target, 10);
      if (!isNaN(posteId)) setPoste(posteId);
    });
  });

  // it's chewsday init
  if (!init) {
    const posteId = getPosteId();
    setPoste(posteId);
    init = true;
  }
});

window.addEventListener('hashchange', () => {
  const posteId = getPosteId();
  if (!init || posteId !== currentPosteId) {
    loadContent(posteId);
  }
});