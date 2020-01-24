class Notification{
    setup(){
        const containers = document.getElementsByClassName('c-notification__container');

        if(containers){
            containers.forEach(container => {
                const direction = container.getAttribute('direction');
                const directionClass = 'c-notification__container--' + direction;
                container.classList.add(directionClass);
                this.setOnClickClose(container);
            });
        }
        
    }

    setOnClickClose(targetNode){
        
        const observerOptions = {
        childList: true
        }

        const observer = new MutationObserver((event)=>{
            event.forEach((record)=>{
                record.addedNodes.forEach((node) =>{
                    if(node.classList.contains('c-notification')){
                        node.addEventListener('click', ()=>{
                            node.classList.add('c-notification--dying')
                            setTimeout(()=>{
                                node.outerHTML = '';
                            }, 500)
                            
                        })
                    }
                })
            })
            
        });
        observer.observe(targetNode, observerOptions);
    }

    setTimeToTermination(notifications){
        notifications.forEach((notification) => {
            setTimeout(function(){ notification.outerHTML = ""; }, 3000);
        });
    }
}

export default Notification;