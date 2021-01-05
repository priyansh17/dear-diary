package com.priyansh.brainrelief.activity

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TextView
import com.chaquo.python.PyObject
import com.chaquo.python.Python
import com.chaquo.python.android.AndroidPlatform
import com.priyansh.brainrelief.R
import org.w3c.dom.Text

class InstantFeedbackActivity : AppCompatActivity() {

    lateinit var movieName1 : TextView
    lateinit var movieName2 : TextView
    lateinit var movieName3 : TextView
    lateinit var movieName4 : TextView
    lateinit var movieName5 : TextView
    lateinit var sentimentTxt : TextView
    lateinit var sharedPreferences: SharedPreferences

    @SuppressLint("SetTextI18n")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_instant_feedback)

        movieName1=findViewById(R.id.movieName1)
        movieName2=findViewById(R.id.movieName2)
        movieName3=findViewById(R.id.movieName3)
        movieName4=findViewById(R.id.movieName4)
        movieName5=findViewById(R.id.movieName5)
        sentimentTxt=findViewById(R.id.txtSentimentAnalysis)

        val stringFromUser: String= intent.extras?.getString("user_input","i am sad")!!

        sharedPreferences=
            if (getSharedPreferences(getString(R.string.shared_preferences), Context.MODE_PRIVATE) != null)
                getSharedPreferences(getString(R.string.shared_preferences), Context.MODE_PRIVATE)!!
            else throw NullPointerException("Expression 'activity?.getSharedPreferences(getString(R.string.shared_preferences), Context.MODE_PRIVATE)' must not be null")

        val ArrayToUse= arrayOf<Int>(1,2,3,4,5,6,7,8,9)

        for(i in 0..8)
            ArrayToUse[i]=sharedPreferences.getInt("Rating$i",i+1)

        if(!Python.isStarted()) {
            Python.start(AndroidPlatform(this))
        }

        val python: Python = Python.getInstance()
        val pyObject: PyObject = python.getModule("Main")
        val obj2:PyObject = pyObject.callAttr("emotion",stringFromUser)
        val obj:PyObject = pyObject.callAttr("main2",stringFromUser)
        val obj3:PyObject = pyObject.callAttr("counters",obj2)
        val obj4:PyObject= pyObject.callAttr("scores",stringFromUser)
        val obj5:PyObject=pyObject.callAttr("typeOfSentiment",stringFromUser)

        println(obj)
        val size= obj.asList().size
        if(size>=1) {
            movieName1.text = obj.asList()[0].toString().trim()
        }
        if(size>=2) {
            movieName2.text = obj.asList()[1].toString().trim()
        }
        if(size>=3) {
            movieName3.text = obj.asList()[2].toString().trim()
        }
            if(size>=4) {
            movieName4.text = obj.asList()[3].toString().trim()
        }
        if(size>=5) {
            movieName5.text = obj.asList()[4].toString().trim()
        }
        sentimentTxt.text="Emotions: "+obj2.toString().trim()+"  "+obj3.toString().trim()+" Scores: "+obj4.toString().trim()+" Type: "+obj5.toString().trim()
    }

    override fun onBackPressed() {
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }
}