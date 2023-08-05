const APIController = (function() {
    var client = config.CLIENT_ID;
    var secret = config.CLIENT_SECRET;
    const clientId = client;
    const clientSecret = secret;
  
    const _getToken = async () => {
      const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
      });
  
      const data = await result.json();
      return data.access_token;
    };

    return {
      getToken: _getToken
    };
})();

async function getSpotifyRecommendations(trackName, artist, popularity, energy, acousticness) {
    try {
      const token = await APIController.getToken();
      const searchUrl = 'https://api.spotify.com/v1/search';
  
      // Perform a search for the given track name
      const queryParams = new URLSearchParams({
        q: `track:${trackName} artist:${artist}`,
        type: 'track',
        market: 'US',
        limit: 1
      });
  
      const response = await fetch(`${searchUrl}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }
  
      const data = await response.json();
  
      // Extract the song ID from the search results
      const songId = data.tracks.items[0].id;


      // Get recommendations based on the obtained songId, energy, and popularity
      const recommendationsUrl = 'https://api.spotify.com/v1/recommendations';
      const recommendationsParams = new URLSearchParams({
        seed_tracks: songId,
        limit: 10, // Number of recommended tracks to return (maximum: 100)
        market: 'US', // Replace this with your desired market (e.g., 'US', 'GB', 'CA', etc.)
        target_energy: energy,
        target_popularity: popularity,
        target_acousticness: acousticness
      });
  
      const recommendationsResponse = await fetch(`${recommendationsUrl}?${recommendationsParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!recommendationsResponse.ok) {
        throw new Error('Request failed with status ' + recommendationsResponse.status);
      }
  
      const recommendationsData = await recommendationsResponse.json();
      displayRecommendations(recommendationsData.tracks);
    } catch (error) {
      console.error('Error:', error.message);
    }
}
  


function displayRecommendations(tracks) {
    const recommendationsDiv = document.getElementById('recommendation');
  
    // Clear the previous recommendations (if any)
    recommendationsDiv.innerHTML = '';
  
    // Loop through the recommendations and create elements to display them
    tracks.forEach((track, index) => {
      const trackDiv = document.createElement('div');
      trackDiv.textContent = `${index + 1}. ${track.name} - ${track.artists[0].name}`;
      recommendationsDiv.appendChild(trackDiv);
    });
}
  


//   // Event listener for form submission
// document.getElementById('recommendationsForm').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent default form submission behavior
  
//     const songName = document.getElementById('trackName').value;
//     const artistName = document.getElementById('artist').value;
//     const popularity = parseInt(document.getElementById('popularity').value);
//     const energy = parseFloat(document.getElementById('energy').value);
//     const acousticness = parseFloat(document.getElementById('acousticness').value);
  
//     getSpotifyRecommendations(songName, artistName, popularity, energy, acousticness);
//   });

document.getElementById('recommendationsForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
  
    const songName = document.getElementById('trackName').value;
    const artistName = document.getElementById('artist').value;
    const popularity = parseInt(document.getElementById('popularity').value);
    const energy = parseFloat(document.getElementById('energy').value);
    const acousticness = parseFloat(document.getElementById('acousticness').value);
  
    // Hide the form section and display the results section
    document.getElementById('recommendationsForm').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'flex';
  
    // Call the function to get Spotify recommendations
    getSpotifyRecommendations(songName, artistName, popularity, energy, acousticness);
  });
  
  document.getElementById('backButton').addEventListener('click', function() {
    // Clear the recommendations display
    document.getElementById('recommendations').innerHTML = '';
  
    // Hide the results section and display the form section again
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('recommendationsForm').style.display = 'block';
  });