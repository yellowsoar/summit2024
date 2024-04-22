let schedule
$(function () {
  fetch('assets/data/schedule.json')
    .then(response => response.json())
    .then(data => {
      schedule = data
      hash = window.location.hash
      if (hash) {
        $('.agenda-session[data-id="' + hash.substring(1) + '"]').click()
      }
    })
})

$("[data-day='2']").addClass('hidden')

$('#day1').click(function () {
  $("[data-day='1']").removeClass('hidden')
  $("[data-day='2']").addClass('hidden')
  $('#day').text('Day 1')
});

$('#day2').click(function () {
  $("[data-day='1']").addClass('hidden')
  $("[data-day='2']").removeClass('hidden')
  $('#day').text('Day 2')
});

$('#tag-group button').on('click', function (e) {
  e.preventDefault()
  let target = $(this).attr('data-target')
  if (!$(this).siblings('button.filtered')[0]) {
    $(`.agenda-session`).addClass('filtered')
    $(`.agenda-session[data-tags*="${target}"]`).removeClass('filtered')
    $(this).siblings('button').addClass('filtered')
    $(this).removeClass('filtered')
  } else if (!$(this).siblings('button:not(.filtered)')[0]) {
    $(`.agenda-session`).removeClass('filtered')
    $(this).siblings('button').removeClass('filtered')
    $(this).removeClass('filtered')

  } else {
    $(this).toggleClass('filtered')
    if ($(this).hasClass('filtered')) {
      $(`.agenda-session[data-tags*="${target}"]`).addClass('filtered')
    } else {
      $(`.agenda-session[data-tags*="${target}"]`).removeClass('filtered')
    }
  }
})

$('.agenda-session[data-id]').on('click', function (e) {
  let currentLang = i18n.locale
  let id = $(this).data('id')
  history.replaceState(null, null, window.location.pathname + '#' + id);
  let session = schedule['sessions'].filter(session => session['id'] == id)[0]
  let bodyTmplDom = $(`
        <div>
          <div class="agenda-speaker"></div>
          <div class="agenda-description"></div>
        </div>
      `)
  session['speakers'].forEach(sid => {
    let speaker = schedule['speakers'].filter(speaker => speaker['id'] == sid)[0]
    let avatar = "assets/" + speaker['avatar'].split("/assets/")[1]
    $('.agenda-speaker', bodyTmplDom).append(`
          <div class="flex mb-4">
            <img src="${avatar}" class="w-20 h-20 rounded-full shrink-0">
            <div class="font-bold text-xl ms-4 my-auto">${speaker[currentLang]['name']}</div>
          </div>
        `)
  })
  $('.agenda-speaker', bodyTmplDom).append('<hr>')
  $('.agenda-description', bodyTmplDom).html(marked.parse(session[currentLang]['description']))
  $('#modal .modal-head > .font-bold').text(session[currentLang]['title'])
  $('#modal .modal-body').html(bodyTmplDom)
  $('#modal .modal-body a').filter(function () {
    return this.hostname != window.location.hostname;
  }).attr('target', '_blank');
  $('body').addClass('overflow-hidden')
  $('#modal').addClass('show')
})

$('#modal .modal-close').on('click', function (e) {
  e.preventDefault()
  $('body').removeClass('overflow-hidden')
  $('#modal').removeClass('show')
  history.replaceState(null, null, window.location.pathname);
})

$(document).on('keydown', function (e) {
  if (e.key === 'Escape') {
    $('#modal .modal-close').click()
  }
});