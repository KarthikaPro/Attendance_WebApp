async function fetchData() {
    try {
        const response = await fetch('/api/users');
        
        // Check if the response status is OK (status code 200)
        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        // Attempt to parse the response as JSON
        const data = await response.json();
       console.log(data);
        displayData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        
        // Display an error message in the 'details' container
        const userDataContainer = document.getElementById('details');
        userDataContainer.innerHTML = '<p>Error fetching data. Please try again later.</p>';
    }
}

// Display the fetched data in the HTML
function displayData(data) {
    const userDataContainer = document.getElementById('details');

    // Check if data is empty
    if (Object.keys(data).length === 0) {
        userDataContainer.innerHTML = '<p>No data available.</p>';
        return;
    }

    const htmlContent = data.map(attendance => {
    return (`
    <p>Date: ${attendance.date}</p>
    <p>User ID: ${attendance.userid}</p>
    <p>Name: ${attendance.username}</p>
    <p>Login_Status: ${attendance.login_status}</p>
    <p>Login_Time: ${attendance.login_time}</p>
    <p>Logout_Status: ${attendance.logout_status}</p>
    <p>Logout_Time: ${attendance.logout_time}</p>
    <hr/>
    `);
});
    // Format and display the data in the 'details' container
    userDataContainer.innerHTML = htmlContent;
}

// Fetch data when the page loads
document.addEventListener('DOMContentLoaded', fetchData);