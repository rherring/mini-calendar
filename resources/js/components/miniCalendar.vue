<template>
    <div class="w-full max-w-7xl mx-auto p-8">
        <div class="mb-8">
          <div class="flex flex-col space-y-4">
              <input v-model.lazy="findDate" type="text" inputmode="decimal" :placeholder="'Input Date: ' + placeholderDate" v-mask="['##/##/####']" class="input" :class="error ? 'error' : '' ">
              <button class="btn btn--primary" @click="getNewDate(findDate)">Show on Calendar</button>
          </div>
        </div>
        
        <div>
          <h1 class="text-center text-3xl font-bold p-2 lg:p-4">{{ monthTitle }} {{ listYear }}</h1>
            <ol class="day-of-week">
                <li v-for="weekday in weekdays" :key="weekday">{{ weekday }}</li>
            </ol>
            <ol class="days-grid">
                <li v-for="(n,index) in calBlankStart" :key="index" @click="selectPrevMonth(n)" class="calendar-day not-current"><span>{{ n + parseInt(endOfPrevMonth) }}</span></li>
                <li v-for="index in totalDays" :key="index" @click="selectDay(index)" class="calendar-day current" :class="index == thisDay ? 'calendar-today' : '' "><span>{{ index }}</span></li>
                <li v-for="(n,index) in calBlankEnd" :key="index" @click="selectNextMonth(n)" class="calendar-day not-current"><span>{{ n }}</span></li>
            </ol>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { ref, reactive, onUpdated, computed, onMounted } from 'vue'

export default {
    name: 'MiniCalendar',
    setup() {
        let useDate = ref(convertDate(Date.now()))

        const title = ref('Input your date.')
        const monthTitle = ref('')
        const listYear = ref('')
        const totalDays = ref('')
        const thisDay = ref('')
        const endOfPrevMonth = ref('')
        const findDate = ref('')
        const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const calBlankStart = ref('')
        const calBlankEnd = ref('')
        const placeholderDate = ref(formatDate(Date.now()))
        const error = ref(false)

        onMounted(() => {
            getNewDate(useDate)
        })

        const weekdays = computed(() => {
            return WEEKDAYS;
        })
        
        function selectPrevMonth(day) {
            const year = ref(moment(useDate).format("YYYY"))
            const month = ref(parseInt(moment(useDate).format("MM")) - 1)
            const thisMonth = ref(year.value + moment(useDate).format("MM") + '01')
            const startOfMonth = moment(thisMonth.value).day()
            const endOfMonth = getEndOfPrevMonth(thisMonth.value, startOfMonth)
            const yesterday = year.value + ('0' + month.value).slice(-2) + ('0' + (parseInt(endOfMonth) + day)).slice(-2)
            console.log(yesterday)
            useDate = yesterday
            placeholderDate.value = formatDate(yesterday)
            getNewDate(yesterday)
        }
        function selectDay(day) {
            const year = ref(moment(useDate).format("YYYY"))
            const month = ref(parseInt(moment(useDate).format("MM")))
            const today = year.value + ('0' + month.value).slice(-2) + ('0' + day).slice(-2)
            console.log(today)
            useDate = today
            placeholderDate.value = formatDate(today)
            getNewDate(today)
        }
        function selectNextMonth(day) {
            const year = ref(moment(useDate).format("YYYY"))
            const month = ref(parseInt(moment(useDate).format("MM")) + 1)
            const tomorrow = year.value + ('0' + month.value).slice(-2) + ('0' + day).slice(-2)
            console.log(tomorrow)
            useDate = tomorrow
            placeholderDate.value = formatDate(tomorrow)
            getNewDate(tomorrow)
        }
        function formatDate(date) {
            return moment(date).format('MM/DD/YYYY')
        }
        function convertDate(date) {
            return moment(date).format('YYYYMMDD')
        }
        function getEndOfPrevMonth(date, offset) {
            return moment(date).date(-(offset)).format("DD")
        }

        function getNewDate(date) {
            if (moment(date).isValid() == false) {
                date = useDate
                error.value = true
            } else { error.value = false }

            date = convertDate(date)
            if (findDate.value) useDate = date, findDate.value = formatDate(date)
            
            const daysInTheMonth = ref(moment(date).daysInMonth())
            const remainingDays = ref(35 - daysInTheMonth.value)
            const year = ref(moment(date).format("YYYY"))
            const month = ref(moment(date).format("MM"))
            const day = ref(moment(date).format("DD"))
            const monthStart = moment(year.value + month.value + "01")
            const startOfMonth = monthStart.day()

            monthTitle.value = moment(date).format('MMMM')
            listYear.value = moment(date).format('YYYY')
            totalDays.value = moment(date).daysInMonth()
            thisDay.value = moment(date).format('DD')
            endOfPrevMonth.value = getEndOfPrevMonth(date, startOfMonth)

            calBlankStart.value = startOfMonth
            calBlankEnd.value = remainingDays.value - startOfMonth
        }

        return { title, monthTitle, listYear, totalDays, thisDay, endOfPrevMonth, weekdays, findDate, calBlankStart, calBlankEnd, placeholderDate, error, getNewDate, formatDate, selectPrevMonth, selectDay, selectNextMonth }
    }
}
</script>

<style scoped>

</style>