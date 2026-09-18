const stations = [
	{
		name: 'Kral FM',
		description: 'A leading Turkish radio station based in Istanbul, Kral FM delivers a vibrant mix of Turkish pop, arabesque, fantasy, international pop, rock, R&B, and Top 40 hits. Known for its engaging DJs, lively talk segments, and music-driven energy, it remains one of Turkey\'s most listened-to stations.',
		country: 'Türkiye',
		url: 'https://dygedge2.radyotvonline.net/kralfm/playlist.m3u8',
		category: 'Turkish arabesque',
		quality: '128kbps',
		cover: './coverarts/kral-fm.jpg'
	},
	{
		name: 'Kral Pop',
		description: 'Specializing in Turkish and international pop, Kral Pop broadcasts from Istanbul with a bright, upbeat playlist of current hits and pop classics. The station adds depth with engaging DJs, news headers, and talk segments, catering to fans of lively, modern pop radio.',
		country: 'Türkiye',
		url: 'https://dygedge.radyotvonline.net/kralpop/playlist.m3u8',
		category: 'Turkish pop',
		quality: '128kbps',
		cover: './coverarts/kral-pop.jpg'
	},
	{
		name: 'Power Türk FM',
		description: 'Turkey\'s high-energy pop station broadcasting the hottest Turkish pop, electro, and Top 40 hits—with a party atmosphere in every show.',
		country: 'Türkiye',
		url: 'https://live.powerapp.com.tr/powerturk/abr/playlist.m3u8',
		category: 'Turkish pop',
		quality: '256kbps',
		cover: './coverarts/power-turk-fm.jpg'
	},
	{
		name: 'America\'s Country',
		description: 'An online country station spinning the biggest hits from the 1990s to today—featuring artists like Luke Combs, Jason Aldean, Brad Paisley, and more, delivered with minimal chatter and lots of musical passion.',
		country: 'United States',
		url: 'https://ais-sa2.cdnstream1.com/1976_128.mp3',
		category: 'Country',
		quality: '128kbps',
		cover: './coverarts/americas-country.jpg'
	},
	{
		name: 'WLTW 106.7 Lite FM',
		description: 'New York\'s leading adult contemporary station, playing soft rock and pop favorites from the past decades to today.',
		country: 'United States',
		url: 'https://stream.revma.ihrhls.com/zc1477/hls.m3u8',
		category: 'Soft adult contemporary',
		quality: '256kbps',
		cover: './coverarts/wltw-106-7-lite-fm.jpg'
	},
	{
		name: 'BBC World Service',
		description: 'Global news, analysis, and features from the BBC, delivering reliable international reporting 24/7 in English and multiple other languages.',
		country: 'United Kingdom',
		url: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
		category: 'News',
		quality: '128kbps',
		cover: './coverarts/bbc-world-service.jpg'
	},
	{
		name: 'BBC Radio 1',
		description: 'BBC Radio 1 focuses on contemporary music, targeting a younger audience with a mix of pop, hip-hop, and dance genres.',
		country: 'United Kingdom',
		url: 'https://a.files.bbci.co.uk/ms6/live/3441A116-B12E-4D2F-ACA8-C1984642FA4B/audio/simulcast/hls/nonuk/audio_syndication_low_sbr_v1/cfs/bbc_radio_one.m3u8',
		category: 'Contemporary hits',
		quality: '128kbps',
		cover: './coverarts/bbc-radio-1.jpg'
	},
	{
		name: 'BBC Radio 2',
		description: 'BBC Radio 2 remains a leading station, known for its wide-ranging music programming and popular breakfast show hosted by Scott Mills.',
		country: 'United Kingdom',
		url: 'https://a.files.bbci.co.uk/ms6/live/3441A116-B12E-4D2F-ACA8-C1984642FA4B/audio/simulcast/hls/nonuk/audio_syndication_low_sbr_v1/aks/bbc_radio_two.m3u8',
		category: 'Adult contemporary',
		quality: '128kbps',
		cover: './coverarts/bbc-radio-2.jpg'
	},
	{
		name: 'Heart FM',
		description: 'Heart is the UK\'s largest commercial radio network, offering a mix of contemporary hits and themed stations like Heart Musicals.',
		country: 'United Kingdom',
		url: 'https://media-ice.musicradio.com/HeartLondonMP3',
		category: 'Adult contemporary',
		quality: '128kbps',
		cover: './coverarts/heart-fm.jpg'
	},
	{
		name: 'WSM 650 AM',
		description: 'The most famous radio station for country music worldwide is generally considered to be WSM 650 AM in Nashville, Tennessee, USA. It\'s iconic for broadcasting the Grand Ole Opry, the legendary country music show that has been on air since 1925. WSM played a huge role in popularizing country music globally.',
		country: 'United States',
		url: 'https://ais-sa8.cdnstream1.com/3666_64.mp3',
		category: 'Classic country',
		quality: '128kbps',
		cover: './coverarts/wsm-650-am.jpg'
	},
	{
		name: 'WNYC 93.9 FM',
		description: 'WNYC is one of New York\'s flagship public radio stations, broadcasting the finest programs from NPR, American Public Media, Public Radio International and the BBC World Service, as well as a wide range of award-winning local programming.',
		country: 'United States',
		url: 'https://fm939.wnyc.org/wnycfm-web',
		category: 'Public radio',
		quality: '256kbps',
		cover: './coverarts/wnyc-93-9-fm.jpg'
	},
	{
		name: 'France Inter',
		description: 'France\'s leading public radio station, offering a blend of news, culture, and entertainment with a focus on in‑depth reporting and diverse programming.',
		country: 'France',
		url: 'https://icecast.radiofrance.fr/franceinter-midfi.mp3',
		category: 'Public generalist',
		quality: '128kbps',
		cover: './coverarts/france-inter.jpg'
	},
	{
		name: 'Deutschlandfunk',
		description: 'Germany\'s premier public news station, delivering comprehensive coverage of national and international events, culture, and current affairs.',
		country: 'Germany',
		url: 'https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3?aggregator=radio-de',
		category: 'News',
		quality: '128kbps',
		cover: './coverarts/deutschlandfunk.jpg'
	},
	{
		name: 'Xezer 103 FM',
		description: 'Azerbaijan\'s popular radio station based in Baku, playing a mix of pop, rock, R&B, and Azerbaijani folk music, along with news and entertainment.',
		country: 'Azerbaijan',
		url: 'https://s40.myradiostream.com/22546/listen.mp3',
		category: 'Pop / dance',
		quality: '128kbps',
		cover: './coverarts/xezer-103-fm.jpg'
	}
];
