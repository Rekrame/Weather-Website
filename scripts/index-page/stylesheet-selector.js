function isNowEvening() {
    let now = new Date();
    let hours = now.getHours();

    // Define evening hours range: 6 PM (18:00) to 11:59 PM (23:59)
    return hours >= 18 && hours <= 23;
}

document.addEventListener('DOMContentLoaded', () => {
    let isEvening = isNowEvening();
    document.getElementById('dayStylesheet').disabled = isEvening;
    document.getElementById('eveningStylesheet').disabled = !isEvening;
    document.getElementsByClassName('day-time-image')[0].src = isEvening ? "images/moon.png" : "images/sun.png";
});

export { isNowEvening };