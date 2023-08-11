export default {
    methods: {
        ControllerError(err){
            if (err.response) {
                console.log(err.response);
            } else if (err.request) {
                // The client never received a response, and the request was never left
            } else {
                // Anything else
            }
        }
    }}