document.getElementById('searchButton').addEventListener('click', function () {
    const channelName = document.getElementById('channelName').value;
    const apiKey = 'AIzaSyBEFpGGZiqW8unW9cTfGxpm7-Sn9Ffy0UE';  // Replace with your actual YouTube API key
    
    // Make sure the input is not empty
    if (!channelName) {
        alert("Please enter a channel ID or username.");
        return;
    }

    // YouTube API URL
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelName}&key=${apiKey}`;

    // Fetch data from YouTube API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Hide the error message and display the channel info
            document.getElementById('errorMessage').style.display = 'none';
            const channelData = data.items[0];
            if (channelData) {
                // Show channel info
                document.getElementById('channelInfo').style.display = 'block';
                document.getElementById('channelThumbnail').src = channelData.snippet.thumbnails.default.url;
                document.getElementById('channelTitle').innerText = channelData.snippet.title;
                document.getElementById('channelDescription').innerText = channelData.snippet.description;
                document.getElementById('channelSubscribers').innerText = channelData.statistics.subscriberCount;
                document.getElementById('channelViews').innerText = channelData.statistics.viewCount;
                document.getElementById('channelVideos').innerText = channelData.statistics.videoCount;
            } else {
                // If no channel is found
                document.getElementById('channelInfo').style.display = 'none';
                document.getElementById('errorMessage').style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Something went wrong. Please try again later.');
        });
});
