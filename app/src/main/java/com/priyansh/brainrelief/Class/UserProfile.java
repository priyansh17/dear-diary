package com.priyansh.brainrelief.Class;

public class UserProfile {
    private String UserEmail;
    private String UserName;
    private String UserNumber;
    private String UserAge;
    private String UserGender;

    public UserProfile(){

    }

    public UserProfile(String userEmail, String userName, String userNumber, String userAge, String userGender) {
        UserEmail = userEmail;
        UserName = userName;
        UserNumber = userNumber;
        UserAge = userAge;
        UserGender = userGender;
    }

    public String getUserEmail() {
        return UserEmail;
    }

    public void setUserEmail(String userEmail) {
        UserEmail = userEmail;
    }

    public String getUserName() {
        return UserName;
    }

    public void setUserName(String userName) {
        UserName = userName;
    }

    public String getUserNumber() {
        return UserNumber;
    }

    public void setUserNumber(String userNumber) {
        UserNumber = userNumber;
    }

    public String getUserAge() {
        return UserAge;
    }

    public void setUserAge(String userAge) {
        UserAge = userAge;
    }

    public String getUserGender() {
        return UserGender;
    }

    public void setUserGender(String userGender) {
        UserGender = userGender;
    }
}
