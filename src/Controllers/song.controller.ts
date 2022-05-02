import ytdl, { videoInfo } from 'ytdl-core';
import yts, { Video } from 'youtube-sr';

export interface Song {
    title: string,
    url: string,
    user: string,
    time: number,
    display: string | undefined
}

const CreateSong = (_songInfo: videoInfo | Video, _type: "link" | "search"): Song | null => {

    if (_type == "link") {
        const songInfo = _songInfo as videoInfo;
        return {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            user: '',
            time: parseInt(songInfo.videoDetails.lengthSeconds),
            display: songInfo.videoDetails.thumbnails[0].url,
        };
    } else if (_type == "search") {
        const songInfo = _songInfo as Video;
        return {
            title: songInfo.title!,
            url: songInfo.url,
            user: '',
            time: songInfo.duration / 1000,
            display: songInfo.thumbnail?.url,
        }
    } else {
        return null;
    }

}

export const searchSong = async (search: string): Promise<Song | null> => {

    if (search.startsWith('https://') || search.startsWith('www.')) {

        if (search.includes('/playlist?list')) return null;
        const url = (search.includes('https://')) ? search.replace(' ', '') : 'https://' + search.replace(' ', '');

        const songInfo = await ytdl.getInfo(url);
        if (songInfo.videoDetails == null) return null;
        return CreateSong(songInfo, "link");

    } else {
        const songInfo = await yts.search(search, { limit: 1, type: 'video' });
        if (songInfo.length == 0) return null;
        return CreateSong(songInfo[0], "search");
    }
}