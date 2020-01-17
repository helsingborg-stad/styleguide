import {Calendar, Organizer} from './calendar-javascript-lib';

class EventCalendar{



    initiateCalendar(){

        const calendar = document.querySelectorAll('[available]');
        const availableUrl = calendar[0].getAttribute('available');
        const bookedUrl = calendar[0].getAttribute('booked');
        const postUrl = calendar[0].getAttribute('post');
        const size = calendar[0].getAttribute('size');
        let weekStart = calendar[0].getAttribute('weekStart');
        weekStart = weekStart[0].toUpperCase() + weekStart.slice(1); 

        this.getEvents(bookedUrl).then(data => this.setup(data, weekStart, size, calendar));
    }

    getEvents(url){ 
        return fetch(url)
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

    postEvents($url){
        //post event object to url
    }

    setup (data, weekStart, size, calendarElement){
        let calendar = new Calendar("calendarContainer",
				size,
				[
					weekStart,
					3
                ], 
                [],
				{
					indicator: true,
					indicator_type: 1,
					indicator_pos: "bottom"
				}
			);
			
			let organizer = new Organizer("organizerContainer",
				calendar,
				data
            );
            
            organizer.setOnClickListener('days-blocks',
                (clickEvent, bookedEventList, element, calendarInstance) => {
                    console.log(element)
                    const list = calendarElement[0].querySelector('.c-calendar__event-list');
                    
                    let bookedEvents = list.querySelector('.booked__list');
                    let availableEvents = list.querySelector('.available__list');

                    let listHeader = bookedEvents.closest('.c-modal').querySelector('header')
                    console.log(typeof calendarInstance.date)
                    listHeader.innerText = calendarInstance.date;

                    bookedEvents.innerHTML = ' '
                    bookedEvents.innerHTML += bookedEventList;

                    availableEvents.innerHTML = ' '
                    availableEvents.innerHTML += bookedEventList;

                }
            );
    }
}


export default EventCalendar;