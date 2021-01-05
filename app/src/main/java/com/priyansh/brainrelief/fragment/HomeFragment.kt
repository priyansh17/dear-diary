package com.priyansh.brainrelief.fragment

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.priyansh.brainrelief.Class.youtubeAdapter
import com.priyansh.brainrelief.Class.YoutubeVideos
import com.priyansh.brainrelief.R
import com.priyansh.brainrelief.activity.DiaryEntryActivity
import com.priyansh.brainrelief.activity.InstantFeedbackActivity
import com.priyansh.brainrelief.activity.UserInterests
import java.util.*


class HomeFragment : Fragment(){


    lateinit var  scrollView: ScrollView
    lateinit var btnToAddDiary : Button
    lateinit var btnToAskRecommendation : Button
    lateinit var btnToFillFAQ : Button
    /*lateinit var displayVideoV1 : VideoView
    lateinit var displayVideoV2 : VideoView
    lateinit var displayVideoV3 : VideoView
    lateinit var mediaController: MediaController
    lateinit var mediaController2: MediaController
    lateinit var mediaController3 : MediaController
    */
    lateinit var editTextForRecommendation : EditText
    lateinit var recyclerView: RecyclerView

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view= inflater.inflate(R.layout.fragment_home, container, false)

        editTextForRecommendation=view.findViewById(R.id.editTextDiaryEntry)
        scrollView=view.findViewById(R.id.scrollView)
        recyclerView=view.findViewById(R.id.recyclerView)
        //recyclerView.setHasFixedSize(true)
        btnToAddDiary=view.findViewById(R.id.buttonToDiaryEntry)
        btnToAskRecommendation=view.findViewById(R.id.buttonToInstantRecommendation)
        btnToFillFAQ=view.findViewById(R.id.buttonToFAQ)
        //displayVideoV1=view.findViewById(R.id.displayV1)



        /*mediaController=MediaController(activity)
        mediaController.setAnchorView(displayVideoV1)
        displayVideoV1.setVideoURI(Uri.parse("https://videocdn.bodybuilding.com/video/mp4/62000/62792m.mp4"))
        displayVideoV1.setMediaController(mediaController)
        displayVideoV1.pause()
        */
        scrollView.smoothScrollTo(0, 0)


        btnToAskRecommendation.setOnClickListener {
            val intent = Intent(activity?.applicationContext, InstantFeedbackActivity::class.java)
            intent.putExtra("user_input", editTextForRecommendation.text.toString().trim())
            startActivity(intent)
            activity?.finish()
        }

        btnToFillFAQ.setOnClickListener {
            val intent = Intent(activity?.applicationContext, UserInterests::class.java)
            startActivity(intent)
            activity?.finish()
        }


        btnToAddDiary.setOnClickListener {
            val intent = Intent(activity?.applicationContext, DiaryEntryActivity::class.java)
            startActivity(intent)
            activity?.finish()
        }
        recyclerView.layoutManager = LinearLayoutManager(activity)
        val youtubeVideos: Vector<YoutubeVideos> = Vector<YoutubeVideos>()
        youtubeVideos.add(YoutubeVideos("<iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/Q10cs2QJgeo\" frameborder=\"0\" allowfullscreen></iframe>"))
        youtubeVideos.add(YoutubeVideos("<iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/h3uJKEDsyCM\" frameborder=\"0\" allowfullscreen></iframe>"))
        youtubeVideos.add(YoutubeVideos("<iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/fBVJoIbNjdQ\" frameborder=\"0\" allowfullscreen></iframe>"))
        youtubeVideos.add(YoutubeVideos("<iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/fDMu9BXMR-U\" frameborder=\"0\" allowfullscreen></iframe>"))
        youtubeVideos.add(YoutubeVideos("<iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/6JnmIQxRZwI\" frameborder=\"0\" allowfullscreen></iframe>"))

        val videoAdapter = youtubeAdapter(youtubeVideos)
        recyclerView.adapter = videoAdapter
        return view
    }
}