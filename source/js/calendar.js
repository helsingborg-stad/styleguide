import {Calendar, Organizer} from './calendar-javascript-lib';

class EventCalendar{

    constructor(){
        this.timeslots = [];
    }

    initiateCalendar(){

        const calendar = document.querySelector('.c-calendar');
        if(calendar){
            const eventsUrl = calendar.getAttribute('eventsUrl');
        
            const bookingUrl = calendar.getAttribute('bookingUrl');
            const size = calendar.getAttribute('size');
            let weekStart = calendar.getAttribute('weekStart'); 
            console.log(weekStart)
            this.getEvents(eventsUrl).then(data => this.setup(data, weekStart, size, calendar, bookingUrl));
        }
        
    }

    getEvents(eventsUrl){ 
        return fetch(eventsUrl)
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

    postEvents(bookingUrl){
        fetch(bookingUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.timeslots)
        })
    }

    setButtonListener(calendarElement, bookingUrl){
        const button = calendarElement.getElementsByClassName('postEventButton');
        button[0].addEventListener('click',() =>{
            this.postEvents(bookingUrl)
        })
    }

    // TODO: modify lib to return timestamps directly instead of strings...
    setTimeslotListener(checkbox, date, timeslot){
        checkbox.addEventListener('change', (event) => {
            const timeslotParts = timeslot.split(' - ')
            const from = timeslotParts[0].split(':')[0];
            const to = timeslotParts[1].split(':')[0];
            const temp = {
                from: date.setHours(parseInt(from), 0, 0, 0),
                to: date.setHours(parseInt(to), 0, 0, 0)
            }
            
            if(checkbox.checked){
                this.timeslots.push(temp)
            }else if(!checkbox.checked) {
                //remove timestamp if checked and then unchecked
                for(let i = 0; i < this.timeslots.length; i++){
                    if(JSON.stringify(this.timeslots[i]) === JSON.stringify(temp)){
                        this.timeslots.splice(i, 1)
                    }
                }
            }
        });
    }

    //TODO: Research the possibility to make the elment a bit less complex.
    createListElement(events, date, availableEvents){
        let listItem = document.createElement("LI");
        
        for(let i = 0; i < events.length; i++){
            const timeslot = events[i].startTime + ' - ' + events[i].endTime;
            listItem.id = this.id + "-list-item-" + i;
    
            let division = document.createElement("DIV");
            
            let checkbox = document.createElement('INPUT');
            checkbox.setAttribute('type', 'checkbox');
            this.setTimeslotListener(checkbox, date, timeslot);

            let span = document.createElement("SPAN");
            span.id = this.id + "-list-item-" + i + "-time";
            span.class = this.id + " time";
            span.appendChild(document.createTextNode(events[i].startTime + ' - ' + events[i].endTime));

            division.appendChild(span);
    
            let paragraph = document.createElement("P");
            paragraph.id = this.id + "-list-item-" + i + "-text";
            paragraph.appendChild(document.createTextNode(events[i].text));
            
            if(availableEvents) paragraph.appendChild(checkbox);

            listItem.appendChild(division);
            listItem.appendChild(paragraph);
        }
        
        return listItem

    }

    setup (data, weekStart, size, calendarElement, postUrl){
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
        
            this.setButtonListener(calendarElement, postUrl);
            organizer.setOnClickListener('days-blocks',
                (clickEvent, eventsList, element, calendarInstance) => {
                    const modalId = clickEvent.target.getAttribute('data-open'); 

                    let modal = document.getElementById(modalId)
                    const isVisible = "c-modal__bg--is-visible";

                    modal.classList.add(isVisible);
                    const list = calendarElement.querySelector('.c-calendar__event-list');
                    let bookedEvents = list.querySelector('.booked__list');
                    let availableEvents = list.querySelector('.available__list');
                    let listHeader = bookedEvents.closest('.c-modal').querySelector('header').querySelector('h2')

                    listHeader.innerHTML = '';
                    availableEvents.innerHTML = '';
                    bookedEvents.innerHTML = '';

                    listHeader.innerHTML = calendarInstance.date.getDate() + '/' + calendarInstance.date.getMonth() + 1 + '/' + calendarInstance.date.getFullYear();

                    if(eventsList.booked)
                        bookedEvents.appendChild(this.createListElement(eventsList.booked, calendarInstance.date, false));
                    if(eventsList.available)
                        availableEvents.appendChild(this.createListElement(eventsList.available, calendarInstance.date, true));


                }
            );
    }
}


export default EventCalendar;