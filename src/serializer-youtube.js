const fetch = require('isomorphic-fetch')
const {asSeconds} = require('pomeranian-durations')

const key = process.env.YOUTUBE_KEY

const buildURL = function (id) {
	return `https://www.googleapis.com/youtube/v3/videos?part=status,contentDetails,snippet&id=${id}&key=${key}`
}

const fetchData = async function (id) {
	if (!key) {
		throw new Error('A YOUTUBE_KEY in your .env file is required')
	}
	return fetch(buildURL(id))
}

const serialize = function (json) {
	if (json.items.length === 0) {
		throw new Error('No results found')
	}

	const item = json.items[0]

	return {
		provider: 'youtube',
		id: item.id,
		url: `https://www.youtube.com/watch?v=${item.id}`,

		// Requires ?part=snippet
		title: item.snippet.title,
		thumbnail: item.snippet.thumbnails.default.url,

		// Requires ?part=contentDetails
		// See https://github.com/date-fns/date-fns/pull/348
		// Once date-fns supports durations let's switch to that.
		duration: asSeconds(item.contentDetails.duration),

		// Requires ?part=status
		status: item.status
	}
}

module.exports.fetchData = fetchData
module.exports.serialize = serialize

