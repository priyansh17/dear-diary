package com.priyansh.brainrelief.activity

import android.content.Intent
import android.content.SharedPreferences
import android.graphics.Bitmap
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.preference.PreferenceManager
import android.provider.MediaStore
import android.text.BoringLayout
import android.util.Log
import android.view.View
import android.widget.*
import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.ktx.database
import com.google.firebase.ktx.Firebase
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference
import com.google.firebase.storage.UploadTask
import com.priyansh.brainrelief.R
import com.priyansh.brainrelief.Class.UserProfile
import kotlinx.android.synthetic.main.activity_register.*

class RegisterActivity : AppCompatActivity() {

    lateinit var txtmobileNumber : EditText
    var checkedGender : Boolean = false
    lateinit var gender : String
    lateinit var txtPassword : EditText
    lateinit var txtName : EditText
    lateinit var btnRegister : Button
    lateinit var txtConfirmPassword : EditText
    lateinit var txtemail : EditText
    lateinit var txtAge : EditText
    lateinit var sharedPreferencess: SharedPreferences
    lateinit var firebaseAuth: FirebaseAuth
    lateinit var userMail : String
    lateinit var userPassword: String
    lateinit var userNumber:String
    lateinit var userName :String
    lateinit var userAge :String
    lateinit var GenderMale : RadioButton
    lateinit var GenderFemale : RadioButton
    lateinit var GenderOthers : RadioButton
    lateinit var firebaseStorage : FirebaseStorage
    lateinit var image: ImageView
    val PICK_IMAGE = 786
    lateinit var storageReference: StorageReference
    lateinit var firebaseDatabase: FirebaseDatabase
    lateinit var imagePath: Uri
    var bool: Boolean =false

    override fun onCreate(savedInstanceState: Bundle?) {

        title = "Register Yourself"
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        firebaseStorage= FirebaseStorage.getInstance()
        firebaseDatabase= FirebaseDatabase.getInstance()
        firebaseAuth= FirebaseAuth.getInstance()
        GenderMale=findViewById(R.id.male)
        GenderFemale=findViewById(R.id.female)
        GenderOthers=findViewById(R.id.others)
        txtAge=findViewById(R.id.age)
        txtPassword = findViewById(R.id.password)
        txtConfirmPassword = findViewById(R.id.confirmPassword)
        txtName = findViewById(R.id.nameOfuser)
        txtmobileNumber = findViewById(R.id.mobile)
        txtemail = findViewById(R.id.emailid)
        btnRegister = findViewById(R.id.buttonRegister)
        image=findViewById(R.id.userImage)



        image.setOnClickListener{

            val imageIntent: Intent = Intent(Intent.ACTION_GET_CONTENT)
            imageIntent.type = "image/*"
            imageIntent.action = Intent.ACTION_GET_CONTENT

            startActivityForResult(Intent.createChooser(imageIntent,"Select an Image for Profile"),PICK_IMAGE)
        }



        btnRegister.setOnClickListener {


            if (txtPassword.text.isBlank() || txtPassword.text.length < 8) {
                txtPassword.error = "Invalid password 8 numbers min."
                return@setOnClickListener
            }

            if (txtConfirmPassword.text.isBlank()) {
                txtConfirmPassword.error = "Password Empty"
                return@setOnClickListener
            } else if ((txtConfirmPassword.text.toString().toInt()) != txtPassword.text.toString()
                    .toInt()
            ) {
                txtConfirmPassword.error = "Password don't match"
                return@setOnClickListener
            }

            if (txtmobileNumber.text.length < 10 || txtmobileNumber.text.length > 10) {
                txtmobileNumber.error = "Invalid"
                return@setOnClickListener
            }

            if (txtName.text.isBlank() || txtName.text.length < 2) {
            txtName.error = "Field Missing!"
            return@setOnClickListener
        }

            if (txtAge.text.isBlank()) {
                txtAge.error = "Age Missing"
                return@setOnClickListener
            }

            if (txtemail.text.isBlank()) {
                txtemail.error = "Invalid mail"
                return@setOnClickListener
            }

            if (!checkedGender)
            {
                Toast.makeText(this,"Select Your gender",Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            userMail=txtemail.text.toString().trim()
            userPassword=txtConfirmPassword.text.toString().trim()
            userName=txtName.text.toString().trim()
            userAge=txtAge.text.toString().trim()
            userNumber=txtmobileNumber.text.toString().trim()
            firebaseAuth.createUserWithEmailAndPassword(userMail,userPassword).addOnCompleteListener(
                OnCompleteListener {
                    if(it.isSuccessful) {
                        sendEmailVerification()
                    }else
                    {
                        Toast.makeText(this, "Registration Failed.", Toast.LENGTH_SHORT).show()
                    }
                })
        }

    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode==786 && resultCode == RESULT_OK && data?.data != null) {
             imagePath = data.data!!
            val bitmap: Bitmap = MediaStore.Images.Media.getBitmap(contentResolver, imagePath)
            userImage.setImageBitmap(bitmap)
            bool=true
        }
        super.onActivityResult(requestCode, resultCode, data)
    }

    private fun sendEmailVerification(){
        val firebaseUser: FirebaseUser = firebaseAuth.currentUser!!
        firebaseUser.sendEmailVerification().addOnCompleteListener {
            if(it.isSuccessful)
            {
                val storageRef : StorageReference = firebaseStorage.reference
                val database = Firebase.database
                var uid : String = firebaseAuth.uid.toString()
                val myRef = database.getReference(uid)
                if(bool) {

                    val imageRef: StorageReference =
                        storageRef.child(uid).child("Images").child("Profile Picture")
                    val uploadTask: UploadTask = imageRef.putFile(imagePath)
                    uploadTask.addOnFailureListener {
                        Toast.makeText(this, "Could Not upload pic", Toast.LENGTH_SHORT).show()
                    }.addOnCompleteListener {
                        Toast.makeText(this, "Uploaded pic successfully", Toast.LENGTH_SHORT).show()
                    }
                }

                val userProfile = UserProfile(
                    userMail,
                    userName,
                    userNumber,
                    userAge,
                    gender
                )

                myRef.setValue(userProfile)

                Toast.makeText(this, "Registration done. Verify your Email!", Toast.LENGTH_SHORT).show()
                val intent = Intent(
                    this,
                    LoginActivity::class.java
                )
                startActivity(intent)
                finish()

            }else
            {
                Toast.makeText(this, "Registration Failed. Could'nt send email." +
                        "Try Again Later", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onBackPressed(){

            val intent = Intent(this@RegisterActivity,
                LoginActivity::class.java)
            startActivity(intent)
            finish()
        }

    fun onRadioButtonClicked(view: View) {
        if (view is RadioButton) {

            val checked = view.isChecked
            checkedGender = checked

            when (view.getId()) {
                R.id.male ->
                    if (checked) {
                    gender="Male"
                    }
                R.id.female ->
                    if (checked) {
                     gender="Female"
                    }
                R.id.others ->
                    if (checked){
                        gender="Others"
                    }
            }
        }
    }

}