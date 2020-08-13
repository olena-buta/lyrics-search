const apiURL = 'https://api.lyrics.ovh';
const form = document.getElementById('form-search');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  let data = await res.json();

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
