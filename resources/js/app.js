import './bootstrap';

import { createApp } from 'vue'
import VueTheMask from 'vue-the-mask'
import moment from 'moment'
import MiniCalendar from './components/miniCalendar'

const app = createApp({})

app.component('mini-calendar', MiniCalendar)

app.use(VueTheMask)

app.config.globalProperties.$filters = {
    timeAgo(date) {
        return moment(date).fromNow()
    },
    formatDate(date) {
        return moment(date).format("MMM Do YYYY")
    },
    daysInMonth(date) {
        return moment(date).daysInMonth()
    },
}

app.mount('#app')