package com.priyansh.brainrelief.activity

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.core.view.isVisible
import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.priyansh.brainrelief.R

class LoginActivity : AppCompatActivity() {

    lateinit var txtmobileNumber: EditText
    lateinit var txtPassword: EditText
    lateinit var btnLogin: Button
    lateinit var txtForgotPassword: TextView
    lateinit var txtRegisterYourself: TextView
    lateinit var sharedPreferencess: SharedPreferences
    lateinit var firebaseAuth: FirebaseAuth
    lateinit var userMail: String
    lateinit var userPassword: String
    lateinit var progressDialog: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        try {
            this.supportActionBar!!.hide()
        } catch (e: NullPointerException) {
        }

        sharedPreferencess = getSharedPreferences(getString(R.string.shared_preferences), Context.MODE_PRIVATE)
        progressDialog = findViewById(R.id.progressBar)
        firebaseAuth = FirebaseAuth.getInstance()
        txtmobileNumber = findViewById(R.id.username)
        txtRegisterYourself = findViewById(R.id.register)
        txtPassword = findViewById(R.id.password)
        txtForgotPassword = findViewById(R.id.forgotPassword)
        btnLogin = findViewById(R.id.buttonLogin)

        progressDialog.visibility = View.GONE

        val isLoggedIn = sharedPreferencess.getBoolean("user_logged_in", false)

        //val user = Firebase.auth.currentUser
        if (isLoggedIn) {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish()
        }


        txtRegisterYourself.setOnClickListener {
            val intent = Intent(
                this@LoginActivity,
                RegisterActivity::class.java
            )
            startActivity(intent)
            finish()
        }

        txtForgotPassword.setOnClickListener {
            val intent = Intent(
                this@LoginActivity,
                ForgotPassword::class.java
            )
            startActivity(intent)
            finish()
        }

        btnLogin.setOnClickListener {

            progressDialog.visibility = View.VISIBLE

            if (txtmobileNumber.text.isBlank()) {
                txtmobileNumber.error = "Empty Email"
                return@setOnClickListener
            }
            if (txtPassword.text.isBlank() || txtPassword.text.length < 8) {
                txtPassword.error = "Invalid password"
                return@setOnClickListener
            }



            userMail = txtmobileNumber.text.toString().trim()
            userPassword = txtPassword.text.toString().trim()
            firebaseAuth.signInWithEmailAndPassword(userMail, userPassword).addOnCompleteListener(
                OnCompleteListener {
                    if (it.isSuccessful) {
                        if (checkVerification()) {
                            sharedPreferencess.edit().putBoolean("user_logged_in", true).apply()
                            Toast.makeText(this, "Login Successful", Toast.LENGTH_SHORT).show()
                            val intent = Intent(
                                this@LoginActivity,
                                UserInterests::class.java
                            )
                            startActivity(intent)
                            finish()
                        } else {
                            Toast.makeText(this, "Verify Your email to login", Toast.LENGTH_SHORT)
                                .show()
                            firebaseAuth.signOut()
                        }
                    } else {
                        Toast.makeText(this, "Login Failed", Toast.LENGTH_SHORT).show()
                    }
                })

            progressDialog.visibility = View.GONE
        }


    }

    private fun checkVerification(): Boolean {
        val firebaseUser: FirebaseUser = firebaseAuth.currentUser!!
        val flag:Boolean = firebaseUser.isEmailVerified
        return flag
    }

}