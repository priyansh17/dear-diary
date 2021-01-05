package com.priyansh.brainrelief.activity

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.RatingBar
import androidx.annotation.RequiresApi
import com.chaquo.python.PyObject
import com.chaquo.python.Python
import com.chaquo.python.android.AndroidPlatform
import com.priyansh.brainrelief.Class.Ratings
import com.priyansh.brainrelief.R
import java.util.*
import kotlin.Comparator

class UserInterests : AppCompatActivity() {

    lateinit var sharedPreferences: SharedPreferences
    lateinit var danceRatingBar: RatingBar
    lateinit var vLogRatingBar: RatingBar
    lateinit var standUpRatingBar: RatingBar
    lateinit var musicRatingBar: RatingBar
    lateinit var mindPuzzlesRatingBar: RatingBar
    lateinit var storyBooksRatingBar: RatingBar
    lateinit var biographiesRatingBar: RatingBar
    lateinit var songsRatingBar: RatingBar
    lateinit var shortStoriesRatingBar: RatingBar
    lateinit var submitButton: Button


    @RequiresApi(Build.VERSION_CODES.N)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.recommended_stars)

        sharedPreferences=getSharedPreferences(getString(R.string.shared_preferences), Context.MODE_PRIVATE)
        danceRatingBar=findViewById(R.id.danceRating)
        vLogRatingBar=findViewById(R.id.vLogsRating)
        standUpRatingBar=findViewById(R.id.standupRating)
        musicRatingBar=findViewById(R.id.musicRating)
        mindPuzzlesRatingBar=findViewById(R.id.puzzlesRating)
        storyBooksRatingBar=findViewById(R.id.storyBooksRating)
        biographiesRatingBar=findViewById(R.id.biographiesRating)
        shortStoriesRatingBar=findViewById(R.id.shortStoriesRating)
        songsRatingBar=findViewById(R.id.SongsRating)
        submitButton=findViewById(R.id.buttonToSubmitStars)

        val list= mutableListOf<Ratings>()
        //1Biography
        //2Dance
        //3Mind_teaser
        //4Music
        //5Song
        //6StandUp
        //7Story
        //8Story_books
        //9VLog

        val ratingComparator =  Comparator<Ratings> { obj1, obj2 ->
            if(obj1.rate.toString().compareTo(obj2.rate.toString(), ignoreCase = true)==0){
                obj2.name.toString().compareTo(obj1.name.toString(), ignoreCase = true)
            }
            else{
                obj1.rate.toString().compareTo(obj2.rate.toString(), ignoreCase = true)
            }
        }

        submitButton.setOnClickListener {
            var obj= Ratings(biographiesRatingBar.rating,"Biography","1")
            list.add(obj)
            obj= Ratings(danceRatingBar.rating,"Dance","2")
            list.add(obj)
            obj= Ratings(mindPuzzlesRatingBar.rating,"Mind Puzzles","3")
            list.add(obj)
            obj= Ratings(musicRatingBar.rating,"Music","4")
            list.add(obj)
            obj= Ratings(songsRatingBar.rating,"Songs","5")
            list.add(obj)
            obj= Ratings(standUpRatingBar.rating,"Stand Up","6")
            list.add(obj)
            obj= Ratings(shortStoriesRatingBar.rating,"Short Stories","7")
            list.add(obj)
            obj= Ratings(storyBooksRatingBar.rating,"Story Books","8")
            list.add(obj)
            obj= Ratings(vLogRatingBar.rating,"VLog","9")
            list.add(obj)

            Collections.sort(list,ratingComparator)
            list.reverse()

            val ArrayToPass = arrayOf<Int>(1,2,3,4,5,6,7,8,9)

            for(i in 0..(list.size-1)){
                ArrayToPass[i]=(list[i].number.toInt())
            }

            for (i in 0..8) {
                sharedPreferences.edit().putInt("Rating$i", ArrayToPass[i]).apply()
            }

            list.clear()


            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish()


           /*
            */


        }
    }
    override fun onBackPressed() {
        val intent = Intent(applicationContext, MainActivity::class.java)
        startActivity(intent)
        finish()
    }

}