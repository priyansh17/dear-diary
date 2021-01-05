package com.priyansh.brainrelief.fragment

import android.accounts.AccountManager.get
import android.annotation.SuppressLint
import android.content.ContentValues.TAG
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.database.*
import com.google.firebase.database.ktx.database
import com.google.firebase.database.ktx.getValue
import com.google.firebase.ktx.Firebase
import com.google.firebase.storage.FirebaseStorage
import com.priyansh.brainrelief.Class.UserProfile
import com.priyansh.brainrelief.R
import com.priyansh.brainrelief.activity.EditDetails
import com.priyansh.brainrelief.activity.MainActivity
import com.squareup.picasso.Picasso
import java.lang.reflect.Array.get


class UserFragment : Fragment() {


    lateinit var username : TextView
    lateinit var phone : TextView
    lateinit var emailid : TextView
    lateinit var age : TextView
    lateinit var gender: TextView
    lateinit var firebaseAuth: FirebaseAuth
    lateinit var firebaseDatabase: FirebaseDatabase
    lateinit var btneditdetails: Button
    lateinit var imageView: ImageView
    lateinit var firebaseStorage: FirebaseStorage

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view=inflater.inflate(R.layout.fragment_user, container, false)

        firebaseAuth= FirebaseAuth.getInstance()
        btneditdetails=view.findViewById(R.id.editDetails)
        firebaseDatabase= FirebaseDatabase.getInstance()
        username = view.findViewById(R.id.username)
        phone = view.findViewById(R.id.mobileNumber)
        emailid = view.findViewById(R.id.emailid)
        age = view.findViewById(R.id.age)
        gender = view.findViewById(R.id.gender)
        imageView=view.findViewById(R.id.userIcon)


        val database = Firebase.database
        var uid : String = firebaseAuth.uid.toString()
        val databaseReference = database.getReference(uid)

        firebaseStorage= FirebaseStorage.getInstance()
        val storageReference= firebaseStorage.reference
        storageReference.child(uid).child("Images/Profile Picture").downloadUrl.addOnSuccessListener {
            Picasso.get().load(it).fit().centerCrop().into(imageView)
        }




        databaseReference.addValueEventListener(object : ValueEventListener {
            @SuppressLint("SetTextI18n")
            override fun onDataChange(dataSnapshot: DataSnapshot) {

                val userProfile= dataSnapshot.getValue<UserProfile>()
                username.text = "Name : "+userProfile?.userName
                phone.text = "Number : "+userProfile?.userNumber
                age.text = "Age : "+userProfile?.userAge
                gender.text = "Gender : "+userProfile?.userGender
                emailid.text = "Email : "+userProfile?.userEmail
            }

            override fun onCancelled(error: DatabaseError) {
                Toast.makeText(activity, error.code, Toast.LENGTH_SHORT).show()
            }
        })


        btneditdetails.setOnClickListener {
            val intent = Intent(activity, EditDetails::class.java)
            startActivity(intent)
            activity?.finish()
        }

        return view
    }


}