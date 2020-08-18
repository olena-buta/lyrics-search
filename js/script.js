const apiURL = 'https://api.lyrics.ovh';
const form = document.getElementById('form-search');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  showData(data);
}

function showData(data) {
  result.innerHTML = `
  <ul class="songs">
    ${data.data.map(song => `<li>
        <span class="song-all"><strong class="song-band">${song.artist.name}</strong> - ${song.title}</span>
        <button class="btn lyric-btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
      </li>`
  ).join('')}
  </ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
      ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
      ${data.next ? `<button class="btn" onclick = "getMoreSongs('${data.next}')">Next</button>` : ''}
    `;
  } else {
    more.innerHTML = '';
  }
}

async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}

async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

  result.innerHTML = `
    <h2 class="artist-title"><strong>${artist}</strong> - ${songTitle}</h2>
    <p>${lyrics}</p>
  `;

  more.innerHTML = `
    <button class="btn" type="button" onclick="closeLyrics()"><i class="fas fa-times"></i></button>
  `;
}

function closeLyrics() {
  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert('Please type in a search term');
  } else {
    searchSongs(searchTerm);
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert('Please type in a search term');
  } else {
    searchSongs(searchTerm);
  }
});

result.addEventListener('click', e => {
  const clickedEl = e.target;
  if (clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist, songTitle);
  }
});
