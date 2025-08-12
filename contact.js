window.onload = function(){
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(getPositions, showError);
            }else {
                console.log("Browser doesn't support Geolocation")                
            }
        }
        function getPositions(position){
            document.getElementById("lat").innerText= position.coords.latitude;
            document.getElementById("lon").innerText= position.coords.longitude;// latitude:  Ready to use! (just a number)
           // document.getElementById("timestamp").innerText=new Date(position.timestamp) // new is used to create obj timestamp:  Not readable — needs to be "converted" into a Date object using new Date().
        }
        function showError(error){ // error is not user defined
            let msg="";
            switch(error.code){ // code is not user defined provided inbuilt eg:- Code 1 error.PERMISSION_DENIED.
                case error.PERMISSION_DENIED:
                    msg="User Denied Permission";
                    break;
                case error.POSITION_UNAVAILABLE:
                    msg="Not able to fetch the user position";
                    break;
                case error.TIMEOUT:
                    msg="Time out";
                    break;
                case error.UNKNOWN_ERROR:
                    msg="Unknown Error";
                    break;
            }
            displayError(msg)
        }

        function displayError(msg){
            document.getElementById("error").innerText=msg;
        }