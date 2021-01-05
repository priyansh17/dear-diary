package com.priyansh.brainrelief.activity

import android.annotation.SuppressLint
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import android.widget.Toast.makeText
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.ValueEventListener
import com.google.firebase.database.ktx.database
import com.google.firebase.database.ktx.getValue
import com.google.firebase.ktx.Firebase
import com.priyansh.brainrelief.Class.UserProfile
import com.priyansh.brainrelief.R

class EditDiaryActivity : AppCompatActivity() {

    lateinit var EditText : EditText
    lateinit var btnToSave: Button
    lateinit var firebaseAuth: FirebaseAuth
    lateinit var firebaseDatabase: FirebaseDatabase
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edit_diary)

        firebaseAuth= FirebaseAuth.getInstance()
        firebaseDatabase= FirebaseDatabase.getInstance()
        btnToSave=findViewById(R.id.btnTosaveDiary)
        EditText=findViewById(R.id.editTextTextMultiLine2)

        val date = intent.getStringExtra("Date")
        val database = Firebase.database
        var uid : String = firebaseAuth.uid.toString()
        val rootReference = database.getReference(uid)
        val dateReference = database.getReference(uid).child(date.toString())

        rootReference.addListenerForSingleValueEvent(object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                if(snapshot.hasChild(date.toString())){
                    println("Found")
                    dateReference.addValueEventListener(object : ValueEventListener {
                        @SuppressLint("SetTextI18n")
                        override fun onDataChange(dataSnapshot: DataSnapshot) {
                            val previousEntry= dataSnapshot.getValue<String>()
                            EditText.setText(previousEntry)
                        }
                        override fun onCancelled(error: DatabaseError) {
                        }
                    })
                }
                else
                    println("Not found any previous entry")
            }

            override fun onCancelled(error: DatabaseError) {
            }
        })


        btnToSave.setOnClickListener {
            if(EditText.text.toString().length==0)
            {
                Toast.makeText(this,"Can't save blank diary entry",Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            Toast.makeText(this,"Your Entry has been saved and Evaluated",Toast.LENGTH_SHORT).show()
            dateReference.setValue(EditText.text.toString().trim())
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish()
        }



    }

    override fun onBackPressed() {
        val intent = Intent(this, DiaryEntryActivity::class.java)
        startActivity(intent)
        finish()
    }
}