var dateTime = () => {
    var today =new Date();
     var dd = today.getDate();
     var mm = today.getMonth() + 1;
     var yy= today.getFullYear();
     var formattedDate = dd + "-" +  mm + "-" + yy;
     document.getElementById('date').innerText = formattedDate;

     var hours = today.getHours();
     var min = today.getMinutes();
     var sec = today.getSeconds();
     var time = hours + ':' + min + ':' + sec;
     document.getElementById('time').innerText = time;
}

setInterval(dateTime,1000);

dateTime();

const millisecondsUntilNextDay = (() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow - now;
})();
document.getElementById('loginButton').addEventListener('click', handleLogin);
document.getElementById('logoutbtn').addEventListener('click', handleLogOut);

async function handleLogin() {
    console.log('Login button clicked');
    try {
        const response = await fetch('/signin', { method: 'POST' });

        if (response.ok) {
            console.log('Login successful');
            localStorage.setItem('lastLogin', Date.now());
            document.getElementById('loginButton').classList.add('d-none');
            document.getElementById('logoutbtn').classList.remove('d-none');
            document.getElementById('logoutbtn').innerText = 'Sign Out';
        } else {
            console.error('Login failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}

async function handleLogOut() {
    console.log('Logout button clicked');
    try {
        const response = await fetch('/signout', { method: 'PUT' });

        if (response.ok) {
            console.log('Logout successful');
            // Show a message about successfully giving attendance
            showAttendanceMessage();
            // Set a flag in sessionStorage to indicate that the message has been shown
            sessionStorage.setItem('attendanceMessageShown', 'true');
            // Hide the logout button and show the login button after 24 hours
            showLoginButtonAfter24Hours();
        } else {
            console.error('Logout failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}


function checkLastLogin() {
    const lastLogin = localStorage.getItem('lastLogin');
    const attendanceMessageShown = sessionStorage.getItem('attendanceMessageShown');

    if (lastLogin && !attendanceMessageShown) {
        const currentTime = Date.now();
        const timeDifference = currentTime - parseInt(lastLogin);

        // Check if more than 24 hours have passed or if it's a new day
        const isNewDay = new Date().toLocaleDateString() !== new Date(parseInt(lastLogin)).toLocaleDateString();
        if (timeDifference >= 24 * 60 * 60 * 1000 || isNewDay) {
            // More than 24 hours have passed or it's a new day, remove the timestamp
            localStorage.removeItem('lastLogin');

            // Show login button after 24 hours
            showLoginButtonAfter24Hours();
        }
    }
}

// Show a message about successfully giving attendance
function showAttendanceMessage() {
    const attendanceMessage = document.createElement('p');
    attendanceMessage.textContent = 'You have successfully given your attendance!';
    document.body.appendChild(attendanceMessage);
    setTimeout(() => {
        attendanceMessage.textContent = '';
    },3000);
    setTimeout(() => {
        attendanceMessage.textContent = '';
    },millisecondsUntilNextDay);
}

// Show the login button after 24 hours
function showLoginButtonAfter24Hours() {
    const loginAvailableMessage = document.createElement('p');
    loginAvailableMessage.textContent = 'Login will be available tomorrow!.';
    document.body.appendChild(loginAvailableMessage);

    setTimeout(() => {
        loginAvailableMessage.textContent='';
    },3000);
    // Schedule the function to show the login button after 24 hours
    setTimeout(() => {
        document.getElementById('loginButton').classList.remove('d-none');
        document.getElementById('logoutbtn').classList.add('d-none');
        loginAvailableMessage.textContent = ''; 

        // Remove the sessionStorage flag after showing the login button
        sessionStorage.removeItem('attendanceMessageShown');
    },millisecondsUntilNextDay);
}
