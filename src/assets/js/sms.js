const sms = (() => {
    //private var/functions
    function send(selector) {
        const btn = document.querySelector(selector);

        if(!btn) return

        const form  = btn.closest('form')
        const clientID = document.querySelector('input[name="client"]').value

        if(!btn || !form || !clientID) return

        

        btn.addEventListener('click', function (e) {
            e.preventDefault()
            

        });

    }
    
    return {
        //public var/functions
        send
    }
})()

sms.send('.formMail__code .validate')