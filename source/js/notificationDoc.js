class NotificationDoc{
    addListener(){
         
        const notificationButton = document.getElementsByClassName("notification__button")[0];
        const notification = document.getElementsByClassName("c-notification")[0];

        if(notification)
        {const direction = notification.getAttribute('direction');
        let container = document.createElement('DIV');
        container.classList.add('c-notification__container');
        container.classList.add('c-notification__container--' + direction);
        document.body.appendChild(container);

        notificationButton.addEventListener('click', ()=>{
            let notificationCopy = notification.cloneNode(true);
            notificationCopy.classList.remove('u-display--none');
            container.appendChild(notificationCopy);
        })}
        
            
    }
}

export default NotificationDoc;