import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { VideosPerPage } from 'src/app/app.constant';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {

  @Input() videos: Array<{ videoId: string }>;
  @ViewChildren(YouTubePlayer) allPlayers: QueryList<YouTubePlayer>;

  currentPage: number = 1;
  totalItems: number = 1;
  readonly videosPerPage = VideosPerPage;

  ngOnInit(): void {
    this.totalItems = (this.videos || []).length;
  }

  onStateChange(state: YT.OnStateChangeEvent, playIndex) {
    if (state.data === YT.PlayerState.PLAYING) {
      (this.allPlayers || []).forEach((videoPlayer: YouTubePlayer, index) => {
        index !== playIndex && videoPlayer.stopVideo();
      })
    }
  }

}
