package com.priyansh.brainrelief.activity

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.annotation.RequiresApi
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.ValueEventListener
import com.google.firebase.database.ktx.database
import com.google.firebase.ktx.Firebase
import com.priyansh.brainrelief.Class.DiaryNotes
import com.priyansh.brainrelief.Class.UserProfile
import com.priyansh.brainrelief.R
import kotlinx.android.synthetic.main.activity_diary_entry.*
import java.text.DateFormat
import java.text.SimpleDateFormat
import java.time.LocalDate
import java.util.*
import kotlin.collections.ArrayList

class DiaryEntryActivity : AppCompatActivity() {

    lateinit var calendarView: CalendarView
    lateinit var firebaseAuth: FirebaseAuth
    lateinit var firebaseDatabase: FirebaseDatabase
    lateinit var btnToDiary : Button

    @RequiresApi(Build.VERSION_CODES.O)
    @SuppressLint("SimpleDateFormat")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_diary_entry)
        var date: String
        calendarView = findViewById(R.id.calendar)
        btnToDiary= findViewById(R.id.btnToDiary)

        date=LocalDate.now().toString()

        calendarView.setOnDateChangeListener(object : CalendarView.OnDateChangeListener {
            override fun onSelectedDayChange(view: CalendarView, year: Int, month: Int, dayOfMonth: Int) {

            date = year.toString()+"-"+(month+1).toString()+"-"+dayOfMonth
                println(date)
            }
        })

        btnToDiary.setOnClickListener {
            val intent= Intent(this,EditDiaryActivity::class.java)
            intent.putExtra("Date",date)
            startActivity(intent)
            finish()
        }

    }
    override fun onBackPressed() {
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }
}