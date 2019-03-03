export default function() {
  const $preloader = document.querySelector('.preloader');
  const $spinner = $preloader.querySelector('.sk-folding-cube');
  const $left = $preloader.querySelector('.preloader--left');
  const $right = $preloader.querySelector('.preloader--right');
  $left.style.transform = 'translateX(-100%)';
  $right.style.transform = 'translateX(100%)';
  $spinner.style.opacity = 0;

  $left.addEventListener('transitionend', () => {
    $preloader.style.display = 'none'
  });
}

