async function fetchData() {
    try {
        const response = await fetch('/api/users');
        
        // Check if the response status is OK (status code 200)
        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        // Attempt to parse the response as JSON
        const data = await response.json();
       
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

    // Format and display the data in the 'details' container
    userDataContainer.innerHTML = `
        <p>Date: ${data.date}</p>
        <p>User ID: ${data.userid}</p>
        <p>Name: ${data.username}</p>
        <p>Login_Status: ${data.login_status}</p>
        <p>Login_Time: ${data.login_time}</p>
        <p>Logout_Status: ${data.logout_status}</p>
        <p>Logout_Time: ${data.logout_time}</p>
        <hr/>
    `;
}

// Fetch data when the page loads
document.addEventListener('DOMContentLoaded', fetchData);