package com.priyansh.brainrelief.activity

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import com.google.firebase.auth.FirebaseAuth
import com.priyansh.brainrelief.R

class ForgotPassword : AppCompatActivity() {

    lateinit var email : EditText
    lateinit var btn : Button
    lateinit var firebaseAuth: FirebaseAuth
    lateinit var mail :String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_forgot_password)

        email=findViewById(R.id.emailid)
        btn=findViewById(R.id.buttonForgotpassword)
        firebaseAuth= FirebaseAuth.getInstance()


        btn.setOnClickListener {
            mail=email.text.toString().trim()
            if (mail.isBlank()) {
                email.error = "Empty Email"
                return@setOnClickListener
            }
            firebaseAuth.sendPasswordResetEmail(mail).addOnCompleteListener {
                if(it.isSuccessful)
                {
                    Toast.makeText(this,"An Email has been sent to You with reset link",Toast.LENGTH_LONG).show()
                    val intent=Intent(this,LoginActivity::class.java)
                    startActivity(intent)
                    finish()
                }else
                {
                    Toast.makeText(this,"Error! Wrong Email entered.",Toast.LENGTH_SHORT).show()
                }
            }

        }

    }

    override fun onBackPressed(){

        val intent = Intent(this@ForgotPassword,
            LoginActivity::class.java)
        startActivity(intent)
        finish()
    }
}