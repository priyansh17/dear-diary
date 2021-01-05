package com.priyansh.brainrelief.activity

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.MenuItem
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.widget.Toolbar
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import com.chaquo.python.PyObject
import com.chaquo.python.Python
import com.chaquo.python.android.AndroidPlatform
import com.google.android.material.navigation.NavigationView
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.ValueEventListener
import com.google.firebase.database.ktx.database
import com.google.firebase.database.ktx.getValue
import com.google.firebase.ktx.Firebase
import com.google.firebase.storage.FirebaseStorage
import com.priyansh.brainrelief.Class.UserProfile
import com.priyansh.brainrelief.R
import com.priyansh.brainrelief.fragment.*
import com.squareup.picasso.Picasso
import kotlinx.android.synthetic.main.menu_header.*

class MainActivity : AppCompatActivity() {

    lateinit var coordinatorLayout: CoordinatorLayout
    lateinit var drawerLayout: DrawerLayout
    lateinit var toolbar: Toolbar
    lateinit var frameLayout: FrameLayout
    var previousMenuitem : MenuItem? = null
    lateinit var sharedPreferencess: SharedPreferences
    lateinit var firebaseDatabase: FirebaseDatabase
    lateinit var firebaseAuth: FirebaseAuth
    lateinit var navigationView: NavigationView
    lateinit var textName: TextView
    lateinit var firebaseStorage: FirebaseStorage
    lateinit var textNumber: TextView
    lateinit var userImage: ImageView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)


        sharedPreferencess=getSharedPreferences(getString(R.string.shared_preferences), Context.MODE_PRIVATE)
        drawerLayout = findViewById(R.id.drawerlayout)
        coordinatorLayout = findViewById(R.id.coordinatorlayout)
        toolbar = findViewById(R.id.toolbar)
        frameLayout = findViewById(R.id.framelayout)
        navigationView = findViewById(R.id.navigationview)
        val headerView=navigationView.getHeaderView(0)
        firebaseAuth= FirebaseAuth.getInstance()
        textName=headerView.findViewById(R.id.TextForName)
        textNumber=headerView.findViewById(R.id.TextForNumber)
        userImage= headerView.findViewById(R.id.userImageForHome)
        firebaseDatabase= FirebaseDatabase.getInstance()



        setUpToolbar()

        val actionBarDrawerToggle = ActionBarDrawerToggle(
            this@MainActivity, drawerLayout,
            R.string.open,
            R.string.close
        )
        drawerLayout.addDrawerListener(actionBarDrawerToggle)
        actionBarDrawerToggle.syncState()

        supportFragmentManager.beginTransaction().replace(
            R.id.framelayout,
            HomeFragment()
        ).commit()

        supportActionBar?.title= "Dear Diary"
        drawerLayout.closeDrawers()
        navigationView.setCheckedItem(R.id.mainhome)


        val database = Firebase.database
        var uid : String = firebaseAuth.uid.toString()
        val databaseReference = database.getReference(uid)


        firebaseStorage= FirebaseStorage.getInstance()
        val storageReference= firebaseStorage.reference
        storageReference.child(uid).child("Images/Profile Picture").downloadUrl.addOnSuccessListener {
            Picasso.get().load(it).fit().centerCrop().into(userImage)
        }

        databaseReference.addValueEventListener(object : ValueEventListener {
            @SuppressLint("SetTextI18n")
            override fun onDataChange(dataSnapshot: DataSnapshot) {

                val userProfile= dataSnapshot.getValue<UserProfile>()
                textName.text = userProfile?.userName
                textNumber.text = userProfile?.userNumber

            }

            override fun onCancelled(error: DatabaseError) {
                Toast.makeText(this@MainActivity, error.code, Toast.LENGTH_SHORT).show()
            }
        })

        navigationView.setNavigationItemSelectedListener {

            if (previousMenuitem != null) {
                previousMenuitem?.isChecked = false
            }

            it.isCheckable = true
            it.isChecked = true
            previousMenuitem = it

            when (it.itemId) {
                R.id.mainhome -> {
                    supportFragmentManager.beginTransaction().replace(
                        R.id.framelayout,
                        HomeFragment()
                    ).commit()
                    supportActionBar?.title= "Dear Diary"
                    drawerLayout.closeDrawers()
                    navigationView.setCheckedItem(R.id.mainhome)
                }


                R.id.profile -> {
                    supportFragmentManager.beginTransaction().replace(
                        R.id.framelayout,
                        UserFragment()
                    ).commit()
                    supportActionBar?.title= "User Profile"
                    drawerLayout.closeDrawers()
                    navigationView.setCheckedItem(R.id.profile)
                }

                R.id.Favourites -> {
                    supportFragmentManager.beginTransaction().replace(
                        R.id.framelayout,
                        RecommendationFragment()
                    ).commit()
                    supportActionBar?.title= "Recommendations"
                    drawerLayout.closeDrawers()
                    navigationView.setCheckedItem(R.id.Favourites)

                }

                R.id.faqs -> {
                    /*supportFragmentManager.beginTransaction().replace(
                        R.id.framelayout,
                        faqsFragment()
                    ).commit()
                    supportActionBar?.title= "FAQs"
                    drawerLayout.closeDrawers()
                    navigationView.setCheckedItem(R.id.faqs)*/
                    val intent = Intent(this, UserInterests::class.java)
                    startActivity(intent)
                    finish()
                }

               R.id.previousDiary -> {
                   val intent = Intent(this, DiaryEntryActivity::class.java)
                   startActivity(intent)
                   finish()

                }


                R.id.logout -> {
                    val Dialog = AlertDialog.Builder(this@MainActivity)
                    Dialog.setTitle("Confirmation")
                    Dialog.setMessage("Are you sure you want to exit?")
                    Dialog.setPositiveButton("Yes"){ _, _ ->
                        val intent = Intent(this@MainActivity, LoginActivity::class.java)
                        startActivity(intent)
                        firebaseAuth.signOut()
                        sharedPreferencess.edit().clear().apply()
                        finish()

                        ///Piece of code of shared preferences yet to be added
                    }
                    Dialog.setNegativeButton("No"){text, listener ->
                        supportFragmentManager.beginTransaction().replace(
                            R.id.framelayout,
                            HomeFragment()
                        ).commit()
                        supportActionBar?.title= "Dear diary"
                        drawerLayout.closeDrawers()
                        navigationView.setCheckedItem(R.id.mainhome)

                    }
                    Dialog.create()
                    Dialog.show()

                    drawerLayout.closeDrawers()
                    navigationView.setCheckedItem(R.id.logout)
                }

            }

            return@setNavigationItemSelectedListener true
        }


    }
    fun setUpToolbar() {
        setSupportActionBar(toolbar)
        supportActionBar?.title= "Dear Diary"
        supportActionBar?.setHomeButtonEnabled(true)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {

        val id = item.itemId

        if(id== android.R.id.home)
            drawerLayout.openDrawer(GravityCompat.START)

        return super.onOptionsItemSelected(item)
    }

    override fun onBackPressed() {
        val frag = supportFragmentManager.findFragmentById(R.id.framelayout)

        when(frag)
        {
            !is HomeFragment -> {
                supportFragmentManager.beginTransaction().replace(
                    R.id.framelayout,
                    HomeFragment()
                ).commit()
                supportActionBar?.title="Dear Diary"
                drawerLayout.closeDrawers()
                navigationView.setCheckedItem(R.id.mainhome)
            }

            else -> super.onBackPressed()
        }
    }
}