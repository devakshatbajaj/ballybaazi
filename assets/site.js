$(function () {
  var $window = $(window);
  var $body = $("body");

  setTimeout(function () {
    $(".loader").fadeOut(450);
  }, 650);

  $(".menu-toggle").on("click", function () {
    $(".mobile-menu").addClass("open").attr("aria-hidden", "false");
  });

  $(".close-menu, .mobile-menu a").on("click", function () {
    $(".mobile-menu").removeClass("open").attr("aria-hidden", "true");
  });

  $(".theme-toggle").on("click", function () {
    $body.toggleClass("light-mode");
    $(this).text($body.hasClass("light-mode") ? "MO" : "LT");
  });

  $(".chat-launcher").on("click", function () {
    $(".chatbot").toggleClass("open").attr("aria-hidden", function (_, current) {
      return current === "true" ? "false" : "true";
    });
  });

  $("a[href^='#']").on("click", function (event) {
    var target = $(this).attr("href");
    if (target && target.length > 1 && $(target).length) {
      event.preventDefault();
      window.scrollTo({
        top: $(target).offset().top - 72,
        behavior: "smooth"
      });
    }
  });

  $window.on("mousemove", function (event) {
    $(".cursor-glow").css({
      "--x": event.clientX + "px",
      "--y": event.clientY + "px"
    });
  });

  function animateCounter(element, target) {
    var startedAt = performance.now();
    var duration = 1200;

    function tick(now) {
      var progress = Math.min((now - startedAt) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      var suffix = target >= 100 ? "+" : "";
      element.textContent = (target < 10 ? value.toFixed(1) : Math.floor(value)) + suffix;

      if (progress < 1) requestAnimationFrame(tick);
      else element.textContent = (target < 10 ? target.toFixed(1) : Math.floor(target)) + suffix;
    }

    requestAnimationFrame(tick);
  }

  function runCounters() {
    $(".counter").each(function () {
      if (this.dataset.done) return;
      if ($window.scrollTop() + $window.height() < $(this).offset().top) return;

      this.dataset.done = "true";
      animateCounter(this, Number(this.dataset.target));
    });
  }

  function updateParallax() {
    var y = Math.min($window.scrollTop() * 0.18, 180);
    $(".hero-bg").css("--parallax", y + "px");
  }

  function revealOnScroll() {
    $(".reveal").each(function () {
      if (this.classList.contains("is-visible")) return;
      if ($window.scrollTop() + $window.height() * 0.86 >= $(this).offset().top) {
        this.classList.add("is-visible");
      }
    });
  }

  $window.on("scroll", function () {
    runCounters();
    updateParallax();
    revealOnScroll();
  });

  $(".tabs button").on("click", function () {
    var filter = $(this).data("filter");
    $(".tabs button").removeClass("active");
    $(this).addClass("active");
    $(".content-card").each(function () {
      $(this).toggle($(this).data("platform") === filter);
    });
    var grid = document.querySelector(".content-grid");
    if (grid) grid.scrollTo({ left: 0, behavior: "smooth" });
  });

  $(".tabs button.active").trigger("click");

  function startParticles() {
    var canvas = document.getElementById("particles");
    if (!canvas) return;

    var context = canvas.getContext("2d");
    var particles = [];
    var width = 0;
    var height = 0;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = [];
      for (var index = 0; index < 95; index += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 2 + 0.5,
          vx: (Math.random() - 0.5) * 0.35,
          vy: Math.random() * 0.45 + 0.1,
          gold: Math.random() > 0.55
        });
      }
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      particles.forEach(function (particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.y > height + 20) particle.y = -20;
        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;

        context.beginPath();
        context.fillStyle = particle.gold ? "rgba(244, 180, 0, 0.68)" : "rgba(45, 112, 255, 0.48)";
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
  }

  startParticles();
  runCounters();
  updateParallax();
  revealOnScroll();
});
