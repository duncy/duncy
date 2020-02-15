Vue.component('header-text', {
    template: '<transition name="fade" appear><div><h1>Duncan<br>Fryer</h1><div class=line></div><h2>[ Дункан Фрайер ]</h2></div></transition>'
})

var header = new Vue({
    el: 'header'
})