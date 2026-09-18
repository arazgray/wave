# Media Session artwork with default fallback

`DEFAULT_COVER_ART` is `'./cover-art-placeholder.jpg'`. The key point: list the
station cover first **and** the default cover after it. If the station file is
missing or not yet uploaded (404), the OS falls through to the default instead
of showing nothing.

```js
const DEFAULT_COVER_ART = './cover-art-placeholder.jpg';

function resolveArtworkSrc(src) {
	try {
		return new URL(src, document.baseURI).href;
	} catch (error) {
		return src;
	}
}

function getStationArtwork(station) {
	const sizes = ['96x96', '128x128', '192x192', '512x512'];
	const artwork = [];

	if (station.cover) {
		const stationSrc = resolveArtworkSrc(station.cover);
		sizes.forEach(size => {
			artwork.push({ src: stationSrc, sizes: size, type: 'image/jpeg' });
		});
	}

	const defaultSrc = resolveArtworkSrc(DEFAULT_COVER_ART);
	sizes.forEach(size => {
		artwork.push({ src: defaultSrc, sizes: size, type: 'image/jpeg' });
	});

	return artwork;
}

function updateMediaSession(station) {
	if ('mediaSession' in navigator) {
		navigator.mediaSession.metadata = new MediaMetadata({
			title: station.name,
			artist: station.category,
			album: station.country,
			artwork: getStationArtwork(station)
		});
		// ... setActionHandler('nexttrack' / 'previoustrack' / 'play' / 'pause')
	}
}
```

Expected behavior (verified by stubbing `document.baseURI` in node):

- `{ name: 'X' }` (no cover) → 4 default entries.
- `{ cover: './coverarts/kral-fm.jpg' }` → 4 station entries + 4 default entries.
- `{ cover: '' }` (empty string) → 4 default entries (falsy, skipped).
