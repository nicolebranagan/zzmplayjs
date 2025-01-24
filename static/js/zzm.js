function parseZzmAsText(text) {
  const lines = text.replace("\n", "\n").split("\n");
  let title = "Unknown Album";
  let songTitles = [];
  let songDatas = [];
  let currentSong = undefined;
  let inited = false;
  for (const line of lines) {
    if (line.includes("; $TITLE")) {
      title = line.substring("; $TITLE".length);
    }

    if (line.includes("$SONGS BEGIN")) {
      inited = true;
    }

    if (!inited) {
      continue;
    }

    if (line.includes("; $SONG TITLE")) {
      const titleData = line.substring("; $SONG TITLE ".length);
      const splitData = titleData.split(' ')
      const idx = parseInt(splitData.shift(), 10);
      songTitles[idx] = splitData.join(' ').replace('\r', '');
    }

    if (line.includes("; $SONG ")) {
      const songData = line.substring("; $SONG ".length);
      currentSong = parseInt(songData, 10);
    }

    if (line.length === 0 || line[0] === ";" || line[0] === "\r") {
      continue;
    }

    if (currentSong === undefined) {
      throw new Error(`Unexpected music data ${line}`);
    }

    if (!songDatas[currentSong]) {
      songDatas[currentSong] = []
    }

    songDatas[currentSong].push(line.replace("\r", ""));
  }

  const songs = [];

  for (let i = 0; i < songDatas.length; i++) {
    if (songDatas[i] === undefined) {
      if (songTitles[i] !== undefined) {
        console.error(`No song data for track ${i}: ${songTitles[i]}`)
      }
      continue;
    }

    let songTitle = songTitles[i];
    if (!songTitles[i]) {
      songTitle = `Unknown Track ${i}`;
    }

    songs.push({
      index: i,
      title: songTitle,
      data: songDatas[i].join('')
    });
  }

  return {
    title,
    songs
  }
}