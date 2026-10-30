const songs = [
    { title: "Acoustic Saloon Breeze", artist: "Dustline Band", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Desert Sunset Rider", artist: "Harmon & The Cowboys", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Midnight Tavern Groove", artist: "Wild West Trio", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { title: "Honky Tonk Piano Night", artist: "Mabel Keys", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { title: "Gold Rush Banjo Beat", artist: "Cactus Jack", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" }
];
let queue = [];

const player = document.getElementById("audio-player")
const currentTitle = document.getElementById("current-title")
const currentTimeText = document.getElementById("current-time")
const progressBar = document.getElementById("progress-bar")
const libraryList = document.getElementById("library-list")
const queueList = document.getElementById("queue-list")
const queueCount = document.getElementById("queue-count")
  

function renderLibrary(filter = "") {
    libraryList.innerHTML = "";
    songs.forEach((song, index) => {
        const fullText = `${song.title} ${song.artist}`.toLowerCase();
        if (fullText.includes(filter.toLowerCase())) {
            const li = document.createElement("li");
            li.innerHTML = `
            <div>
                    <strong>${song.title}</strong><br>
                    <small>${song.artist}</small>
                </div>
                <button onclick="addToQueue(${index})">+ Queue</button>
            `;
            libraryList.appendChild(li);
        }
    });
}
function addToQueue(index) {
    queue.push(songs[index]);
    updateQueueUI();
    if (player.paused) {
        playNext();
    }
}

function playAudio() {
    if (player.src && player.src !== window.location.href) {
        player.play();
    } else if (queue.length > 0) {
        playNext();
    }
}
function removeFromQueue(queueIndex) {
    queue.splice(queueIndex, 1);
    updateQueueUI();
}
function clearQueue() {
    queue = [];
    updateQueueUI();
}
function updateQueueUI() {
    queueList.innerHTML ="";
    queueCount.innerText= queue.length;
    if (queue.length === 0) {
            queueList.innerHTML = "<li><span>Queue is currently empty. Add tracks above!</span></li>";
            return;
    }

queue.forEach((song, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <span>${i + 1}. <strong>${song.title}</strong> - ${song.artist}</span>
                <button class="remove-btn" onclick="removeFromQueue(${i})">Remove</button>
            `;
            queueList.appendChild(li);
});
}
function playNext(){
    if (queue.length > 0){
        const nextSong = queue.shift();
        player.src = nextSong.url;
       currentTitle.innerText = `${nextSong.title} - ${nextSong.artist}`;
        player.play();
        updateQueueUI();
    }else{
        player.src = "";
        currentTitle.innerText = "Queue finished! pick another song.";
        progressBar.value = 0;
        currentTimeText.innerText = "0:00 / 0:00"
    }
}
function pauseAudio() {
    player.pause();
}

function skipTrack() {
    playNext();
}

function changeVolume() {
    const slider = document.getElementById("volume-slider");
    const volumeValue = document.getElementById("volume-value");
    player.volume = slider.value;
    volumeValue.innerText = Math.round(slider.value * 100) + "%";
}

function searchTracks() {
    const text = document.getElementById("search-input").value;
    renderLibrary(text);
}

function requestSong() {
    const titleInput = document.getElementById("new-title");
    const urlInput = document.getElementById("new-url");
    if (titleInput.value.trim() !== "" && urlInput.value.trim() !== "") {
        songs.push({
            title: titleInput.value.trim(),
            artist: "Saloon Guest Request",
            url: urlInput.value.trim()
        });
        renderLibrary();
        titleInput.value = "";
        urlInput.value = "";
        alert("Song added to the Saloon Library!");
    } else {
        alert("Please enter both a song title and a valid MP3 link!");
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

player.addEventListener("timeupdate", () => {
    if (player.duration) {
        const percent = (player.currentTime / player.duration) * 100;
        progressBar.value = percent;
        currentTimeText.innerText = `${formatTime(player.currentTime)} / ${formatTime(player.duration)}`;
    }
});

player.addEventListener("ended", playNext);

renderLibrary();
updateQueueUI();
