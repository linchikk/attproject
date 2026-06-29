document.addEventListener('DOMContentLoaded', () => {

  // HEADER DROPDOWN (контакты)

  const contacts = document.querySelector('.header__contacts');
  const contactsBtn = document.querySelector('.header__contacts-btn');

  if (contactsBtn && contacts) {
    contactsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      contacts.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!contacts.contains(e.target)) {
        contacts.classList.remove('active');
      }
    });
  }


  // REVIEWS SLIDER

  const track = document.querySelector('.reviews__track');
  const cards = document.querySelectorAll('.review-card');

  const prev = document.querySelector('.reviews__arrow--prev');
  const next = document.querySelector('.reviews__arrow--next');

  let index = 0;
  const visible = 2;

  // вычисление шага сдвига (карточка + gap)
  function getStep() {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = parseInt(getComputedStyle(track).gap) || 0;

    return cardWidth + gap;
  }

  // обновление позиции слайдера
  function updateSlider() {
    const step = getStep();
    track.style.transform = `translateX(-${index * step}px)`;
  }

  next?.addEventListener('click', () => {
    if (index < cards.length - visible) {
      index++;
      updateSlider();
    }
  });

  prev?.addEventListener('click', () => {
    if (index > 0) {
      index--;
      updateSlider();
    }
  });


  //REVIEW TEXT EXPAND ("далее…")

  document.querySelectorAll('.review-card').forEach(card => {
    const text = card.querySelector('.review-card__text');
    const btn = card.querySelector('.review-card__more');

    if (!text || !btn) return;

    // проверка есть ли обрезка текста
    const isLongText = text.scrollHeight > text.clientHeight;

    if (!isLongText) {
      btn.style.display = 'none';
      return;
    }

    btn.addEventListener('click', () => {
      text.classList.toggle('expanded');

      btn.textContent = text.classList.contains('expanded')
        ? 'скрыть'
        : 'далее…';
    });
  });


  // DATEPICKER (календарь)

  const dateFrom = flatpickr("#date-from", {
    locale: "ru",
    dateFormat: "d.m.Y",
    minDate: "today",
    onChange: function (selectedDates) {
      if (selectedDates[0]) {
        dateTo.set("minDate", selectedDates[0]);
      }
    }
  });

  const dateTo = flatpickr("#date-to", {
    locale: "ru",
    dateFormat: "d.m.Y",
    minDate: "today"
  });


  // FORM SUBMIT (поиск)

  const form = document.querySelector('.schedule-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = {
        dateFrom: document.querySelector('#date-from').value,
        dateTo: document.querySelector('#date-to').value,
        adults: document.querySelector('#adults').value,
        children: document.querySelector('#children').value
      };

      console.log('Поиск:', data);
    });
  }


  // BURGER MENU

  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');

  if (burger && nav) {

    burger.addEventListener('click', () => {
      nav.classList.toggle('active');
    });

    // закрытие по клику вне меню
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !burger.contains(e.target)) {
        nav.classList.remove('active');
      }
    });

    // закрытие по клику на ссылку
    nav.addEventListener('click', (e) => {
      const link = e.target.closest('a');

      if (link) {
        nav.classList.remove('active');
      }
    });
  }


  // SMOOTH SCROLL 

  function smoothScrollTo(targetY, duration = 800) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let start;

    function step(timestamp) {
      if (!start) start = timestamp;

      const time = timestamp - start;
      const progress = Math.min(time / duration, 1);

      // плавное ускорение/замедление
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      window.scrollTo(0, startY + diff * ease);

      if (time < duration) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // обработка якорных ссылок
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const id = link.getAttribute('href');
      const target = document.querySelector(id);

      if (!target) return;

      const offsetTop = target.getBoundingClientRect().top + window.scrollY;

      smoothScrollTo(offsetTop, 1200);
    });
  });

});