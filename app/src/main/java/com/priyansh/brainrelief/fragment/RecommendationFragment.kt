package com.priyansh.brainrelief.fragment

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.chaquo.python.PyObject
import com.chaquo.python.Python
import com.chaquo.python.android.AndroidPlatform
import com.priyansh.brainrelief.Class.YoutubeVideos
import com.priyansh.brainrelief.Class.youtubeAdapter
import com.priyansh.brainrelief.R
import com.priyansh.brainrelief.activity.LoginActivity
import com.priyansh.brainrelief.activity.MainActivity
import java.util.*

class RecommendationFragment : Fragment() {


    lateinit var recyclerView: RecyclerView
    lateinit var sharedPreferences: SharedPreferences
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_recommendation, container, false)
        recyclerView = view.findViewById(R.id.recyclerViewForRecommendation)
        sharedPreferences =
            if (activity?.getSharedPreferences(
                    getString(R.string.shared_preferences),
                    Context.MODE_PRIVATE
                ) != null
            )
                activity?.getSharedPreferences(
                    getString(R.string.shared_preferences),
                    Context.MODE_PRIVATE
                )!!
            else throw NullPointerException("Expression 'activity?.getSharedPreferences(getString(R.string.shared_preferences), Context.MODE_PRIVATE)' must not be null")

        val ArrayToUse = arrayOf<Int>(1, 2, 3, 4, 5, 6, 7, 8, 9)

        for (i in 0..8)
            ArrayToUse[i] = sharedPreferences.getInt("Rating$i", i + 1)

        if (!Python.isStarted()) {
            Python.start(AndroidPlatform(activity))
        }

        val python: Python = Python.getInstance()
        val pyObject: PyObject = python.getModule("storage")
        val text = "i am neutral"  //for 1st time
        val objectToPrint: PyObject = pyObject.callAttr("by_def", ArrayToUse)
        println(objectToPrint.asList())

        recyclerView.layoutManager = LinearLayoutManager(activity)
        val youtubeVideos: Vector<YoutubeVideos> = Vector<YoutubeVideos>()

        for (i in 0..objectToPrint.asList().size - 1) {
            youtubeVideos.add(YoutubeVideos("<iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/${objectToPrint.asList()[i].toString().trim()}\" frameborder=\"0\" allowfullscreen></iframe>"))
        }/*
        youtubeVideos.add(YoutubeVideos("<iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/403FGqa-Uv8\" frameborder=\"0\" allowfullscreen></iframe>"))
        youtubeVideos.add(YoutubeVideos("<iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/zUDXj8REpAI\" frameborder=\"0\" allowfullscreen></iframe>"))
        youtubeVideos.add(YoutubeVideos("<iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/QEpCG6suios\" frameborder=\"0\" allowfullscreen></iframe>"))
        youtubeVideos.add(YoutubeVideos("<iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/LclR9uqrGN4\" frameborder=\"0\" allowfullscreen></iframe>"))
        youtubeVideos.add(YoutubeVideos("<iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/aEYXiZ1qx90\" frameborder=\"0\" allowfullscreen></iframe>"))
        */
        val videoAdapter = youtubeAdapter(youtubeVideos)
        recyclerView.adapter = videoAdapter





        return view

    }


}