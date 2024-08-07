const url = window.location.href;
let baseURL = "";

if (url.split(":")[0] === 'http'){
    baseURL = "http://localhost:5001";
}
else{
    baseURL = 'https://server-deploymentjs.netlify.app';
}


let getWeather = () => {

    let cityName = document.querySelector("#cityName").value

    axios.get(`${baseURL}/weather`)
        .then(function (response) {
            // handle success
            console.log("response is success");
            console.log(response.data);

            document.querySelector("#result").innerHTML =
                `<h1>${response.data.city}</h1>
                 <h3> ${response.data.temp_c}°C </h3>`

        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })

}