const bar = document.getElementById("search-bar");
const search = document.getElementById("search-table");
const button = document.getElementById("search-button");
const warn = document.getElementById("warn");
const searched = document.getElementById("findes");
const musicContainer = document.querySelector(".music-container");
const player = document.getElementById("player");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const songTitle = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const currTime = document.querySelector("#currTime");
const durTime = document.querySelector("#durTime");
const title = document.title;
const songs = [{
    name: "Khoda Kooshi",
    artist: "Arta (Ft Mehrad Hidden)",
    source: "https://dl.prymie.com/arta/music/Khoda_Kooshi.mp3"
},
{
    name: "Maar",
    artist: "Mehrad Hidden",
    source: "https://www.appahang5.com/cdn/tracks-mp3/1397/08/2467164776613658871647766136159716477661364280.mp3"
}];
let findes;

/**
 * 
 * @param {boolean} isTyping 
 * @param {Element} element 
 * @returns 
 */
function play(isTyping = false, element = null) {
    if (isTyping && element) {
        const [value] = element.innerHTML.toString().split(" - ");
        searched.classList.remove("typing");
        findes = songs.filter(a => a.name.includes(value));
        if (!findes || findes.length < 1) return warn.innerHTML = "! This music undefind";
        warn.innerHTML = "";
        searched.innerHTML = "";
        search.value = "";
        player.hidden = false;
    } else {
        const value = search.value;
        if (!value) return warn.innerHTML = "! please fillout the table before click on button";
        findes = songs.filter(a => a.name.toLowerCase().includes(value.toLowerCase()) || a.artist.toLowerCase().includes(value.toLowerCase()));
        if (!findes || findes.length < 1) return warn.innerHTML = "! This music undefind";
        warn.innerHTML = "";
        search.value = "";
        searched.innerHTML = "";
        player.hidden = false;
    };

    let songIndex = findes.length < 1 ? 0 : findes.length - 1;

    // Update song details
    /**
     * 
     * @param {songs[number]} song 
     * @returns
     */
    function loadSong(song) {
        songTitle.innerText = song.name;
        artist.innerText = song.artist;
        audio.src = `${song.source}`;
        cover.src = `/images/${song.name}.jpg`;
    }

    // Play song
    function playSong() {
        if (songTitle.innerText === "") loadSong(findes[songIndex]);
        musicContainer.classList.add("play");
        playBtn.querySelector("i.fas").classList.remove("fa-play");
        playBtn.querySelector("i.fas").classList.add("fa-pause");
        audio.play();
    }

    // Pause song
    function pauseSong() {
        musicContainer.classList.remove("play");
        playBtn.querySelector("i.fas").classList.add("fa-play");
        playBtn.querySelector("i.fas").classList.remove("fa-pause");
        audio.pause();
    }

    // Previous song
    function prevSong() {
        songIndex--;

        if (songIndex < 0) {
            songIndex = findes.length - 1;
        }

        loadSong(findes[songIndex]);

        playSong();
    }

    // Next song
    function nextSong() {
        songIndex++;

        if (songIndex > findes.length - 1) {
            songIndex = 0;
        }

        loadSong(findes[songIndex]);

        playSong();
    }

    // Update progress bar
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
    }

    // Set progress bar
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;

        audio.currentTime = (clickX / width) * duration;
    }

    //get duration & currentTime for Time of song
    function DurTime(e) {
        const { duration, currentTime } = e.srcElement;
        var sec;
        var sec_d;

        // define minutes currentTime
        let min = (currentTime == null) ? 0 :
            Math.floor(currentTime / 60);
        min = min < 10 ? "0" + min : min;

        // define seconds currentTime
        function get_sec(x) {
            if (Math.floor(x) >= 60) {

                for (var i = 1; i <= 60; i++) {
                    if (Math.floor(x) >= (60 * i) && Math.floor(x) < (60 * (i + 1))) {
                        sec = Math.floor(x) - (60 * i);
                        sec = sec < 10 ? "0" + sec : sec;
                    }
                }
            } else {
                sec = Math.floor(x);
                sec = sec < 10 ? "0" + sec : sec;
            }
        }

        get_sec(currentTime, sec);

        // change currentTime DOM
        currTime.innerHTML = min + ":" + sec;

        // define minutes duration
        let min_d = (isNaN(duration) === true) ? "0" :
            Math.floor(duration / 60);
        min_d = min_d < 10 ? "0" + min_d : min_d;


        function get_sec_d(x) {
            if (Math.floor(x) >= 60) {

                for (var i = 1; i <= 60; i++) {
                    if (Math.floor(x) >= (60 * i) && Math.floor(x) < (60 * (i + 1))) {
                        sec_d = Math.floor(x) - (60 * i);
                        sec_d = sec_d < 10 ? "0" + sec_d : sec_d;
                    }
                }
            } else {
                sec_d = (isNaN(duration) === true) ? "0" :
                    Math.floor(x);
                sec_d = sec_d < 10 ? "0" + sec_d : sec_d;
            }
        }

        // define seconds duration

        get_sec_d(duration);

        // change duration DOM
        durTime.innerHTML = min_d + ":" + sec_d;

    };

    // Event listeners
    playBtn.addEventListener("click", () => {
        const isPlaying = musicContainer.classList.contains("play");

        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    // Change song
    prevBtn.addEventListener("click", prevSong);
    nextBtn.addEventListener("click", nextSong);

    // Time/song update
    audio.addEventListener("timeupdate", updateProgress);

    // Click on progress bar
    progressContainer.addEventListener("click", setProgress);

    // Song ends
    audio.addEventListener("ended", nextSong);

    // Time of song
    // audio.addEventListener("timeupdate", DurTime);
};

window.addEventListener("focus", () => {
    document.title = title;
});

window.addEventListener("blur", () => {
    document.title = "Came back I miss u :(";
});

search.addEventListener("change", () => {
    const value = search.value;
    if (value == "") return searched.innerHTML = "";
    const typing = songs.filter(a => a.name.toLowerCase().includes(value.toLowerCase()) || a.artist.toLowerCase().includes(value.toLowerCase()));
    warn.innerHTML = "";
    searched.classList.add("typing");
    searched.innerHTML = typing.map(a => `<li class="song">${a.name} - ${a.artist}</li>`).join("");
    document.querySelectorAll(".song").forEach(element => {
        element.addEventListener("click", () => play(true, element));
    });
});

button.addEventListener("click", () => play());
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */