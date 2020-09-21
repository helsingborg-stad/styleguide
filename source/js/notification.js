class Notification{
    setup(){
        const containers = document.getElementsByClassName('c-notification__container');

        if(containers && containers.length > 0){
            containers.forEach(container => {
                const direction = container.getAttribute('direction');
                const directionClass = `c-notification__container--${  direction}`;
                container.classList.add(directionClass);
                this.setOnClickClose(container);
            });
        }
        
    }

    removeFirst(target){
        const notifications = target.querySelectorAll('.c-notification');
        const maxAmount = target.getAttribute('maxamount');
        if(notifications.length > maxAmount){
            notifications[0].outerHTML = '';
        } 
    }

    setOnClickClose(targetNode){
        let count = 0;
        const observerOptions = {
        childList: true
        }
        const observer = new MutationObserver((event)=>{
            count++;
            this.removeFirst(targetNode);
            event.forEach((record)=>{
                record.addedNodes.forEach((node) =>{
                    if(node.classList.contains('c-notification')){
                        this.setAutoHideDuration(node);
                        node.addEventListener('click', ()=>{
                            node.classList.add(`c-notification--dying--${ count}`)
                            node.outerHTML = '';
                        })
                    }
                })
            })
            
        });
        observer.observe(targetNode, observerOptions);
    }

    setAutoHideDuration(notification){
        const autoHideDuration = notification.getAttribute('autoHideDuration');
        setTimeout(function(){ notification.outerHTML = ""; }, autoHideDuration);
    }
}

export default Notification;