async function fetchData() {
    try {
        const response = await fetch('/api/admin');
        
        // Check if the response status is OK (status code 200)
        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        // Attempt to parse the response as JSON
        const data = await response.json();
        viewData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        
        // Display an error message in the 'details' container
        const userDataContainer = document.getElementById('adminDetails');
        userDataContainer.innerHTML = '<p>Error fetching data. Please try again later.</p>';
    }
}

function viewData(data) {
    const userDataContainer = document.getElementById('adminDetails');

    // Check if data is empty
    if (data.length === 0) {
        userDataContainer.innerHTML = '<p>No data available.</p>';
        return;
    }

    // Concatenate HTML content for each record
    const htmlContent = data.map(info => `
        <p onclick="showUsername(${info.oid}, '${info.username}','${info.date}','${info.login_status}','${info.login_time}','${info.logout_status}','${info.logout_time}')">User ID: ${info.oid}</p>
        <hr/>
    `).join('');

    userDataContainer.innerHTML = htmlContent;
}

// Show the username when a user ID is clicked
function showUsername(userId, username,date,login_status,login_time,logout_status,logout_time) {
    const userDetailsContainer = document.getElementById('userDetailsContainer');

    // Display the username in the user details container
    userDetailsContainer.innerHTML = `
    <div class='userDetails'>
    <p>Date : ${date} </p>
    <p>Name :  ${username} </p>
    <p>Login_Status: ${login_status} </p>
    <p>Login_Time: ${login_time}</p>
    <p>Logout_Status: ${logout_status}</p>
    <p>Logout_Time: ${logout_time}</p>
    </div>
    `;
}

// Fetch data when the page loads
document.addEventListener('DOMContentLoaded', fetchData);