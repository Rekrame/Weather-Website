const form = document.getElementById('form');
const result = document.getElementById('result');
const formContainer = document.getElementById('formContainer');
const successScreen = document.getElementById('successScreen');
    
form.addEventListener('submit', function(e) {
    const formData = new FormData(form);
    e.preventDefault();
    
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    
    result.innerHTML = "Please wait..."
    
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status === 200) {
                formContainer.style.display = 'none';
                successScreen.style.display = 'block';
            } else {
                console.log(response);
                result.innerHTML = json.message;
            }
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "Something went wrong!";
        })
        .then(function() {
            form.reset();
        });
});

function returnToHome() {
    window.location.href = 'index.html';
}