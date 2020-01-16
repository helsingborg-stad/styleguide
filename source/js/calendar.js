import {Calendar, Organizer} from './calendar-javascript-lib';


class EventCalendar{



    initiateCalendar(){

        const calendar = document.querySelectorAll('[get]');
        const getUrl = calendar[0].getAttribute('get');
        const postUrl = calendar[0].getAttribute('post');
        const size = calendar[0].getAttribute('size');
        let weekStart = calendar[0].getAttribute('weekStart');
        weekStart = weekStart[0].toUpperCase() + weekStart.slice(1); 

        this.getEvents(getUrl).then(data => this.setup(data, weekStart, size, calendar));
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
                (clickEvent, eventList, element) => {
         
                    const yPos = element.getBoundingClientRect().y + 'px';
                    const xPos = element.getBoundingClientRect().x/4 + 'px';
   
                    let list = calendarElement[0].querySelector('.c-calendar__event-list');
                    list.classList.remove('c-calendar__event-list--hidden')

                    list.innerHTML += eventList;
                    list.style.left = xPos;
                    list.style.top = yPos;
                    
                    list.style.position = 'absolute';
        
                   
                    

                }
            );
    }
}


export default EventCalendar;