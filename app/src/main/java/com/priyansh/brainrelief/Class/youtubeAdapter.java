package com.priyansh.brainrelief.Class;


import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

import androidx.recyclerview.widget.RecyclerView;

import com.priyansh.brainrelief.R;

import org.jetbrains.annotations.NotNull;

import java.util.List;

public class youtubeAdapter extends RecyclerView.Adapter<youtubeAdapter.VideoViewHolder> {

    List<YoutubeVideos> youtubeVideoList;

    public youtubeAdapter() {
    }

    public youtubeAdapter(List<YoutubeVideos> youtubeVideoList) {
        this.youtubeVideoList = youtubeVideoList;
    }

    @NotNull
    @Override
    public VideoViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {

        View view = LayoutInflater.from( parent.getContext()).inflate(R.layout.video_view, parent, false);

        return new VideoViewHolder(view);

    }

    @Override
    public void onBindViewHolder(VideoViewHolder holder, int position) {

        holder.videoWeb.loadData( youtubeVideoList.get(position).getVideoUrl(), "text/html" , "utf-8" );

    }

    @Override
    public int getItemCount() {
        return youtubeVideoList.size();
    }

    public class VideoViewHolder extends RecyclerView.ViewHolder{

        WebView videoWeb;

        @SuppressLint("SetJavaScriptEnabled")
        public VideoViewHolder(View itemView) {
            super(itemView);

            videoWeb = itemView.findViewById(R.id.videoWebView);

            videoWeb.getSettings().setJavaScriptEnabled(true);
            videoWeb.setWebChromeClient(new WebChromeClient() {

            } );
        }
    }
}
