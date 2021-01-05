package com.priyansh.brainrelief.activity

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.MediaStore
import android.widget.*
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.ValueEventListener
import com.google.firebase.database.ktx.database
import com.google.firebase.database.ktx.getValue
import com.google.firebase.ktx.Firebase
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference
import com.google.firebase.storage.UploadTask
import com.priyansh.brainrelief.Class.UserProfile
import com.priyansh.brainrelief.R
import com.squareup.picasso.Picasso
import kotlinx.android.synthetic.main.activity_edit_details.*
import kotlinx.android.synthetic.main.activity_register.*

class EditDetails : AppCompatActivity() {

    lateinit var editusername : EditText
    lateinit var editnumber: EditText
    lateinit var editemail:TextView
    lateinit var editage:EditText
    lateinit var editgender:TextView
    lateinit var editDetails: Button
    lateinit var firebaseAuth: FirebaseAuth
    lateinit var firebaseDatabase: FirebaseDatabase
    lateinit var userProfile: UserProfile
    lateinit var imageOfUser: ImageView
    lateinit var firebaseStorage: FirebaseStorage
    val PICK_IMAGE = 786
    var imagePath: Uri? =null
    var flag: Boolean= false
    var flag2: Boolean= false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edit_details)

        editage=findViewById(R.id.editage)
        editusername=findViewById(R.id.editusername)
        editnumber=findViewById(R.id.editmobileNumber)
        editemail=findViewById(R.id.editemailid)
        editgender=findViewById(R.id.editgender)
        editDetails=findViewById(R.id.saveDetails)
        imageOfUser= findViewById(R.id.userImageForEdit)
        firebaseAuth= FirebaseAuth.getInstance()
        firebaseDatabase= FirebaseDatabase.getInstance()



        val database = Firebase.database
        var uid : String = firebaseAuth.uid.toString()
        val databaseReference = database.getReference(uid)

        firebaseStorage= FirebaseStorage.getInstance()
        val storageReference= firebaseStorage.reference
        storageReference.child(uid).child("Images/Profile Picture").downloadUrl.addOnSuccessListener {
            Picasso.get().load(it).fit().centerCrop().into(imageOfUser)
        }




        databaseReference.addValueEventListener(object : ValueEventListener {
            @SuppressLint("SetTextI18n")
            override fun onDataChange(dataSnapshot: DataSnapshot) {

                val userProfile= dataSnapshot.getValue<UserProfile>()
                editusername.setText(userProfile?.userName)
                editnumber.setText(userProfile?.userNumber)
                editage.setText(userProfile?.userAge)
                editgender.text = userProfile?.userGender
                editemail.text = userProfile?.userEmail
            }

            override fun onCancelled(error: DatabaseError) {
                Toast.makeText(this@EditDetails, error.code, Toast.LENGTH_SHORT).show()
            }
        })

        imageOfUser.setOnClickListener{

            flag=true

            val imageIntent: Intent = Intent(Intent.ACTION_GET_CONTENT)
            imageIntent.type = "image/*"
            imageIntent.action = Intent.ACTION_GET_CONTENT
            startActivityForResult(Intent.createChooser(imageIntent,"Select an Image for Profile"),PICK_IMAGE)
        }

        editDetails.setOnClickListener {

            if(flag && flag2) {
                val storageRef: StorageReference = firebaseStorage.reference
                val imageRef: StorageReference =
                    storageRef.child(uid).child("Images").child("Profile Picture")
                val uploadTask: UploadTask? = imagePath?.let { it1 -> imageRef.putFile(it1) }
                if (uploadTask != null) {
                    uploadTask.addOnFailureListener {
                        Toast.makeText(this, "Could Not upload pic", Toast.LENGTH_SHORT).show()
                    }.addOnCompleteListener {
                        Toast.makeText(this, "Uploaded pic successfully", Toast.LENGTH_SHORT).show()
                    }
                }
            }

            if (editnumber.text.length < 10 || editnumber.text.length > 10) {
                editnumber.error = "Invalid"
                return@setOnClickListener
            }

            if (editusername.text.isBlank() || editusername.text.length < 2) {
                editusername.error = "Field Missing!"
                return@setOnClickListener
            }

            if (editage.text.isBlank()) {
                editage.error = "Age Missing"
                return@setOnClickListener
            }

            val name= editusername.text.toString().trim()
            val age= editage.text.toString().trim()
            val mobile = editnumber.text.toString().trim()
            val email= editemail.text.toString().trim()
            val gender=editgender.text.toString().trim()

            userProfile=UserProfile(email,name,mobile,age,gender)
            databaseReference.setValue(userProfile)

            Toast.makeText(this,"Details Updated Successfully",Toast.LENGTH_SHORT).show()
            val intent = Intent(this,
                MainActivity::class.java)
            startActivity(intent)
            finish()

        }

    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode==786 && resultCode == RESULT_OK && data?.data != null) {
            imagePath = data.data!!
            val bitmap: Bitmap = MediaStore.Images.Media.getBitmap(contentResolver, imagePath)
            imageOfUser.setImageBitmap(bitmap)
            flag2=true
        }
        super.onActivityResult(requestCode, resultCode, data)
    }

    override fun onBackPressed(){

        val intent = Intent(this,
        MainActivity::class.java)
        startActivity(intent)
        finish()
    }
}